import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail, OtpPurpose } from "@/lib/emailService";
import {
  cookieNameForPurpose,
  createOtpChallenge,
  verifyOtpChallenge,
  createOtpVerifiedProof,
  checkResendCooldown,
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
} from "@/lib/otpChallenge";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/server/rateLimit";
import { userRepository } from "@/backend/auth/userRepository";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/otp
 *
 * Actions:
 *   REQUEST — kirim OTP ke email (rate-limited per IP & per email)
 *   VERIFY  — verifikasi OTP dari cookie challenge (rate-limited per IP)
 *
 * Purpose:
 *   SIGNUP         — verifikasi email sebelum membuat akun
 *   RESET_PASSWORD — verifikasi email sebelum reset password
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json();

    const {
      action,
      email,
      otp,
      purpose: rawPurpose,
    } = body as {
      action: "REQUEST" | "VERIFY";
      email: string;
      otp?: string;
      purpose?: string;
    };

    // ── Validasi purpose ──────────────────────────────────────────────────────
    const VALID_PURPOSES: OtpPurpose[] = ["SIGNUP", "RESET_PASSWORD"];
    const purpose: OtpPurpose =
      rawPurpose && VALID_PURPOSES.includes(rawPurpose as OtpPurpose)
        ? (rawPurpose as OtpPurpose)
        : "SIGNUP";

    // ── Validasi email ────────────────────────────────────────────────────────
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Format email tidak valid. Masukkan alamat email yang benar." },
        { status: 400 }
      );
    }

    // ── REQUEST: Kirim OTP ────────────────────────────────────────────────────
    if (action === "REQUEST") {
      // Untuk pendaftaran akun baru: pastikan email belum terdaftar
      if (purpose === "SIGNUP") {
        try {
          const existingUser = await userRepository.findByEmail(normalizedEmail);
          if (existingUser) {
            return NextResponse.json(
              { error: "Email ini sudah terdaftar. Silakan masuk ke akun Anda atau gunakan email lain." },
              { status: 400 }
            );
          }
        } catch (dbErr) {
          console.warn("[OTP Route] Database lookup warning:", dbErr);
        }
      }

      // Rate limit: per IP (5 request OTP per 5 menit)
      const ipLimit = await checkRateLimit(`otp_req_ip:${clientIp}`, 5, 300);
      if (!ipLimit.allowed) {
        return rateLimitResponse(
          ipLimit.retryAfterSec,
          "Terlalu banyak permintaan OTP dari jaringan ini."
        );
      }

      // Rate limit: per email+purpose (5 request per 10 menit)
      const emailLimit = await checkRateLimit(
        `otp_req_email:${normalizedEmail}:${purpose}`,
        5,
        600
      );
      if (!emailLimit.allowed) {
        return rateLimitResponse(
          emailLimit.retryAfterSec,
          "Terlalu banyak permintaan OTP untuk email ini. Silakan tunggu sebentar."
        );
      }

      // Cooldown resend (60 detik)
      const cooldownSec = checkResendCooldown(normalizedEmail, purpose);
      if (cooldownSec > 0) {
        return NextResponse.json(
          {
            error: `Tunggu ${cooldownSec} detik sebelum meminta kode baru.`,
            retryAfter: cooldownSec,
          },
          {
            status: 429,
            headers: { "Retry-After": String(cooldownSec) },
          }
        );
      }

      // Generate OTP kriptografis (6 digit)
      const generatedCode = generateOTP();

      // Kirim via Brevo HTTPS API
      const delivery = await sendOTPEmail(normalizedEmail, generatedCode, purpose);
      if (!delivery.delivered) {
        return NextResponse.json(
          { error: delivery.message || "Kode OTP gagal dikirim. Silakan coba lagi." },
          { status: 502 }
        );
      }

      // Buat challenge (OTP di-hash di dalam, tidak disimpan plain)
      const challenge = createOtpChallenge(normalizedEmail, generatedCode, purpose);
      const cookieName = cookieNameForPurpose(purpose);

      const response = NextResponse.json({
        success: true,
        message: "Kode OTP 6 digit telah dikirimkan ke email Anda.",
        resendCooldownSec: RESEND_COOLDOWN_SECONDS,
      });

      response.cookies.set(cookieName, challenge.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: challenge.maxAge,
      });

      return response;
    }

    // ── VERIFY: Verifikasi OTP ────────────────────────────────────────────────
    if (action === "VERIFY") {
      // Rate limit: per IP (10 verifikasi per 2 menit) — cukup ketat
      const verifyLimit = await checkRateLimit(`otp_verify_ip:${clientIp}`, 10, 120);
      if (!verifyLimit.allowed) {
        return rateLimitResponse(
          verifyLimit.retryAfterSec,
          "Terlalu banyak percobaan verifikasi OTP. Silakan tunggu sebentar."
        );
      }

      if (!otp || typeof otp !== "string") {
        return NextResponse.json(
          { error: "Kode OTP wajib diisi." },
          { status: 400 }
        );
      }

      // Sanitasi OTP input — hanya angka
      const sanitizedOtp = otp.replace(/\D/g, "").trim();
      if (sanitizedOtp.length !== 6) {
        return NextResponse.json(
          { error: "Kode OTP harus berisi tepat 6 digit angka." },
          { status: 400 }
        );
      }

      const cookieName = cookieNameForPurpose(purpose);
      const token = req.cookies.get(cookieName)?.value;

      const result = verifyOtpChallenge(token, normalizedEmail, sanitizedOtp, purpose);

      if (!result.valid) {
        // Pesan error berdasarkan reason — tidak bocorkan info lebih dari yang perlu
        const messageMap: Record<string, string> = {
          missing:
            "Sesi verifikasi tidak ditemukan. Silakan minta kode baru.",
          invalid:
            "Token verifikasi tidak valid. Silakan minta kode baru.",
          expired:
            "Kode OTP telah kadaluarsa (berlaku 10 menit). Silakan minta kode baru.",
          mismatch:
            `Kode OTP tidak cocok. Periksa kembali email Anda (${MAX_ATTEMPTS} percobaan maksimal).`,
          too_many_attempts:
            "Terlalu banyak percobaan yang salah. Silakan minta kode baru.",
          wrong_purpose:
            "Token verifikasi tidak sesuai dengan tindakan yang diminta.",
          wrong_email:
            "Token verifikasi tidak cocok dengan email yang dimasukkan.",
        };

        const reason = (result as { valid: false; reason: string }).reason;
        const errorMsg = messageMap[reason] || "Verifikasi gagal. Silakan coba lagi.";

        return NextResponse.json({ error: errorMsg }, { status: 400 });
      }

      // Berhasil — hapus cookie challenge agar tidak bisa dipakai ulang
      const cookieName2 = cookieNameForPurpose(purpose);
      const response = NextResponse.json({
        success: true,
        message: "Verifikasi OTP berhasil.",
        otpVerified: true,
        purpose,
      });

      response.cookies.set(cookieName2, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // hapus segera
      });
      // Set legacy verification cookie for backward compatibility
      response.cookies.set("zyba_otp_verified", createOtpVerifiedProof(normalizedEmail), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      // Set cookie bukti verifikasi yang ditandatangani server
      // Format: base64url(JSON({email,purpose,verifiedAt})).HMAC
      // Dipakai SIGNUP/RESET endpoint untuk memvalidasi bukti tanpa trust frontend cookie mentah
      const { createHmac } = await import("crypto");
      const secret = process.env.NEXTAUTH_SECRET || "";
      const proofPayload = Buffer.from(
        JSON.stringify({
          email: normalizedEmail,
          purpose,
          verifiedAt: Math.floor(Date.now() / 1000),
          // Expires 15 menit setelah verifikasi — cukup untuk selesaikan form signup
          exp: Math.floor(Date.now() / 1000) + 15 * 60,
        }),
        "utf8"
      ).toString("base64url");

      const proofSig = createHmac("sha256", secret)
        .update("proof:" + proofPayload)
        .digest("base64url");

      const proofToken = proofPayload + "." + proofSig;
      const proofCookieName = `zyba_otp_proof_${purpose.toLowerCase()}`;

      response.cookies.set(proofCookieName, proofToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 menit
      });
      return response;
    }

    return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}