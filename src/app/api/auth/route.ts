import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/backend/auth/userRepository";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/server/rateLimit";
import { invalidateUserMeCache, invalidateDailyAssessmentCache } from "@/lib/server/userMeCache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, otp, name, password, recaptchaToken } = body;
    const action = (body.action || "").toUpperCase();

    // =========================
    // ACCEPT TERMS
    // =========================
    // =========================
    // ACCEPT TERMS
    // =========================
    if (action === "ACCEPT_TERMS") {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return NextResponse.json(
          { error: "User tidak ditemukan." },
          { status: 404 }
        );
      }

      const acceptedAt = new Date();

      await userRepository.update(user.id, {
        termsAcceptedAt: acceptedAt.toISOString(),
        termsVersion: "1.0",
      });

      return NextResponse.json({
        success: true,
        termsAcceptedAt: acceptedAt.toISOString(),
        termsVersion: "1.0",
      });
    }

    // Update Profile after Setup
    if (action === "UPDATE_PROFILE") {
      const targetEmail = email;
      if (!targetEmail) {
        return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
      }

      const updated = await userRepository.update(targetEmail, {
        name: name || undefined,
        phone: body.phone || undefined,
        location: body.location || undefined,
        avatarUrl: body.avatarUrl || undefined,
        communicationStyle: body.communicationStyle || undefined,
        onboardingCompleted: true,
      });

      return NextResponse.json({
        success: true,
        user: updated,
      });
    }

    // Check if email already registered
    if (action === "CHECK_EMAIL") {
      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }

      const normalized = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalized)) {
        return NextResponse.json(
          { error: "Format email tidak valid. Masukkan alamat email yang benar." },
          { status: 400 }
        );
      }

      const existingUser = await userRepository.findByEmail(normalized);
      if (existingUser) {
        return NextResponse.json(
          { error: "Email ini sudah terdaftar. Silakan masuk ke akun Anda atau gunakan email lain." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        available: true,
        message: "Email tersedia untuk pendaftaran.",
      });
    }

    if (action === "SIGNUP") {
      const clientIp = getClientIp(request);
      const limitCheck = await checkRateLimit(`signup:${clientIp}`, 10, 60);
      if (!limitCheck.allowed) {
        return rateLimitResponse(limitCheck.retryAfterSec, "Terlalu banyak permintaan pendaftaran akun.");
      }

      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }
      if (!recaptchaToken) {
        return NextResponse.json({ error: "Verifikasi reCAPTCHA wajib dilakukan." }, { status: 400 });
      }

      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      if (!recaptchaSecret) {
        console.error("[auth] RECAPTCHA_SECRET_KEY is not configured");
        return NextResponse.json({ error: "Verifikasi keamanan belum dikonfigurasi server." }, { status: 503 });
      }

      const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: recaptchaToken,
          remoteip: clientIp,
        }),
        cache: "no-store",
      });
      const captchaResult = await captchaResponse.json() as {
        success?: boolean;
        score?: number;
        action?: string;
        hostname?: string;
        ["error-codes"]?: string[];
      };

      // reCAPTCHA v3 berjalan tanpa checkbox. Hanya izinkan token
      // yang valid, berasal dari action signup, dan memiliki skor aman.
      if (
        !captchaResponse.ok ||
        !captchaResult.success ||
        captchaResult.action !== "signup" ||
        typeof captchaResult.score !== "number" ||
        captchaResult.score < 0.5
      ) {
        return NextResponse.json(
          { error: "Verifikasi keamanan gagal. Silakan coba lagi." },
          { status: 400 }
        );
      }

      const normalized = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalized)) {
        return NextResponse.json({ error: "Format email tidak valid. Masukkan alamat email yang benar." }, { status: 400 });
      }

      const existingUser = await userRepository.findByEmail(normalized);
      if (existingUser) {
        return NextResponse.json(
          { error: "Email ini sudah terdaftar. Silakan masuk ke akun Anda atau gunakan email lain." },
          { status: 400 }
        );
      }

      if (!password || password.length < 8) {
        return NextResponse.json({ error: "Password wajib diisi dan minimal 8 karakter." }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await userRepository.create({
        email: normalized,
        name: name || normalized.split("@")[0],
        passwordHash,
        onboardingCompleted: false,
      });

      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: (user.role as any) || "USER",
        onboardingCompleted: false,
      });

      invalidateUserMeCache(user.id);
      invalidateDailyAssessmentCache(user.id);

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionToken,
      });

      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    if (action === "LOGIN") {
      const clientIp = getClientIp(request);
      const limitCheck = await checkRateLimit(`login:${clientIp}`, 10, 60);
      if (!limitCheck.allowed) {
        return rateLimitResponse(limitCheck.retryAfterSec, "Terlalu banyak percobaan masuk yang gagal.");
      }

      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }

      let user = await userRepository.findByEmail(email);

      if (!user) {
        return NextResponse.json(
          { error: "Email tidak terdaftar" },
          { status: 401 }
        );
      }

      // Security: Validasi password dengan bcrypt.compare (AGENTS.md Bagian 8.1)
      const inputPassword = password || "";
      let valid = false;
      try {
        valid = await bcrypt.compare(inputPassword, user.passwordHash);
      } catch {
        valid = false;
      }

      // Fallback migrasi jika user dibuat sebelum password di-hash
      if (!valid && user.passwordHash === inputPassword) {
        valid = true;
        const newHash = await bcrypt.hash(inputPassword, 12);
        await userRepository.update(user.id, { passwordHash: newHash });
      }

      if (!valid) {
        return NextResponse.json({ error: "Password salah" }, { status: 401 });
      }

      // Security: Ganti session token dengan signed JWT (AGENTS.md Bagian 8.2)
      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: (user.role as any) || "USER",
        onboardingCompleted: user.onboardingCompleted ?? false,
      });

      // Invalidate server cache on fresh login so newly logged in user stats are 100% fresh
      invalidateUserMeCache(user.id);
      invalidateDailyAssessmentCache(user.id);

      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role as any) || "USER",
          zybaScore: user.zybaScore,
          termsAcceptedAt: user.termsAcceptedAt,
          termsVersion: user.termsVersion,
          onboardingCompleted: user.onboardingCompleted ?? false,
        },
        token: sessionToken,
      });

      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error?.message || "Server error", detail: String(error?.stack || error) },
      { status: 500 }
    );
  }
}

// Logout: hapus cookie auth-token dan bersihkan cache
export async function DELETE() {
  invalidateUserMeCache();
  invalidateDailyAssessmentCache();

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expire immediately
  });
  return response;
}