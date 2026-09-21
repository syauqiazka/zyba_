import { NextRequest, NextResponse } from "next/server";
import { generateOTP, verifyOTP, sendOTPEmail } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
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
      const generatedCode = generateOTP(email);
      await sendOTPEmail(email, generatedCode);

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