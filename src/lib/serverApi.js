import { cookies } from "next/headers";

const SERVICE_BASE = process.env.SERVICE_BASE;

export async function serverApi(path, options = {}) {
  if (!SERVICE_BASE) {
    throw new Error("SERVICE_BASE belum diset di .env.local");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${SERVICE_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}