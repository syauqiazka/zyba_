"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DesktopShowcase from "./components/DesktopShowcase";
import SignInCard from "./components/SignInCard";
import ForgotPasswordCard from "./components/ForgotPasswordCard";
import ProfileSecurityFlow from "./components/ProfileSecurityFlow";

function LoginContent({ defaultMode }: { defaultMode?: "SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP" }) {
  const router = useRouter();

  // Mode: "SIGN_IN" (Frame 1) | "FORGOT_PASSWORD" (Frame 2) | "SIGN_UP" (Profile Security Setup)
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP">(defaultMode || "SIGN_IN");

  // Form Fields for Sign In
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "signup") {
      setAuthMode("SIGN_UP");
    } else if (tab === "signin" || tab === "login") {
      setAuthMode("SIGN_IN");
    } else if (defaultMode) {
      setAuthMode(defaultMode);
    }

    const errorParam = params.get("error");
    if (errorParam) {
      if (errorParam === "oauth_cancelled") {
        setLoginError("Proses masuk dengan Google dibatalkan.");
      } else if (errorParam === "token_exchange_failed" || errorParam === "profile_fetch_failed") {
        setLoginError("Gagal otentikasi dengan Google. Silakan coba lagi.");
      } else if (errorParam === "server_config_error") {
        setLoginError("Konfigurasi Google Client ID/Secret belum lengkap.");
      } else {
        setLoginError("Terjadi kendala saat login dengan Google.");
      }
    }
  }, [defaultMode]);

  // Sign In Handler
  const handleSignIn = async () => {
    if (!email.trim()) {
      setLoginError("Email wajib diisi.");
      return;
    }
    if (!password) {
      setLoginError("Kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setLoginError(data.error || "Email atau password salah.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setLoginError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Tombol Kembali ke Landing Page */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-5 left-6 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream border border-brown-900/15 text-brown-700 text-xs font-bold hover:bg-white hover:text-brown-900 transition-colors shadow-sm"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </button>

      <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 pt-16">
        {/* Split-Screen Desktop Container (max-w 1200px sesuai AGENTS.md Bagian 5) */}
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Kolom Kiri: Desktop Showcase Experience */}
          <div className="lg:col-span-6 xl:col-span-7 flex">
            <DesktopShowcase />
          </div>

          {/* Kolom Kanan: Card Interaktif */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center">
            {/* Top Quick Tab Selector */}
            <div className="w-full max-w-md flex items-center justify-between bg-cream/70 p-1 rounded-full border border-brown-900/10 mb-4 shadow-xs">
              <button
                type="button"
                onClick={() => setAuthMode("SIGN_IN")}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  authMode === "SIGN_IN"
                    ? "bg-brown-900 text-white shadow-sm"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                Sign In (Masuk)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("SIGN_UP")}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  authMode === "SIGN_UP"
                    ? "bg-brown-900 text-white shadow-sm"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                Sign Up (Setup Profil)
              </button>
            </div>

            {/* Mode 1: Sign In To Zyba */}
            {authMode === "SIGN_IN" && (
              <SignInCard
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleSignIn}
                onGoogleClick={() => {
                  window.location.href = "/api/auth/google";
                }}
                onForgotPasswordClick={() => setAuthMode("FORGOT_PASSWORD")}
                onSignUpClick={() => setAuthMode("SIGN_UP")}
                isLoading={isLoading}
              />
            )}

            {/* Mode 2: Forgot Password */}
            {authMode === "FORGOT_PASSWORD" && (
              <ForgotPasswordCard
                onBack={() => setAuthMode("SIGN_IN")}
                defaultEmail={email}
              />
            )}

            {/* Mode 3: Profile Security Setup Flow */}
            {authMode === "SIGN_UP" && (
              <ProfileSecurityFlow
                initialEmail={email !== "alex@zyba.app" ? email : ""}
                onSwitchToSignIn={() => setAuthMode("SIGN_IN")}
              />
            )}

            {/* Error notice if any */}
            {loginError && authMode === "SIGN_IN" && (
              <div className="mt-3 p-3 rounded-2xl bg-orange-100 text-danger text-xs font-bold border border-orange-500/20 max-w-md w-full text-center animate-shake">
                ⚠️ {loginError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tabParam = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;
  const modeFromParam: "SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP" | undefined =
    tabParam === "signup" ? "SIGN_UP"
    : tabParam === "forgot" ? "FORGOT_PASSWORD"
    : undefined;
  return <LoginContent defaultMode={modeFromParam} />;
}
