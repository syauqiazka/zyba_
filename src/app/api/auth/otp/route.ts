import { NextRequest, NextResponse } from "next/server";
import { generateOTP, verifyOTP, sendOTPEmail } from "@/lib/emailService";
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

      const generatedCode = generateOTP(email);
      const delivery = await sendOTPEmail(email, generatedCode);\n      if (!delivery.delivered) {\n        return NextResponse.json({ error: delivery.message || "OTP gagal dikirim." }, { status: 502 });\n      }


      // Security: Sesuai AGENTS.md Bagian 8.3, demoCode dihapus dari response API
      return NextResponse.json({
        success: true,
        message: `Kode OTP 4 digit telah dikirimkan ke ${email} (via ${provider} Auth).`,
      });
    }

    if (action === "VERIFY") {
      if (!otp) {
        return NextResponse.json(
          { error: "Kode OTP wajib diisi." },
          { status: 400 }
        );
      }

      const result = verifyOTP(email, otp);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Verifikasi OTP berhasil. Silakan lengkapi pendaftaran.",
        otpVerified: true,
      });
    }

    return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}