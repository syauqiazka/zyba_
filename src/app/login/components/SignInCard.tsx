"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

interface SignInCardProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => Promise<void>;
  onGoogleClick: () => void;
  onForgotPasswordClick: () => void;
  onSwitchToSignUp?: () => void;
  isLoading?: boolean;
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.75-.07-1.4-.19-2.06H12v4.43h6.47a5.52 5.52 0 01-2.4 3.62v3h3.88c2.27-2.09 3.55-5.17 3.55-8.99z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.92H1.27v3.1A12 12 0 0012 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.32A7.18 7.18 0 014.9 12c0-.8.14-1.57.38-2.32V6.58H1.27A12 12 0 000 12c0 1.94.47 3.77 1.27 5.42l4.01-3.1v-.0z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.16 15.24 0 12 0 7.3 0 3.28 2.64 1.27 6.58l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z"
      />
    </svg>
  );
}

export default function SignInCard({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onGoogleClick,
  onForgotPasswordClick,
  onSwitchToSignUp,
  isLoading = false,
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  return (
    <div className="w-full">
      {/* CARD HEADER (Matching Reference Image) */}
      <div className="text-center sm:text-left">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-brown-900 leading-tight">
          Masuk ke ZYBA
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-brown-700/70">
          Ruang aman untuk merawat batin dan langkah kecilmu
        </p>
      </div>

      {/* SOCIAL LOGIN / GOOGLE (Top placement matching reference) */}
      <div className="mt-6">
        <button
          type="button"
          disabled={isGoogleLoading || isLoading}
          onClick={() => {
            setIsGoogleLoading(true);
            onGoogleClick();
          }}
          className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-full border border-brown-900/12 bg-white px-4 text-xs sm:text-sm font-bold text-brown-900 transition-all hover:border-brown-900/25 hover:bg-cream/50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs active:scale-[0.99]"
        >
          {isGoogleLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
              <span>Membuka Google...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Lanjutkan dengan Google</span>
            </>
          )}
        </button>
      </div>

      {/* DIVIDER */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-brown-900/10" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/40">
          atau dengan email
        </span>
        <span className="h-px flex-1 bg-brown-900/10" />
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {/* EMAIL */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-brown-900">Email</span>
          <div className="relative">
            <Mail
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-700/40"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full rounded-xl border border-brown-900/12 bg-cream/40 py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm font-medium text-brown-900 outline-none transition-all placeholder:text-brown-700/35 focus:border-orange-500/60 focus:bg-white focus:ring-3 focus:ring-orange-500/10"
            />
          </div>
        </label>

        {/* PASSWORD */}
        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-brown-900">Kata sandi</span>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs font-semibold text-brown-700/70 transition-colors hover:text-orange-500 cursor-pointer"
            >
              Lupa kata sandi?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-700/40"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              className="w-full rounded-xl border border-brown-900/12 bg-cream/40 py-2.5 sm:py-3 pl-10 pr-11 text-xs sm:text-sm font-medium text-brown-900 outline-none transition-all placeholder:text-brown-700/35 focus:border-orange-500/60 focus:bg-white focus:ring-3 focus:ring-orange-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-brown-700/40 hover:text-brown-900 transition-colors cursor-pointer"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>

        {/* SUBMIT BUTTON (Matching Reference Image) */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brown-900 px-5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-orange-500 hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              <span>Sedang masuk...</span>
            </>
          ) : (
            <span>Masuk dengan Email</span>
          )}
        </button>
      </form>

      {/* FOOTER SWITCH (Matching Reference Image) */}
      {onSwitchToSignUp && (
        <div className="mt-5 text-center">
          <p className="text-xs text-brown-700/70">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-bold text-brown-900 hover:text-orange-500 transition-colors cursor-pointer underline underline-offset-2"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
