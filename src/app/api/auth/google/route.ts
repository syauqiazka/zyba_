import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  // ── Tentukan base URL yang benar (sama dengan logic di callback) ──────────
  const fwdHost =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || "";
  const fwdProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "";

  const envBase = (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    ""
  ).replace(/\/$/, "");

  let baseUrl: string;

  if (fwdHost && fwdHost !== "localhost" && !fwdHost.startsWith("127.")) {
    const proto = fwdProto || "https";
    baseUrl = `${proto}://${fwdHost}`;
  } else if (envBase && !envBase.includes("localhost")) {
    baseUrl = envBase;
  } else {
    const h = request.nextUrl.hostname;
    const p = h === "localhost" || h === "127.0.0.1" ? "http" : "https";
    baseUrl = `${p}://${request.nextUrl.host}`;
  }

  // Override paksa ke domain production kalau env menunjuk ke sana
  if (envBase && envBase.includes("jhic.zyba.my.id")) {
    baseUrl = "https://jhic.zyba.my.id";
  }

  console.log("[Google OAuth Init] baseUrl:", baseUrl, "| fwdHost:", fwdHost, "| envBase:", envBase);

  if (!clientId) {
    return NextResponse.redirect(`${baseUrl}/login?error=server_config_error`);
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
    prompt: "select_account",
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
