"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/configs";
import { accessTokenStorage, profileStorage, refreshTokenStorage } from "@/utils/storage";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (values) => {
    const { username, password } = values;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(SERVICES.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Autentikasi gagal. Periksa kembali username dan password Anda.");
        return data;
      }

      console.log("refreshTokenStorage.get():", data?.refreshToken);
      // Simpan data sesi
      localStorage.setItem("activeMenu", "Dashboard");
      accessTokenStorage.set(
        data.token,
        { expires: new Date(data.expiredAt) }
      );
      refreshTokenStorage.set(
        data.refreshToken,
        { expires: new Date(data.refreshExpiredAt) }
      );
      profileStorage.set(data?.profile);
      
      // Refresh cache router Next.js agar status sesi terbaca, lalu pindah halaman
      router.refresh();
      router.push("/dashboard");
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Terjadi kesalahan pada sistem.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    accessTokenStorage.remove();
    refreshTokenStorage.remove();
    profileStorage.remove();
    router.push("/login");
  };

  return { login, logout, loading, error };
}