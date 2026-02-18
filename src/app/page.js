"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { accessTokenStorage } from "@/utils/storage";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = accessTokenStorage.get().value;;
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}