import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/backend/auth/userRepository";
import bcrypt from "bcryptjs";
import { createSessionToken, verifySessionToken } from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/server/rateLimit";
import { invalidateUserMeCache, invalidateDailyAssessmentCache } from "@/lib/server/userMeCache";
import { verifyOtpProof, verifyOtpVerifiedProof, proofCookieNameForPurpose } from "@/lib/otpChallenge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, name, password } = body;
    const action = (body.action || "").toUpperCase();

    // =========================
    // ACCEPT TERMS
    // =========================
    if (action === "ACCEPT_TERMS") {
      const token =
        request.cookies.get("auth-token")?.value ||
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

      if (!token) {
        return NextResponse.json(
          { error: "Sesi autentikasi diperlukan untuk menyetujui syarat & ketentuan." },
          { status: 401 }
        );
      }

      const session = await verifySessionToken(token);
      if (!session?.userId) {
        return NextResponse.json(
          { error: "Sesi tidak valid atau telah berakhir." },
          { status: 401 }
        );
      }

      const user = await userRepository.findById(session.userId);
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

      invalidateUserMeCache(user.id);

      return NextResponse.json({
        success: true,
        termsAcceptedAt: acceptedAt.toISOString(),
        termsVersion: "1.0",
      });
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    if (action === "UPDATE_PROFILE") {
      const token =
        request.cookies.get("auth-token")?.value ||
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

      if (!token) {
        return NextResponse.json(
          { error: "Sesi autentikasi diperlukan untuk memperbarui profil." },
          { status: 401 }
        );
      }

      const session = await verifySessionToken(token);
      if (!session?.userId) {
        return NextResponse.json(
          { error: "Sesi tidak valid atau telah berakhir." },
          { status: 401 }
        );
      }

      // Ambil user dari database berdasarkan session terverifikasi
      const user = await userRepository.findById(session.userId);
      if (!user) {
        return NextResponse.json(
          { error: "User tidak ditemukan." },
          { status: 404 }
        );
      }

      // Strictly allowlisted fields only. Ignore role, plan, email, id, passwordHash.
      const updatePayload: Record<string, any> = {};

      if (typeof body.name === "string" && body.name.trim()) {
        updatePayload.name = body.name.trim().slice(0, 100);
      }

      if (typeof body.phone === "string") {
        updatePayload.phone = body.phone.trim().slice(0, 30);
      }

      if (typeof body.location === "string") {
        updatePayload.location = body.location.trim().slice(0, 100);
      }

      if (typeof body.avatarUrl === "string" && body.avatarUrl.trim()) {
        const safeAvatar = body.avatarUrl.trim();
        // Allow relative avatar paths, preset identifiers, or http/https image URLs
        if (
          !safeAvatar.toLowerCase().startsWith("javascript:") &&
          !safeAvatar.toLowerCase().startsWith("data:text/html") &&
          safeAvatar.length <= 500
        ) {
          updatePayload.avatarUrl = safeAvatar;
        }
      }

      if (typeof body.communicationStyle === "string") {
        const allowedStyles = ["KINA", "OLLIE", "RUBI", "BRUNO", "FORMAL", "CASUAL", "FUN"];
        const normalizedStyle = body.communicationStyle.trim().toUpperCase();
        if (allowedStyles.includes(normalizedStyle)) {
          updatePayload.communicationStyle = normalizedStyle;
        }
      }

      updatePayload.onboardingCompleted = true;

      const updated = await userRepository.update(user.id, updatePayload);

      invalidateUserMeCache(user.id);

      return NextResponse.json({
        success: true,
        user: updated ? {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          avatarUrl: updated.avatarUrl,
          phone: updated.phone,
          location: updated.location,
          communicationStyle: updated.communicationStyle,
          onboardingCompleted: updated.onboardingCompleted,
        } : null,
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

      const normalized = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalized)) {
        return NextResponse.json({ error: "Format email tidak valid. Masukkan alamat email yang benar." }, { status: 400 });
      }

      // ── Verifikasi bukti OTP (wajib) ──────────────────────────────────────
      // Akun TIDAK boleh dibuat sebelum email diverifikasi via OTP.
      // Mendukung bukti HMAC zyba_otp_proof_signup maupun legacy zyba_otp_verified.
      const proofCookieName = proofCookieNameForPurpose("SIGNUP");
      const proofToken = request.cookies.get(proofCookieName)?.value;
      const legacyToken = request.cookies.get("zyba_otp_verified")?.value;

      const proofResult = verifyOtpProof(proofToken, normalized, "SIGNUP");
      const legacyValid = verifyOtpVerifiedProof(legacyToken, normalized);

      if (!proofResult.valid && !legacyValid) {
        const proofMsgs: Record<string, string> = {
          missing: "Verifikasi email belum dilakukan. Silakan verifikasi email Anda terlebih dahulu dengan kode OTP.",
          invalid: "Bukti verifikasi email tidak valid. Silakan ulangi verifikasi OTP.",
          expired: "Sesi verifikasi email telah kadaluarsa (berlaku 15 menit). Silakan ulangi verifikasi OTP.",
          wrong_purpose: "Token verifikasi tidak sesuai untuk pendaftaran akun.",
          wrong_email: "Email tidak cocok dengan yang diverifikasi. Gunakan email yang sama saat verifikasi OTP.",
        };
        const reason = (proofResult as { reason?: string }).reason || "invalid";
        return NextResponse.json(
          { error: proofMsgs[reason] || "Verifikasi email diperlukan sebelum membuat akun." },
          { status: 403 }
        );
      }
      // ── End OTP proof check ────────────────────────────────────────────────

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
      response.cookies.set("zyba_otp_verified", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      // Hapus proof cookie setelah akun berhasil dibuat
      response.cookies.set(proofCookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
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

      // Fallback migrasi HANYA jika hash lama di database belum berformat bcrypt ($2a$ / $2b$)
      if (!valid && user.passwordHash && !user.passwordHash.startsWith("$2") && inputPassword && user.passwordHash === inputPassword) {
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
      { error: "Terjadi kesalahan internal pada layanan autentikasi." },
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