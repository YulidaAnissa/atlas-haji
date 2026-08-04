"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reloadChannel } from "@/utils/broadcastChannel";
import { autoRefreshToken } from "@/hooks/useRefreshToken";

export default function Providers({ children }) {
  const pathname = usePathname();

  const handleRefreshToken = (triggerSource) => {
    console.log(`[Auth] Token direfresh karena: ${triggerSource}`);
    autoRefreshToken();
  };

  // 1. Trigger otomatis setiap kali `pathname` berubah
  useEffect(() => {
    handleRefreshToken("router-change");
  }, [pathname]);

  // 2. Inisialisasi awal & Background Interval saat tidak ada aktivitas
  useEffect(() => {
    reloadChannel.listen();
    handleRefreshToken("initial-load");

    // Set interval misalnya setiap 10 menit (600.000 ms) 
    // Sesuaikan durasi ini dengan masa aktif (expiry time) token Anda.
    const intervalTime = 10 * 60 * 1000; 
    const intervalId = setInterval(() => {
      handleRefreshToken("background-interval");
    }, intervalTime);

    // Cleanup interval saat component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
}