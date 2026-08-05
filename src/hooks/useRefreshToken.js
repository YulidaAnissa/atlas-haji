import { SERVICES } from "@/configs";
import { accessTokenStorage, refreshTokenStorage } from "@/utils/storage";

let refreshTimer = null; 
let periodicTimer = null; // Diubah agar interval bisa di-clear untuk mencegah memory leak

export async function postRefreshToken(ctx) {
  const refreshTokenObj = refreshTokenStorage.get(ctx);

  if (!refreshTokenObj || !refreshTokenObj.value) {
    return Promise.reject(new Error("Refresh token tidak ditemukan"));
  }

  try {
    const response = await fetch(SERVICES.REFRESH_TOKEN, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        refreshToken: refreshTokenObj.value 
      })
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        refreshTokenStorage.remove(ctx);
        accessTokenStorage.remove(ctx);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Token berhasil diperbarui dari server:", data);

    const newExpiredDate = new Date(data.expiredAt);
    
    accessTokenStorage.set(data.token, { 
      ctx: ctx,
      expire: newExpiredDate, 
      expires: newExpiredDate 
    });

    // Panggil kembali autoRefreshToken agar siklus timer refresh berikutnya terjadwal ulang
    autoRefreshToken(ctx);

    return data;
  } catch (error) {
    console.error("Gagal melakukan post refresh token:", error);
    return Promise.reject(error);
  }
}

export function autoRefreshToken(ctx) {
  // Bersihkan timer lama untuk mencegah duplikasi
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const tokenData = accessTokenStorage.get(ctx);
  const accessTokenExpire = tokenData?.expire || tokenData?.expires;

  if (!accessTokenExpire) {
    console.log("Tidak ada masa aktif token ditemukan di storage.");
    return;
  }

  const expireDistance = getExpireDistance(accessTokenExpire);

  // Jika token sudah mati total
  if (expireDistance <= 0) {
    console.log("Token sudah kadaluarsa.");
    accessTokenStorage.remove(ctx);
    refreshTokenStorage.remove(ctx);
    return;
  }

  // Jika waktu kurang dari 70 detik, langsung refresh sekarang
  if (expireDistance < 70 * 1000) {
    postRefreshToken(ctx).catch(() => {});
    return;
  }

  // Jadwalkan refresh 30 detik sebelum token benar-benar habis
  const timeoutDelay = expireDistance - 30000;

  refreshTimer = setTimeout(async () => {
    try {
      await postRefreshToken(ctx);
      console.log("Token berhasil diperpanjang otomatis.");
    } catch (e) {
      console.error("Auto refresh gagal:", e);
    }
  }, timeoutDelay);

  // Jalankan periodic refresh untuk pengaman berkala (pastikan dibersihkan dulu)
  startPeriodicRefresh(ctx);
}

function startPeriodicRefresh(ctx) {
  // Bersihkan interval lama jika sudah ada
  if (periodicTimer) {
    clearInterval(periodicTimer);
    periodicTimer = null;
  }

  const refreshTokenInterval = 1000 * 60 * 9; // Interval tiap 9 menit
  
  periodicTimer = setInterval(async () => {
    const tokenData = accessTokenStorage.get(ctx);
    const expireTime = tokenData?.expire || tokenData?.expires;

    if (!expireTime) {
      clearInterval(periodicTimer);
      return;
    }

    const expireDistance = getExpireDistance(expireTime);
    console.log('Cek berkala jarak waktu token (ms):', expireDistance);

    if (expireDistance < 70 * 1000) {
      await postRefreshToken(ctx).catch(() => {});
    }
  }, refreshTokenInterval);
}

function getExpireDistance(expire) {
  const accessTokenExpireTime = new Date(expire).getTime();
  const currentTime = new Date().getTime();
  return accessTokenExpireTime - currentTime;
}