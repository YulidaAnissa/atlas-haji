// middleware.js
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_STORAGE } from "@/configs";
import { decrypt } from "@/utils/crypto";
import { jwtVerify } from "jose";


export async function proxy(req) {
  const tokenDecrypt = decrypt(req.cookies.get(ACCESS_TOKEN_STORAGE)?.value);
  const token = tokenDecrypt;
  const { pathname } = req.nextUrl;
  const protectedPaths = ["/dashboard", "/perjalanan-dinas", "/profile"];

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      const secret = new TextEncoder().encode("SECRET_KEY");
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|register|public).*)",
  ],
};