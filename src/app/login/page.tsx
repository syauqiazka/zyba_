"use client";

// Gerbang Masuk & Autentikasi — The Living Tactile Sanctuary (`/login`)
// Mengadopsi komposisi botanical golf/landscape sketch dengan pohon & dedaunan berayun,
// serta siklus atmosferik waktu nyata: Fajar (Sunrise), Siang (Day), Senja (Sunset), Malam (Night).

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, HelpCircle } from "lucide-react";
import Link from "next/link";

import SanctuaryLandscape, {
  TimePhase,
  getRealTimePhase,
} from "./components/SanctuaryLandscape";
import TimeAtmosphereControl from "./components/TimeAtmosphereControl";
import SignInCard from "./components/SignInCard";
import ForgotPasswordCard from "./components/ForgotPasswordCard";
import ProfileSecurityFlow from "./components/ProfileSecurityFlow";
import TermsAgreementModal from "./components/TermsAgreementModal";

type AuthMode = "SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP";

const CURRENT_TERMS_VERSION = "1.0";

function getSafeRedirect() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  const redirect = new URLSearchParams(window.location.search).get("redirect");

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/dashboard";
}

function LoginContent({ defaultMode }: { defaultMode?: AuthMode }) {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode || "SIGN_IN");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ATMOSPHERIC TIME STATE (Fajar / Siang / Senja / Malam)
  const [isAutoTime, setIsAutoTime] = useState(true);
  const [timePhase, setTimePhase] = useState<TimePhase>("day");

  // TERMS MODAL STATE
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState("");
  const [pendingRedirect, setPendingRedirect] = useState("/dashboard");
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);

  // Initialize time phase on mount
  useEffect(() => {
    setTimePhase(getRealTimePhase());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const redirected = params.get("redirected") === "true";
    if (redirected) {
      setLoginError(
        "Halaman ini hanya bisa diakses setelah login. Silakan masuk ke akun Anda terlebih dahulu."
      );
    }

    const termsRequired = params.get("terms_required") === "1";
    if (termsRequired) {
      const redirectParam = params.get("redirect");
      const safeRedirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
          ? redirectParam
          : "/dashboard";

      const loadTermsUser = async () => {
        try {
          const res = await fetch("/api/user/me", { cache: "no-store" });
          if (!res.ok) return;

          const data = await res.json();
          const user = data?.user;

          if (!user?.email) return;

          const needsTerms =
            !user.termsAcceptedAt || user.termsVersion !== CURRENT_TERMS_VERSION;

          if (needsTerms) {
            setPendingUserEmail(user.email);
            setPendingRedirect(safeRedirect);
            setShowTerms(true);
          }
        } catch (error) {
          console.error("Failed to load user for Terms:", error);
        }
      };

      loadTermsUser();
    }

    const tab = params.get("tab");
    if (tab === "signup") {
      setAuthMode("SIGN_UP");
    } else if (tab === "signin" || tab === "login") {
      setAuthMode("SIGN_IN");
    } else if (tab === "forgot") {
      setAuthMode("FORGOT_PASSWORD");
    } else if (defaultMode) {
      setAuthMode(defaultMode);
    }

    const errorParam = params.get("error");
    if (!errorParam) return;

    if (errorParam === "oauth_cancelled") {
      setLoginError("Proses masuk dengan Google dibatalkan.");
    } else if (
      errorParam === "token_exchange_failed" ||
      errorParam === "profile_fetch_failed"
    ) {
      setLoginError("Gagal otentikasi dengan Google. Silakan coba lagi.");
    } else if (errorParam === "server_config_error") {
      setLoginError("Konfigurasi Google Client ID/Secret belum lengkap.");
    } else {
      setLoginError("Terjadi kendala saat login dengan Google.");
    }
  }, [defaultMode]);

  const handleTermsRequired = (userEmail: string, redirect: string) => {
    setPendingUserEmail(userEmail);
    setPendingRedirect(redirect);
    setShowTerms(true);
  };

  const handleLoginSuccess = (data: any) => {
    const user = data?.user;

    if (!user?.email) {
      setLoginError("Data akun tidak ditemukan. Silakan coba login kembali.");
      return;
    }

    const needsTerms =
      !user.termsAcceptedAt || user.termsVersion !== CURRENT_TERMS_VERSION;

    if (needsTerms) {
      const redirect = user.onboardingCompleted
        ? getSafeRedirect()
        : "/assessment";
      handleTermsRequired(user.email, redirect);
      return;
    }

    const redirect = user.onboardingCompleted
      ? getSafeRedirect()
      : "/assessment";

    try {
      localStorage.removeItem("zyba_user_cache");
    } catch {}

    window.location.href = redirect;
  };

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "LOGIN",
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Email atau password salah.");
        return;
      }

      handleLoginSuccess(data);
    } catch (error) {
      console.error("Sign in error:", error);
      setLoginError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!pendingUserEmail) {
      setLoginError("Email akun tidak ditemukan.");
      return;
    }

    setIsAcceptingTerms(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "ACCEPT_TERMS",
          email: pendingUserEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan persetujuan Terms.");
      }

      setShowTerms(false);
      window.location.href = pendingRedirect;
    } catch (error) {
      console.error("Accept terms error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan persetujuan Terms."
      );
    } finally {
      setIsAcceptingTerms(false);
    }
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setLoginError("");
  };

  const isNight = timePhase === "night";

  return (
    <>
      <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between font-body text-brown-900 selection:bg-orange-500/20">
        {/* ── LIVING BOTANICAL SKETCH LANDSCAPE (Background & Animations) ── */}
        <SanctuaryLandscape
          activePhase={timePhase}
          onPhaseChange={(phase) => setTimePhase(phase)}
          isAutoTime={isAutoTime}
          onToggleAuto={(auto) => setIsAutoTime(auto)}
        />

        {/* ── TOP BAR (Matching Reference Image Header) ── */}
        <header className="relative z-30 mx-auto w-full max-w-[1400px] flex items-center justify-between px-5 sm:px-8 py-5">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-300 border shadow-xs cursor-pointer ${
              isNight
                ? "bg-stone-900/80 text-cream border-white/15 hover:bg-stone-800"
                : "bg-white/85 text-brown-900 border-brown-900/10 hover:bg-white"
            } backdrop-blur-md`}
          >
            <ArrowLeft
              size={15}
              strokeWidth={2.2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Kembali</span>
          </button>

          {/* Centered Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <span
              className="w-8 h-8 rounded-xl bg-brown-900 text-cream flex items-center justify-center p-1.5 shadow-sm"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cream">
                <path
                  d="M12 2a4 4 0 0 0-4 4v1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0 4.5-4.5V6a4 4 0 0 0-4-4z"
                  fill="#8FAE5D"
                />
                <path
                  d="M2 12a4 4 0 0 0 4 4h1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0-4.5-4.5H6a4 4 0 0 0-4 4z"
                  fill="#F2884B"
                />
                <path
                  d="M12 22a4 4 0 0 0 4-4v-1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0-4.5 4.5V18a4 4 0 0 0 4 4z"
                  fill="#8FAE5D"
                />
                <path
                  d="M22 12a4 4 0 0 0-4-4h-1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0 4.5 4.5H18a4 4 0 0 0 4-4z"
                  fill="#F2884B"
                />
                <circle cx="12" cy="12" r="2.5" fill="#FAF7F2" />
              </svg>
            </span>
            <span
              className={`font-display text-xl font-extrabold tracking-tight ${
                isNight ? "text-cream" : "text-brown-900"
              }`}
            >
              ZYBA
            </span>
          </Link>

          {/* Right Controls: Atmospheric Time Pill + Guidebook Link */}
          <div className="flex items-center gap-2.5">
            <TimeAtmosphereControl
              currentPhase={timePhase}
              isAuto={isAutoTime}
              onSelectPhase={(phase) => setTimePhase(phase)}
              onToggleAuto={(auto) => setIsAutoTime(auto)}
            />

            <Link
              href="/guidebook"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border shadow-xs ${
                isNight
                  ? "bg-stone-900/80 text-cream/80 border-white/10 hover:text-white"
                  : "bg-white/80 text-brown-700/70 border-brown-900/10 hover:text-brown-900"
              } backdrop-blur-md`}
            >
              <HelpCircle size={13} />
              <span>Bantuan</span>
            </Link>
          </div>
        </header>

        {/* ── CENTER FLOATING SANCTUARY CARD (Directly from Reference Image) ── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-[440px] rounded-[24px] bg-white/95 backdrop-blur-md border border-brown-900/10 p-6 sm:p-8 shadow-xl transition-all duration-300">
            {/* MODE SWITCHER TABS (Masuk / Daftar) */}
            <div className="mb-6 flex items-center justify-between border-b border-brown-900/8 pb-4">
              <div className="flex items-center gap-1.5 rounded-full border border-brown-900/10 bg-cream/70 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("SIGN_IN")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    authMode === "SIGN_IN"
                      ? "bg-brown-900 text-white shadow-xs"
                      : "text-brown-700/70 hover:text-brown-900"
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("SIGN_UP")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    authMode === "SIGN_UP"
                      ? "bg-brown-900 text-white shadow-xs"
                      : "text-brown-700/70 hover:text-brown-900"
                  }`}
                >
                  Daftar
                </button>
              </div>

              <span className="text-[11px] font-bold text-brown-700/50 uppercase tracking-widest">
                Sanctuary
              </span>
            </div>

            {/* ERROR BANNER */}
            {loginError && authMode === "SIGN_IN" && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-orange-500/20 bg-orange-100/90 px-3.5 py-2.5 text-xs font-semibold text-danger shadow-xs">
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]"
                >
                  !
                </span>
                <span>{loginError}</span>
              </div>
            )}

            {/* CARD BODY ACCORDING TO AUTH MODE */}
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
                onForgotPasswordClick={() => switchMode("FORGOT_PASSWORD")}
                onSwitchToSignUp={() => switchMode("SIGN_UP")}
                isLoading={isLoading}
              />
            )}

            {authMode === "FORGOT_PASSWORD" && (
              <ForgotPasswordCard
                onBack={() => switchMode("SIGN_IN")}
                defaultEmail={email}
              />
            )}

            {authMode === "SIGN_UP" && (
              <ProfileSecurityFlow
                initialEmail={email}
                onSwitchToSignIn={() => switchMode("SIGN_IN")}
                onSignupSuccess={(userEmail) => {
                  setPendingUserEmail(userEmail);
                  setPendingRedirect("/assessment");
                  setShowTerms(true);
                }}
              />
            )}
          </div>
        </div>

        {/* ── FOOTER SUBTLE BRAND MOTTO ── */}
        <footer className="relative z-30 pb-4 text-center">
          <div
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
              isNight ? "text-stone-400" : "text-brown-700/60"
            }`}
          >
            <span className="font-bold">ZYBA</span>
            <ArrowUpRight size={11} />
            <span>Pelan-pelan, tapi tetap jalan.</span>
          </div>
        </footer>
      </main>

      {/* TERMS AGREEMENT MODAL */}
      <TermsAgreementModal open={showTerms} onAccept={handleAcceptTerms} />
    </>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tabParam =
    typeof searchParams?.tab === "string" ? searchParams.tab : undefined;

  const modeFromParam: AuthMode | undefined =
    tabParam === "signup"
      ? "SIGN_UP"
      : tabParam === "forgot"
      ? "FORGOT_PASSWORD"
      : undefined;

  return <LoginContent defaultMode={modeFromParam} />;
}
