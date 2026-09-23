import { NextRequest, NextResponse } from "next/server";
import { userRepository, StoredUser } from "@/backend/auth/userRepository";
import { createSessionToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");

  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Tangani jika otentikasi dibatalkan oleh pengguna di halaman Google
  if (error) {
    console.warn("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_cancelled", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Kredensial GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diset.");
    return NextResponse.redirect(new URL("/login?error=server_config_error", request.url));
  }

  try {
    // 1. Tukar authorization code dengan access token & id token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Gagal menukar token Google:", errText);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Ambil informasi profil dari Google UserInfo API
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Gagal mengambil info profil Google");
      return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", request.url));
    }

    const googleUser = await userInfoResponse.json();
    const email = (googleUser.email || "").toLowerCase().trim();
    const name = googleUser.name || googleUser.given_name || email.split("@")[0] || "Zyba Member";

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email_provided", request.url));
    }

    // 3. Cari atau buat user di sistem ZYBA
    let user: StoredUser | null = null;
    let isNewUser = false;

    try {
      user = await userRepository.findByEmail(email);
    } catch (dbError: any) {
      console.error("[Google OAuth] DB connection failed:", dbError.message);
      return NextResponse.redirect(new URL("/login?error=database_unavailable", request.url));
    }

    if (!user) {
      isNewUser = true;
      const dummyPasswordHash = await bcrypt.hash(`google_${Date.now()}_${Math.random()}`, 12);
      try {
        user = await userRepository.create({
          email,
          name,
          passwordHash: dummyPasswordHash,
          avatarUrl: "fox",
          onboardingCompleted: false,
        });
        console.log("[Google OAuth] Created new user:", user.id, email);
      } catch (createError: any) {
        console.error("[Google OAuth] Failed to create user:", createError.message);
        return NextResponse.redirect(new URL("/login?error=user_creation_failed", request.url));
      }
    } else {
      console.log("[Google OAuth] Existing user found:", user.id, email, "onboardingCompleted:", user.onboardingCompleted);
    }

    // 4. Terbitkan signed JWT session token (AGENTS.md Bagian 8.2)
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      onboardingCompleted: user.onboardingCompleted ?? false,
    });

    // 5. Redirect pengguna baru ke Asesmen Awal, pengguna lama ke Dashboard
    const destination = isNewUser || !user.onboardingCompleted ? "/assessment" : "/dashboard";
    const response = NextResponse.redirect(new URL(destination, request.url));

    response.cookies.set("auth-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    // Bersihkan cookie temporary state
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (err) {
    console.error("Error pada callback Google OAuth:", err);
    return NextResponse.redirect(new URL("/login?error=auth_internal_error", request.url));
  }
}
