import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/backend/auth/userRepository";
import { generateOTP, verifyOTP, sendOTPEmail } from "@/lib/emailService";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, name, password } = body;
    const action = (body.action || "").toUpperCase();

    // Google Auth Action
    if (action === "GOOGLE_AUTH") {
      const googleEmail = email || "alex.rivera@gmail.com";
      const googleName = name || "Alex Rivera";
      const avatarUrl = body.avatarUrl || "🦊";

      let user = await userRepository.findByEmail(googleEmail);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        const dummyPasswordHash = await bcrypt.hash(`google_${Date.now()}_oauth`, 12);
        user = await userRepository.create({
          email: googleEmail,
          name: googleName,
          passwordHash: dummyPasswordHash,
          avatarUrl,
          onboardingCompleted: false,
        });
      }

      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted ?? false,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
        token: sessionToken,
        isNewUser,
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

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(normalized);

      if (existingUser) {
        return NextResponse.json(
          { error: "Email ini sudah terdaftar. Silakan masuk ke akun Anda atau gunakan email lain." },
          { status: 400 }
        );
      }

      // Generate OTP and send via email service
      const otpCode = generateOTP(normalized);
      const emailResult = await sendOTPEmail(normalized, otpCode);

      // Security: demoCode dihapus dari response API sesuai AGENTS.md Bagian 8.3
      return NextResponse.json({
        success: true,
        delivered: emailResult.delivered,
        message: emailResult.delivered
          ? "Kode OTP telah dikirimkan ke kotak masuk email Anda. Silakan periksa inbox atau folder spam."
          : emailResult.message,
      });
    }

    if (action === "VERIFY_OTP") {
      if (!email || !otp) {
        return NextResponse.json({ error: "Email dan OTP wajib diisi." }, { status: 400 });
      }

      const normalized = email.toLowerCase().trim();

      // Cek apakah email sudah terdaftar sebelum membuat user
      const existingUser = await userRepository.findByEmail(normalized);
      if (existingUser) {
        return NextResponse.json(
          { error: "Akun dengan email ini sudah terdaftar. Silakan masuk ke akun Anda." },
          { status: 400 }
        );
      }

      const result = verifyOTP(normalized, otp);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // Security: Hash password dengan bcrypt (AGENTS.md Bagian 8.1)
      const passwordToHash = password || "demo_password";
      const passwordHash = await bcrypt.hash(passwordToHash, 12);

      // Create user after OTP verification
      const user = await userRepository.create({
        email: normalized,
        name: name || normalized.split("@")[0],
        passwordHash,
        onboardingCompleted: false,
      });

      // Security: Ganti token yang mudah ditebak dengan token signed JWT (AGENTS.md Bagian 8.2)
      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        onboardingCompleted: false, // baru daftar, belum assessment
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionToken,
      });

      // Set auth cookie
      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    if (action === "LOGIN") {
      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }

      let user = await userRepository.findByEmail(email);

      // Auto-provision akun demo jika database kosong untuk alex@zyba.app
      if (!user && (email === "alex@zyba.app" || email === "alex.rivera@gmail.com")) {
        const demoHash = await bcrypt.hash(password || "demo_password", 12);
        user = await userRepository.create({
          email,
          name: "Alex Rivera",
          passwordHash: demoHash,
          avatarUrl: "🦊",
          onboardingCompleted: true,
          zybaScore: 80,
        });
      }

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
        onboardingCompleted: user.onboardingCompleted ?? false,
      });

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, zybaScore: user.zybaScore },
        token: sessionToken,
        onboardingCompleted: user.onboardingCompleted ?? false,
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

// Logout: hapus cookie auth-token
export async function DELETE() {
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