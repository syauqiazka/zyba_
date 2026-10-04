import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/emailService";
import { COOKIE_NAME, createOtpChallenge, verifyOtpChallenge } from "@/lib/otpChallenge";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json();
    const { action, email, otp, provider = "EMAIL" } = body as {
      action: "REQUEST" | "VERIFY";
      email: string;
      otp?: string;
      provider?: "EMAIL" | "GOOGLE";
    };

    if (!email) {
      return NextResponse.json(
        { error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    if (action === "REQUEST") {
      const limit = await checkRateLimit(`otp_req:${clientIp}`, 5, 300);
      if (!limit.allowed) {
        return rateLimitResponse(limit.retryAfterSec, "Terlalu banyak permintaan OTP.");
      }

      const normalizedEmail = email.toLowerCase().trim();
      const generatedCode = generateOTP(normalizedEmail);
      const delivery = await sendOTPEmail(normalizedEmail, generatedCode);
      if (!delivery.delivered) {
        return NextResponse.json(
          { error: delivery.message || "Kode OTP gagal dikirim. Silakan coba lagi." },
          { status: 502 }
        );
      }

      const challenge = createOtpChallenge(normalizedEmail, generatedCode);
      const response = NextResponse.json({
        success: true,
        message: "Kode OTP 4 digit telah dikirimkan ke email Anda.",
      });

      response.cookies.set(COOKIE_NAME, challenge.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: challenge.maxAge,
      });

      return response;
    }

    if (action === "VERIFY") {
      if (!otp) {
        return NextResponse.json(
          { error: "Kode OTP wajib diisi." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      const result = verifyOtpChallenge(
        req.cookies.get(COOKIE_NAME)?.value,
        normalizedEmail,
        otp
      );
      if (!result.valid) {
        const message =
          result.reason === "expired"
            ? "Kode OTP telah kadaluarsa. Silakan minta kode baru."
            : result.reason === "mismatch"
              ? "Kode OTP tidak cocok. Periksa kembali email Anda."
              : "Sesi verifikasi tidak ditemukan. Silakan minta kode baru.";
        return NextResponse.json({ error: message }, { status: 400 });
      }

      const response = NextResponse.json({
        success: true,
        message: "Verifikasi OTP berhasil. Silakan lengkapi pendaftaran.",
        otpVerified: true,
      });
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}