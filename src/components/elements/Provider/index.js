"use client";

import { useEffect, useRouter } from "react";
import { usePathname } from "next/navigation";
import { reloadChannel } from "@/utils/broadcastChannel";
import { autoRefreshToken } from "@/hooks/useRefreshToken";
import { accessTokenStorage } from "@/utils/storage";

export default function Providers({ children }) {
  const pathname = usePathname();
  // const router = useRouter();

  const handleRefreshToken = (triggerSource) => {
    // 1. Cek apakah token ada (sesuaikan dengan tempat penyimpanan token Anda)
    // Contoh jika token disimpan di localStorage dengan key "token" atau "refreshToken":
    const token = accessTokenStorage.get()?.value;
    
    // Atau jika Anda menggunakan Cookies, bisa gunakan document.cookie atau helper cookie.
    // Contoh sederhana cek cookie: const hasToken = document.cookie.includes("refreshToken=");
    console.log(token, "token ditemukan di storage, trigger:", triggerSource);
    if (!token) {
      console.log(`[Auth] Dilewati (${triggerSource}): Tidak ada token yang ditemukan.`);
      return;
    }

    // 2. Jika token ada, jalankan refresh
    console.log(`[Auth] Token direfresh karena: ${triggerSource}`);
    autoRefreshToken();
  };

  // 1. Trigger otomatis setiap kali `pathname` (router) berubah
  useEffect(() => {
    handleRefreshToken("router-change");
  }, [pathname]);


  // 3. Inisialisasi awal saat aplikasi pertama kali dimuat
  useEffect(() => {
    reloadChannel.listen();
    handleRefreshToken("initial-load");
  }, []);

  return <>{children}</>;
}