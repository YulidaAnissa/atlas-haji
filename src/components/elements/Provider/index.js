"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { reloadChannel } from "@/utils/broadcastChannel";
import { autoRefreshToken } from "@/hooks/useRefreshToken";
import { accessTokenStorage } from "@/utils/storage";

export default function Providers({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // Diaktifkan agar bisa redirect ke login
  
  const isFirstRender = useRef(true);

  const handleRefreshToken = (triggerSource) => {
    const token = accessTokenStorage.get()?.value;
    
    if (!token) {
      console.log(`langsung logout karena token tidak ditemukan (${triggerSource})`);
      accessTokenStorage.remove();
      router.push("/login");
      return;
    } else {
      autoRefreshToken();
      console.log(`refresh token berhasil dipicu (${triggerSource})`);
    }
  };

  // 1. Jalankan pengecekan token saat initial load DAN saat pindah halaman
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Tetap jalankan saat pertama kali buka aplikasi
      handleRefreshToken("initial-load");
      return; 
    }

    // Berjalan saat ada perubahan pathname (pindah halaman)
    handleRefreshToken("router-change");
  }, [pathname]);

  // 2. Inisialisasi Broadcast Channel (Opsional jika dipakai untuk sinkronisasi antar tab)
  useEffect(() => {
    if (reloadChannel && typeof reloadChannel.listen === "function") {
      reloadChannel.listen();
    }
  }, []);

  // 3. Deteksi Idle (Tidak ada aktivitas selama 10 menit)
  useEffect(() => {
    let idleTimeout;

    const handleLogout = () => {
      console.log("Tidak ada aktivitas selama 10 menit, sesi dimatikan.");
      accessTokenStorage.remove(); 
      router.push('/login'); // Arahkan otomatis ke halaman login
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      // Set timer 10 menit untuk mematikan sesi jika user diam
      idleTimeout = setTimeout(handleLogout, 10 * 60 * 1000); 
    };

    // Event aktivitas user
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Inisialisasi awal timer idle
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimeout);
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [router]);

  return <>{children}</>;
}