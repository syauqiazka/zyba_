"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

interface SignInCardProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => Promise<void>;
  onGoogleClick: () => void;
  onForgotPasswordClick: () => void;
  onSignUpClick: () => void;
  isLoading?: boolean;
}

function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
  onSignUpClick,
  isLoading = false,
}: SignInCardProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] = useState(false);

  return (
    <div className="w-full rounded-[28px] border border-brown-900/10 bg-white p-6 shadow-[0_24px_60px_rgba(41,35,31,0.08)] sm:p-8">

      {/* HEADER */}
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brown-700/55">
          ZYBA / Masuk
        </p>

        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.05em] text-brown-900 sm:text-4xl">
          Selamat datang
          <br />
          kembali.
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-6 text-brown-700">
          Masuk untuk melanjutkan
          perjalananmu bersama ZYBA.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
        className="mt-8 flex flex-col gap-5"
      >

        {/* EMAIL */}
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold text-brown-900">
            Email
          </span>

          <div className="relative">
            <Mail
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brown-700/45"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] py-3.5 pl-11 pr-4 text-sm font-medium text-brown-900 outline-none transition-all placeholder:text-brown-700/35 focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </label>

        {/* PASSWORD */}
        <label className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-brown-900">
              Kata sandi
            </span>

            <button
              type="button"
              onClick={
                onForgotPasswordClick
              }
              className="text-xs font-semibold text-brown-700/70 transition-colors hover:text-orange-500"
            >
              Lupa kata sandi?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brown-700/45"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] py-3.5 pl-11 pr-12 text-sm font-medium text-brown-900 outline-none transition-all placeholder:text-brown-700/35 focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              style={{ position: "absolute" }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl text-brown-700/50 transition-colors hover:bg-brown-900/5 hover:text-brown-900 z-10"
              aria-label={
                showPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </label>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brown-900 px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(41,35,31,0.12)] transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-[0_16px_30px_rgba(233,130,85,0.18)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

              Sedang masuk...
            </>
          ) : (
            <>
              Masuk ke ZYBA

              <span aria-hidden="true">
                →
              </span>
            </>
          )}
        </button>

      </form>

      {/* DIVIDER */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-brown-900/10" />

        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brown-700/45">
          atau
        </span>

        <span className="h-px flex-1 bg-brown-900/10" />
      </div>

      {/* GOOGLE */}
      <button
        type="button"
        disabled={
          isGoogleLoading ||
          isLoading
        }
        onClick={() => {
          setIsGoogleLoading(true);
          onGoogleClick();
        }}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-brown-900/12 bg-white px-4 text-sm font-bold text-brown-900 transition-all hover:border-brown-900/20 hover:bg-[#fbf9f5] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />

            Membuka Google...
          </>
        ) : (
          <>
            <GoogleIcon />

            Lanjutkan dengan Google
          </>
        )}
      </button>

      {/* SIGN UP */}
      <div className="mt-7 border-t border-brown-900/10 pt-5 text-center">
        <p className="text-xs text-brown-700/75">
          Belum punya akun?{" "}

          <button
            type="button"
            onClick={onSignUpClick}
            className="font-bold text-orange-500 transition-colors hover:text-brown-900"
          >
            Buat akun
          </button>
        </p>
      </div>
    </div>
  );
}