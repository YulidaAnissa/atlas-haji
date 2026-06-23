import { NextResponse } from "next/server";
import { ACCESS_TOKEN_STORAGE } from "@/configs";
import { decrypt } from "@/utils/crypto";

const BACKEND_URL = process.env.SERVICE_BASE;

async function handler(req, context) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "SERVICE_BASE belum diset di .env.local" },
        { status: 500 }
      );
    }

    const params = await context.params;
    const path = Array.isArray(params.path)
      ? params.path.join("/")
      : params.path;

    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/${path}${url.search}`;

    let body;

    if (!["GET", "HEAD"].includes(req.method)) {
      body = await req.arrayBuffer();
    }

    const token = decrypt(req.cookies.get(ACCESS_TOKEN_STORAGE)?.value);
    const requestContentType = req.headers.get("content-type");

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Accept: "application/json",
        ...(requestContentType ? { "Content-Type": requestContentType } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      cache: "no-store",
    });

    const responseContentType = response.headers.get("content-type") || "";

    if (responseContentType.includes("application/json")) {
      const data = await response.json();

      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
    });
  } catch (error) {
    console.error("Proxy error detail:", error);

    return NextResponse.json(
      {
        message: "Proxy API error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;