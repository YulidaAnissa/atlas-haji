import { SERVICES } from "@/configs";
import { accessTokenStorage, refreshTokenStorage } from "@/utils/storage";

let refreshTimer = null; // Untuk mencegah duplikasi timer/interval

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

    // PASTIKAN KEY OBJECT SESUAI DENGAN YANG DIBACA OLEH storage ANDA
    // Jika helper storage Anda menggunakan 'expire', sesuaikan menjadi expire: ...
    const newExpiredDate = new Date(data.expiredAt);
    
    accessTokenStorage.set(data.token, { 
      ctx: ctx,
      expire: newExpiredDate, // Sesuaikan ke 'expire' atau 'expires' tergantung helper storage.js Anda
      expires: newExpiredDate 
    });

    // if (typeof window !== "undefined") {
    //   window.location.reload();
    // }

    return data;
  } catch (error) {
    console.error("Gagal melakukan post refresh token:", error);
    return Promise.reject(error);
  }
}

export function autoRefreshToken(ctx) {
  // Bersihkan timer lama jika fungsi dipanggil berulang kali (misal saat router-change / scroll)
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const tokenData = accessTokenStorage.get(ctx);
  console.log("Mengecek auto refresh token...", tokenData);

  const accessTokenExpire = tokenData?.expire || tokenData?.expires;

  if (!accessTokenExpire) {
    console.log("Tidak ada masa aktif token ditemukan di storage.");
    return;
  }

  const expireDistance = getExpireDistance(accessTokenExpire);
  console.log(`Jarak waktu kadaluarsa token: ${expireDistance} ms`);

  // Jika token sudah kadaluarsa atau hampir habis (< 70 detik)
  if (expireDistance < 70 * 1000) {
    postRefreshToken(ctx).catch(() => {});
    return;
  }

  // Jadwalkan refresh 30 detik sebelum token benar-benar habis
  const timeoutDelay = expireDistance - 30000;

  refreshTimer = setTimeout(async () => {
    try {
      await postRefreshToken(ctx);
      // Setelah berhasil refresh pertama, jadwalkan ulang secara berkala (misal tiap 5-9 menit)
      startPeriodicRefresh(ctx);
    } catch (e) {
      console.error("Auto refresh berkala gagal:", e);
    }
  }, timeoutDelay);
}

function startPeriodicRefresh(ctx) {
  const refreshTokenInterval = 1000 * 60 * 1; // Interval tiap 5 menit (sesuaikan kebutuhan)
  
  setInterval(async () => {
    const tokenData = accessTokenStorage.get(ctx);
    const expireTime = tokenData?.expire || tokenData?.expires;

    if (!expireTime) return;

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