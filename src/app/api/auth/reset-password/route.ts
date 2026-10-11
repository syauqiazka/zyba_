import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/backend/auth/userRepository";
import bcrypt from "bcryptjs";
import { verifyOtpProof, proofCookieNameForPurpose } from "@/lib/otpChallenge";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/server/rateLimit";

/**
 * POST /api/auth/reset-password
 *
 * Mereset password pengguna setelah OTP reset password berhasil diverifikasi.
 *
 * Body: { email: string; newPassword: string }
 *
 * Memerlukan cookie `zyba_otp_proof_reset_password` yang ditandatangani server
 * (diset oleh /api/auth/otp setelah VERIFY dengan purpose=RESET_PASSWORD).
 *
 * Keamanan:
 * - Proof OTP diverifikasi server-side sebelum reset dilakukan.
 * - Reset tidak membuat sesi login otomatis (user harus login manual).
 * - Proof cookie dihapus setelah reset berhasil.
 * - Rate limit per IP.
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate limit: 5 percobaan reset per menit per IP
    const ipLimit = await checkRateLimit(`reset_pw:${clientIp}`, 5, 60);
    if (!ipLimit.allowed) {
      return rateLimitResponse(
        ipLimit.retryAfterSec,
        "Terlalu banyak permintaan reset password. Silakan tunggu sebentar."
      );
    }

    const body = await request.json();
    const { email, newPassword } = body as {
      email?: string;
      newPassword?: string;
    };

    // ── Validasi input ────────────────────────────────────────────────────────
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password baru harus minimal 8 karakter." },
        { status: 400 }
      );
    }

    // ── Verifikasi proof OTP reset password ───────────────────────────────────
    const proofCookieName = proofCookieNameForPurpose("RESET_PASSWORD");
    const proofToken = request.cookies.get(proofCookieName)?.value;

    const proofResult = verifyOtpProof(proofToken, normalizedEmail, "RESET_PASSWORD");
    if (!proofResult.valid) {
      const reasonMsgs: Record<string, string> = {
        missing:
          "Verifikasi OTP reset password belum dilakukan. Silakan ulangi proses lupa password.",
        invalid:
          "Token verifikasi reset password tidak valid. Silakan ulangi proses.",
        expired:
          "Sesi verifikasi reset password telah kadaluarsa (berlaku 15 menit). Silakan ulangi.",
        wrong_purpose:
          "Token verifikasi tidak sesuai untuk reset password.",
        wrong_email:
          "Email tidak cocok dengan yang diverifikasi OTP. Gunakan email yang sama.",
      };
      const reason = (proofResult as { reason?: string }).reason || "invalid";
      return NextResponse.json(
        { error: reasonMsgs[reason] || "Verifikasi OTP diperlukan untuk reset password." },
        { status: 403 }
      );
    }

    // ── Cari user ─────────────────────────────────────────────────────────────
    // Kembalikan pesan netral agar tidak bocor keberadaan akun
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      // Tetap hapus proof cookie
      const resp = NextResponse.json(
        { error: "Permintaan reset password tidak dapat diproses. Silakan coba lagi." },
        { status: 400 }
      );
      resp.cookies.set(proofCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
      return resp;
    }

    // Akun Google OAuth tidak punya password — tolak dengan pesan yang aman
    if (
      !user.passwordHash ||
      user.passwordHash.startsWith("google_") ||
      !user.passwordHash.startsWith("$2")
    ) {
      const resp = NextResponse.json(
        {
          error:
            "Akun ini menggunakan metode login lain (mis. Google). Reset password tidak tersedia.",
        },
        { status: 400 }
      );
      resp.cookies.set(proofCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
      return resp;
    }

    // ── Hash password baru dan simpan ─────────────────────────────────────────
    const newHash = await bcrypt.hash(newPassword, 12);
    await userRepository.update(user.id, { passwordHash: newHash });

    // ── Hapus proof cookie setelah berhasil ───────────────────────────────────
    const response = NextResponse.json({
      success: true,
      message:
        "Password berhasil direset. Silakan masuk ke akun Anda dengan password baru.",
    });

    response.cookies.set(proofCookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[reset-password] Error:", msg);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
