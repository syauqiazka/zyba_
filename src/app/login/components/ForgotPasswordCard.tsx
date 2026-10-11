"use client";

import React, { useState, useEffect, useRef } from "react";

interface ForgotPasswordCardProps {
  onBack: () => void;
  defaultEmail?: string;
}

type ForgotStep =
  | "INPUT_EMAIL"      // Pengguna memasukkan email
  | "INPUT_OTP"        // Pengguna memasukkan kode OTP
  | "INPUT_NEW_PASS"   // Pengguna memasukkan password baru
  | "SUCCESS";         // Reset berhasil

export default function ForgotPasswordCard({
  onBack,
  defaultEmail = "",
}: ForgotPasswordCardProps) {
  const [step, setStep] = useState<ForgotStep>("INPUT_EMAIL");
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Password strength
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const strengthScore =
    (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  function startCooldown(seconds: number) {
    setResendCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Step 1: Kirim OTP ke email ─────────────────────────────────────────────
  const handleRequestOtp = async () => {
    setError("");
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Alamat email wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Format email tidak valid. Masukkan alamat email yang benar.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST",
          email: trimmedEmail,
          purpose: "RESET_PASSWORD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          const cooldown = data.retryAfter || 60;
          startCooldown(cooldown);
          setError(
            data.error ||
              `Terlalu banyak permintaan. Tunggu ${cooldown} detik.`
          );
        } else {
          setError(
            data.error ||
              "Gagal mengirim kode OTP. Silakan coba lagi."
          );
        }
        return;
      }

      // Berhasil — tampilkan form OTP
      startCooldown(data.resendCooldownSec || 60);
      setStep("INPUT_OTP");
      setOtp("");
      setError("");
    } catch {
      setError(
        "Terjadi kesalahan jaringan. Periksa koneksi internet Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verifikasi OTP ─────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError("");
    const sanitizedOtp = otp.replace(/\D/g, "").trim();

    if (sanitizedOtp.length !== 6) {
      setError("Kode OTP harus berisi tepat 6 digit angka.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY",
          email: email.trim().toLowerCase(),
          otp: sanitizedOtp,
          purpose: "RESET_PASSWORD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          const cooldown = data.retryAfter || 60;
          startCooldown(cooldown);
          setError(
            data.error ||
              `Terlalu banyak percobaan. Tunggu ${cooldown} detik.`
          );
        } else {
          setError(
            data.error ||
              "Kode OTP tidak cocok atau telah kadaluarsa."
          );
        }
        return;
      }

      // OTP valid — lanjut ke form password baru
      setStep("INPUT_NEW_PASS");
      setNewPassword("");
      setError("");
    } catch {
      setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset password ─────────────────────────────────────────────────
  const handleResetPassword = async () => {
    setError("");

    if (!newPassword || newPassword.length < 8) {
      setError("Password baru harus minimal 8 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Gagal mereset password. Silakan ulangi proses dari awal."
        );
        return;
      }

      setSuccessMsg(
        data.message ||
          "Password berhasil direset! Silakan masuk ke akun Anda."
      );
      setStep("SUCCESS");
    } catch {
      setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kirim ulang OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtp("");
    setError("");
    await handleRequestOtp();
  };

  // Masking email untuk display
  function maskEmail(e: string): string {
    const [local, domain] = e.split("@");
    if (!local || !domain) return e;
    const visible = local.slice(0, Math.min(3, local.length));
    return `${visible}***@${domain}`;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brown-900/10 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
        <button
          type="button"
          onClick={
            step === "INPUT_OTP"
              ? () => { setStep("INPUT_EMAIL"); setError(""); }
              : step === "INPUT_NEW_PASS"
              ? () => { setStep("INPUT_OTP"); setError(""); }
              : onBack
          }
          disabled={isLoading}
          className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors disabled:opacity-50"
          title="Kembali"
        >
          ←
        </button>

        <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-xl mb-1">
          {step === "SUCCESS" ? "✅" : step === "INPUT_NEW_PASS" ? "🔒" : "📧"}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-brown-700/70">
          {step === "INPUT_EMAIL" && "Lupa Password · Langkah 1/3"}
          {step === "INPUT_OTP" && "Lupa Password · Langkah 2/3"}
          {step === "INPUT_NEW_PASS" && "Lupa Password · Langkah 3/3"}
          {step === "SUCCESS" && "Selesai"}
        </span>
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
        {/* ── Step 1: Input Email ──────────────────────────────────────────── */}
        {step === "INPUT_EMAIL" && (
          <>
            <div className="flex flex-col">
              <h2 className="font-display font-extrabold text-2xl text-brown-900 tracking-tight">
                Lupa Password
              </h2>
              <p className="text-xs text-brown-700/80 mt-1 leading-relaxed">
                Masukkan email yang terdaftar. Kami akan mengirimkan kode verifikasi 6 digit.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900">
                Alamat Email Terdaftar
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="nama@email.com"
                autoComplete="email"
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleRequestOtp()}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-orange-100/80 border border-danger/30">
                <p className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isLoading || resendCooldown > 0}
              onClick={handleRequestOtp}
              className="mt-1 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isLoading
                ? "Mengirim Kode..."
                : resendCooldown > 0
                ? `Tunggu ${resendCooldown}d...`
                : "Kirim Kode Verifikasi →"}
            </button>
          </>
        )}

        {/* ── Step 2: Input OTP ───────────────────────────────────────────── */}
        {step === "INPUT_OTP" && (
          <>
            <div className="flex flex-col">
              <h2 className="font-display font-extrabold text-2xl text-brown-900 tracking-tight">
                Masukkan Kode OTP
              </h2>
              <p className="text-xs text-brown-700/80 mt-1 leading-relaxed">
                Kode 6 digit dikirim ke{" "}
                <strong className="text-brown-900">{maskEmail(email)}</strong>.
                Periksa kotak masuk atau folder spam.
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900">
                Kode OTP (6 digit)
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                placeholder="123456"
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-3 text-center text-xl tracking-[0.5em] font-bold font-mono text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyDown={(e) => e.key === "Enter" && !isLoading && otp.length === 6 && handleVerifyOtp()}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-orange-100/80 border border-danger/30">
                <p className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isLoading || otp.replace(/\D/g, "").length !== 6}
              onClick={handleVerifyOtp}
              className="mt-1 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi Kode →"}
            </button>

            {/* Resend */}
            <div className="text-center">
              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleResendOtp}
                className="text-xs font-semibold text-orange-600 hover:underline disabled:opacity-40 disabled:no-underline transition-opacity"
              >
                {resendCooldown > 0
                  ? `Kirim ulang dalam ${resendCooldown} detik`
                  : "Tidak menerima kode? Kirim ulang"}
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Password Baru ───────────────────────────────────────── */}
        {step === "INPUT_NEW_PASS" && (
          <>
            <div className="flex flex-col">
              <h2 className="font-display font-extrabold text-2xl text-brown-900 tracking-tight">
                Buat Password Baru
              </h2>
              <p className="text-xs text-brown-700/80 mt-1 leading-relaxed">
                Buat password baru yang kuat untuk akun{" "}
                <strong className="text-brown-900">{maskEmail(email)}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 pr-12 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brown-700/60 hover:text-brown-900 font-semibold"
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            {/* Strength meter */}
            {newPassword.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-cream/40 border border-brown-900/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brown-900">Kekuatan Password</span>
                  <span
                    className={`text-[11px] font-extrabold ${
                      strengthScore === 3
                        ? "text-green-500"
                        : strengthScore === 2
                        ? "text-orange-500"
                        : "text-danger"
                    }`}
                  >
                    {strengthScore === 3 ? "Kuat ✨" : strengthScore === 2 ? "Sedang ⚡" : "Lemah 💪"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        strengthScore >= i
                          ? i === 1
                            ? strengthScore === 1
                              ? "bg-danger"
                              : "bg-orange-500"
                            : i === 2
                            ? strengthScore === 2
                              ? "bg-orange-500"
                              : "bg-green-500"
                            : "bg-green-500"
                          : "bg-brown-900/15"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { ok: hasMinLength, label: "Min. 8 karakter" },
                    { ok: hasNumber, label: "Ada angka" },
                    { ok: hasSpecial, label: "Karakter khusus" },
                  ].map(({ ok, label }) => (
                    <span
                      key={label}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ok ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                      }`}
                    >
                      {ok ? "✓" : "○"} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-orange-100/80 border border-danger/30">
                <p className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isLoading || newPassword.length < 8}
              onClick={handleResetPassword}
              className="mt-1 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isLoading ? "Mereset Password..." : "Reset Password →"}
            </button>
          </>
        )}

        {/* ── Step 4: Sukses ──────────────────────────────────────────────── */}
        {step === "SUCCESS" && (
          <div className="flex flex-col items-center gap-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500 text-white text-3xl flex items-center justify-center shadow-sm">
              ✓
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-brown-900">
                Password Berhasil Direset!
              </h3>
              <p className="text-xs text-brown-700 leading-relaxed mt-2 max-w-xs">
                {successMsg ||
                  "Password akun Anda telah berhasil diperbarui. Silakan masuk dengan password baru."}
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md"
            >
              Masuk ke Akun →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
