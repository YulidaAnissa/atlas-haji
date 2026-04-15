"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/configs";
import { accessTokenStorage, profileStorage } from "@/utils/storage";

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

      if (!res.ok) {
        const errorData = await res.json();
        setError("Autentikasi gagal. Periksa kembali username dan password Anda.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("activeMenu", "Dashboard");
      accessTokenStorage.set(
        data.token,
        { expires: new Date(data.expiredAt) }
      );
      profileStorage.set(data?.profile);
      
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return { login, logout, loading, error };
}