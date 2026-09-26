import { NextRequest, NextResponse } from "next/server";
import { userRepository, StoredUser } from "@/backend/auth/userRepository";
import { createSessionToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // ── Tentukan base URL yang benar ──────────────────────────────────────────
  // Di balik reverse proxy Apache, request.url = http://localhost:30000/...
  // Kita harus pakai x-forwarded-host agar redirect ke domain publik yang benar.
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
    // Request masuk via reverse proxy domain publik
    const proto = fwdProto || "https";
    baseUrl = `${proto}://${fwdHost}`;
  } else if (envBase && !envBase.includes("localhost") && !envBase.startsWith("http://127.")) {
    // Fallback ke NEXTAUTH_URL
    baseUrl = envBase;
  } else if (
    process.env.NODE_ENV === "production" ||
    request.nextUrl.port === "30000" ||
    request.nextUrl.host.includes("30000")
  ) {
    // Di server Webuzo, aplikasi berjalan di port 30000 di balik Apache proxy
    baseUrl = "https://jhic.zyba.my.id";
  } else {
    // Dev lokal
    const h = request.nextUrl.hostname;
    const p = h === "localhost" || h === "127.0.0.1" ? "http" : "https";
    baseUrl = `${p}://${request.nextUrl.host}`;
  }

  // Override paksa jika ada indikasi jhic.zyba.my.id
  if (envBase && envBase.includes("jhic.zyba.my.id")) {
    baseUrl = "https://jhic.zyba.my.id";
  }

  console.log("[Google OAuth Callback] baseUrl:", baseUrl, "| fwdHost:", fwdHost, "| envBase:", envBase);

  /** Helper: buat redirect dengan baseUrl yang sudah benar */
  const redirect = (path: string) =>
    NextResponse.redirect(`${baseUrl}${path}`);

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Tangani jika otentikasi dibatalkan di halaman Google
  if (error) {
    console.warn("Google OAuth error:", error);
    return redirect("/login?error=oauth_cancelled");
  }

  if (!code) {
    return redirect("/login?error=missing_code");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Kredensial GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diset.");
    return redirect("/login?error=server_config_error");
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
      return redirect("/login?error=token_exchange_failed");
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
      return redirect("/login?error=profile_fetch_failed");
    }

    const googleUser = await userInfoResponse.json();
    const email = (googleUser.email || "").toLowerCase().trim();
    const name =
      googleUser.name ||
      googleUser.given_name ||
      email.split("@")[0] ||
      "Zyba Member";

    if (!email) {
      return redirect("/login?error=no_email_provided");
    }

    // 3. Cari atau buat user di sistem ZYBA
    let user: StoredUser | null = null;
    let isNewUser = false;

    try {
      user = await userRepository.findByEmail(email);
    } catch (dbError: any) {
      console.warn("[Google OAuth] DB findByEmail warning:", dbError.message);
    }

    if (!user) {
      isNewUser = true;
      const dummyPasswordHash = await bcrypt.hash(
        `google_${Date.now()}_${Math.random()}`,
        12
      );
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
        console.warn("[Google OAuth] User create fallback to memory:", createError.message);
        user = {
          id: `user_google_${Date.now()}`,
          email,
          name,
          passwordHash: dummyPasswordHash,
          avatarUrl: "fox",
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      console.log(
        "[Google OAuth] Existing user found:",
        user.id,
        email,
        "onboardingCompleted:",
        user.onboardingCompleted
      );
    }

    // 4. Terbitkan signed JWT session token (AGENTS.md Bagian 8.2)
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      onboardingCompleted: user.onboardingCompleted ?? false,
    });

    // 5. Redirect pengguna baru ke Asesmen Awal, pengguna lama ke Dashboard
    const destination =
      isNewUser || !user.onboardingCompleted ? "/assessment" : "/dashboard";
    const response = redirect(destination);

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
    return redirect("/login?error=auth_internal_error");
  }
}
