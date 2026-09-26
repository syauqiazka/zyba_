import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "server_config_error");
    return NextResponse.redirect(loginUrl);
  }

  // Tentukan base URL: utamakan host live dari request / NEXTAUTH_URL
  const reqHost =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.split(":")[0]?.trim() ||
    request.nextUrl.hostname;

  const reqProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (reqHost.includes("localhost") || reqHost.includes("127.0.0.1") ? "http" : "https");

  let baseUrl = `${reqProto}://${reqHost}`;
  const envBase = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL;

  if (reqHost.includes("localhost") || reqHost.includes("127.0.0.1")) {
    if (envBase && !envBase.includes("localhost")) {
      baseUrl = envBase.replace(/\/$/, "");
    }
  } else if (reqHost.includes("zyba.my.id") || envBase?.includes("jhic.zyba.my.id")) {
    // Sesuai registrasi Google Cloud Console, selalu gunakan https://jhic.zyba.my.id
    baseUrl = "https://jhic.zyba.my.id";
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // State untuk mitigasi CSRF
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account", // Memunculkan "Choose an account" seperti di akun Google resmi
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(googleAuthUrl);

  // Simpan state di cookie jangka pendek (10 menit) untuk validasi callback
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
