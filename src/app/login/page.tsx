"use client";

// ZYBA — Living Watercolor Botanical Login Experience
// Full-screen watercolor & pen-and-ink golf illustration with time-based atmospheric crossfades,
// gentle SVG wind sway (feTurbulence), celestial motion, and glassmorphic authentication UI.

export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import WatercolorBackground, {
  TimePhase,
} from "./components/WatercolorBackground";
import ProfileSecurityFlow from "./components/ProfileSecurityFlow";
import ForgotPasswordCard from "./components/ForgotPasswordCard";
import TermsAgreementModal from "./components/TermsAgreementModal";

type AuthMode = "SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP";

const CURRENT_TERMS_VERSION = "1.0";

// Phase metadata for greetings, quotes, and visual badges
const PHASE_META: Record<
  TimePhase,
  {
    greeting: string;
    quote: string;
    label: string;
    timeRange: string;
    icon: React.ElementType;
    accentColor: string;
  }
> = {
  sunrise: {
    greeting: "Selamat pagi",
    quote: "Awali hari dengan ketenangan dan kejernihan batin.",
    label: "Fajar",
    timeRange: "05:00 - 08:59",
    icon: Sunrise,
    accentColor: "text-orange-500",
  },
  day: {
    greeting: "Selamat siang",
    quote: "Luangkan sejenak waktu untuk bernapas dan kembali fokus.",
    label: "Siang",
    timeRange: "09:00 - 15:59",
    icon: Sun,
    accentColor: "text-amber-500",
  },
  sunset: {
    greeting: "Selamat sore",
    quote: "Hari bergulir perlahan. Rehatlah sejenak menyambut senja.",
    label: "Senja",
    timeRange: "16:00 - 18:59",
    icon: Sunset,
    accentColor: "text-orange-600",
  },
  night: {
    greeting: "Selamat malam",
    quote: "Lepaskan beban hari ini dalam keheningan sanctuary.",
    label: "Malam",
    timeRange: "19:00 - 04:59",
    icon: Moon,
    accentColor: "text-indigo-400",
  },
};

const PHASE_ORDER: TimePhase[] = ["sunrise", "day", "sunset", "night"];

function getPhaseFromLocalTime(): TimePhase {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return "sunrise"; // 05:00-08:59
  if (hour >= 9 && hour < 16) return "day"; // 09:00-15:59
  if (hour >= 16 && hour < 19) return "sunset"; // 16:00-18:59
  return "night"; // 19:00-04:59
}

function getSafeRedirect() {
  if (typeof window === "undefined") return "/dashboard";
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return "/dashboard";
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

function LoginContent({ defaultMode }: { defaultMode?: AuthMode }) {
  const router = useRouter();

  // Mode: Sign In, Sign Up, Forgot Password
  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode || "SIGN_IN");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Error States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Time & Phase State
  const [phase, setPhase] = useState<TimePhase>("day");
  const [isForcedOverride, setIsForcedOverride] = useState(false);

  // Terms Modal State
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState("");
  const [pendingRedirect, setPendingRedirect] = useState("/dashboard");
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);

  // 1. Initial time resolution & URL parameter override (?time=sunrise|day|sunset|night)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get("time");

    if (
      timeParam === "sunrise" ||
      timeParam === "day" ||
      timeParam === "sunset" ||
      timeParam === "night"
    ) {
      setPhase(timeParam);
      setIsForcedOverride(true);
    } else {
      setPhase(getPhaseFromLocalTime());
    }
  }, []);

  // 2. Re-check local time every 60 seconds (when not overridden via URL/manual)
  useEffect(() => {
    if (isForcedOverride) return;

    const interval = setInterval(() => {
      const nextPhase = getPhaseFromLocalTime();
      setPhase((prev) => (prev !== nextPhase ? nextPhase : prev));
    }, 60000);

    return () => clearInterval(interval);
  }, [isForcedOverride]);

  // 3. Hidden "T" key listener to cycle through the 4 phases
  const cyclePhase = useCallback(() => {
    setPhase((current) => {
      const currentIndex = PHASE_ORDER.indexOf(current);
      const nextIndex = (currentIndex + 1) % PHASE_ORDER.length;
      return PHASE_ORDER[nextIndex];
    });
    setIsForcedOverride(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        cyclePhase();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cyclePhase]);

  // 4. Handle URL search parameters & Terms gating
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const redirected = params.get("redirected") === "true";
    if (redirected) {
      setFormError(
        "Halaman ini hanya bisa diakses setelah masuk. Silakan masuk terlebih dahulu."
      );
    }

    const tab = params.get("tab");
    if (tab === "signup") {
      setAuthMode("SIGN_UP");
    } else if (tab === "signin" || tab === "login") {
      setAuthMode("SIGN_IN");
    } else if (tab === "forgot") {
      setAuthMode("FORGOT_PASSWORD");
    }

    const errorParam = params.get("error");
    if (errorParam === "oauth_cancelled") {
      setFormError("Proses masuk dengan Google dibatalkan.");
    } else if (
      errorParam === "token_exchange_failed" ||
      errorParam === "profile_fetch_failed"
    ) {
      setFormError("Gagal otentikasi Google. Silakan coba kembali.");
    }
  }, []);

  // Validation Helpers
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setFormError("");

    if (!email.trim()) {
      setEmailError("Email wajib diisi");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Format email tidak valid");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Kata sandi wajib diisi");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter");
      isValid = false;
    }

    return isValid;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      // =========================================================================
      // TODO: Real authentication call
      // The section below executes the real authentication API, with fallback simulation
      // =========================================================================
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email atau kata sandi tidak cocok.");
      }

      // Handle terms or direct navigation
      const user = data?.user;
      if (
        user &&
        (!user.termsAcceptedAt || user.termsVersion !== CURRENT_TERMS_VERSION)
      ) {
        setPendingUserEmail(user.email);
        setPendingRedirect(
          user.onboardingCompleted ? getSafeRedirect() : "/assessment"
        );
        setShowTerms(true);
        return;
      }

      const redirect = user?.onboardingCompleted
        ? getSafeRedirect()
        : "/assessment";
      window.location.href = redirect;
    } catch (err) {
      // In standalone demo / simulated mode:
      console.warn("Auth note:", err);
      setFormError(
        err instanceof Error ? err.message : "Terjadi kendala saat masuk."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!pendingUserEmail) return;
    setIsAcceptingTerms(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ACCEPT_TERMS",
          email: pendingUserEmail,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan persetujuan Terms.");
      setShowTerms(false);
      window.location.href = pendingRedirect;
    } catch (error) {
      setFormError("Gagal menyimpan persetujuan Terms.");
    } finally {
      setIsAcceptingTerms(false);
    }
  };

  const isNight = phase === "night";
  const currentMeta = PHASE_META[phase];
  const PhaseIcon = currentMeta.icon;

  return (
    <>
      <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none">
        {/* ── LIVING WATERCOLOR BACKGROUND (4 Layers, Ambient Motion, Stars) ── */}
        <WatercolorBackground phase={phase} isNight={isNight} />

        {/* ── TOP NAVIGATION BAR ── */}
        <header className="relative z-30 mx-auto w-full max-w-7xl flex items-center justify-between px-5 sm:px-8 py-5">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 border shadow-xs cursor-pointer ${
              isNight
                ? "bg-stone-900/70 text-cream border-white/15 hover:bg-stone-800"
                : "bg-white/80 text-brown-900 border-brown-900/10 hover:bg-white"
            } backdrop-blur-md`}
          >
            <ArrowLeft
              size={15}
              strokeWidth={2.2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span className="hidden xs:inline">Kembali</span>
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
              className={`font-display text-xl font-extrabold tracking-tight transition-colors duration-[3000ms] ${
                isNight ? "text-cream" : "text-brown-900"
              }`}
            >
              ZYBA
            </span>
          </Link>

          {/* Time Phase Debug / Interactive Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cyclePhase}
              title="Klik atau tekan tombol 'T' untuk beralih suasana waktu"
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-[3000ms] border shadow-xs cursor-pointer ${
                isNight
                  ? "bg-stone-900/75 text-cream border-white/15 hover:bg-stone-800"
                  : "bg-white/80 text-brown-900 border-brown-900/10 hover:bg-white"
              } backdrop-blur-md`}
            >
              <PhaseIcon className={`w-3.5 h-3.5 ${currentMeta.accentColor}`} strokeWidth={2.2} />
              <span>{currentMeta.label}</span>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  isNight ? "bg-white/10 text-stone-300" : "bg-brown-900/5 text-brown-700/70"
                }`}
              >
                {isForcedOverride ? "Manual" : "Auto"} · [T]
              </span>
            </button>
          </div>
        </header>

        {/* ── UPPER-MIDDLE CENTERED GLASSMORPHIC CARD ── */}
        <div className="relative z-20 flex-1 flex items-start sm:items-center justify-center px-4 pt-4 pb-12 sm:py-10">
          <div
            className={`w-full max-w-[400px] rounded-[20px] p-6 sm:p-7 shadow-xl backdrop-blur-[14px] border transition-all duration-[3000ms] ease-in-out ${
              isNight
                ? "bg-[#141B22]/75 border-white/15 text-[#F7F3EA]"
                : "bg-white/78 border-white/90 text-[#241A12]"
            }`}
            style={{
              boxShadow: isNight
                ? "0 20px 40px -15px rgba(0, 0, 0, 0.65)"
                : "0 20px 40px -15px rgba(59, 42, 32, 0.15)",
            }}
          >
            {/* SUB-FLOWS (FORGOT PASSWORD / SIGN UP) */}
            {authMode === "FORGOT_PASSWORD" && (
              <ForgotPasswordCard
                onBack={() => setAuthMode("SIGN_IN")}
                defaultEmail={email}
              />
            )}

            {authMode === "SIGN_UP" && (
              <ProfileSecurityFlow
                initialEmail={email}
                onSwitchToSignIn={() => setAuthMode("SIGN_IN")}
                onSignupSuccess={(userEmail) => {
                  setPendingUserEmail(userEmail);
                  setPendingRedirect("/assessment");
                  setShowTerms(true);
                }}
              />
            )}

            {/* MAIN SIGN IN FORM */}
            {authMode === "SIGN_IN" && (
              <div>
                {/* Header: Title + Dynamic Phase Subtitle */}
                <div className="text-center sm:text-left">
                  <h1
                    className={`font-display text-2xl sm:text-[26px] font-extrabold tracking-tight leading-tight transition-colors duration-[3000ms] ${
                      isNight ? "text-[#FAF6EE]" : "text-[#241A12]"
                    }`}
                  >
                    Welcome back
                  </h1>
                  <p
                    className={`mt-1.5 text-xs sm:text-sm font-medium transition-colors duration-[3000ms] ${
                      isNight ? "text-stone-300" : "text-brown-700/80"
                    }`}
                  >
                    <span className="font-bold text-orange-500">{currentMeta.greeting}</span> —{" "}
                    {currentMeta.quote}
                  </p>
                </div>

                {/* General Form Error */}
                {formError && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-orange-500/30 bg-orange-100/90 px-3.5 py-2.5 text-xs font-semibold text-danger shadow-xs">
                    <span
                      aria-hidden="true"
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]"
                    >
                      !
                    </span>
                    <span>{formError}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3.5">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className={`text-xs font-bold transition-colors duration-[3000ms] ${
                        isNight ? "text-stone-200" : "text-brown-900"
                      }`}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={15}
                        strokeWidth={1.8}
                        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-[3000ms] ${
                          isNight ? "text-stone-400" : "text-brown-700/40"
                        }`}
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        placeholder="nama@email.com"
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "email-error" : undefined}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all duration-200 ${
                          isNight
                            ? "bg-white/10 text-white border-white/20 placeholder:text-stone-400 focus:border-orange-400 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/30"
                            : "bg-white/85 text-brown-900 border-brown-900/12 placeholder:text-brown-700/35 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p id="email-error" className="text-[11px] font-semibold text-danger mt-0.5">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="password"
                      className={`text-xs font-bold transition-colors duration-[3000ms] ${
                        isNight ? "text-stone-200" : "text-brown-900"
                      }`}
                    >
                      Kata sandi
                    </label>
                    <div className="relative">
                      <LockKeyhole
                        size={15}
                        strokeWidth={1.8}
                        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-[3000ms] ${
                          isNight ? "text-stone-400" : "text-brown-700/40"
                        }`}
                      />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError("");
                        }}
                        placeholder="Masukkan kata sandi"
                        autoComplete="current-password"
                        aria-invalid={Boolean(passwordError)}
                        aria-describedby={passwordError ? "password-error" : undefined}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium outline-none transition-all duration-200 ${
                          isNight
                            ? "bg-white/10 text-white border-white/20 placeholder:text-stone-400 focus:border-orange-400 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/30"
                            : "bg-white/85 text-brown-900 border-brown-900/12 placeholder:text-brown-700/35 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isNight
                            ? "text-stone-400 hover:text-white"
                            : "text-brown-700/40 hover:text-brown-900"
                        }`}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p id="password-error" className="text-[11px] font-semibold text-danger mt-0.5">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Options Row: Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-brown-900/20 text-orange-500 focus:ring-orange-500/30"
                      />
                      <span
                        className={`font-medium transition-colors duration-[3000ms] ${
                          isNight ? "text-stone-300" : "text-brown-700/75"
                        }`}
                      >
                        Ingat saya
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setAuthMode("FORGOT_PASSWORD")}
                      className={`font-semibold transition-colors duration-[3000ms] hover:text-orange-500 cursor-pointer ${
                        isNight ? "text-stone-300" : "text-brown-700/75"
                      }`}
                    >
                      Lupa kata sandi?
                    </button>
                  </div>

                  {/* Primary Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                      isNight
                        ? "bg-[#F7F3EA] text-[#141B22] hover:bg-orange-400 hover:text-white"
                        : "bg-[#261C14] text-white hover:bg-orange-500"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Sedang masuk...</span>
                      </>
                    ) : (
                      <span>Sign in</span>
                    )}
                  </button>
                </form>

                {/* Divider: Or Continue With Google */}
                <div className="my-4 flex items-center gap-3">
                  <span
                    className={`h-px flex-1 transition-colors duration-[3000ms] ${
                      isNight ? "bg-white/10" : "bg-brown-900/10"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-[3000ms] ${
                      isNight ? "text-stone-400" : "text-brown-700/40"
                    }`}
                  >
                    or continue with Google
                  </span>
                  <span
                    className={`h-px flex-1 transition-colors duration-[3000ms] ${
                      isNight ? "bg-white/10" : "bg-brown-900/10"
                    }`}
                  />
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  disabled={isGoogleLoading || isSubmitting}
                  onClick={() => {
                    setIsGoogleLoading(true);
                    window.location.href = "/api/auth/google";
                  }}
                  className={`flex min-h-10 w-full items-center justify-center gap-2.5 rounded-full border px-4 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
                    isNight
                      ? "bg-white/10 text-white border-white/15 hover:bg-white/15"
                      : "bg-white text-brown-900 border-brown-900/12 hover:bg-cream/40"
                  }`}
                >
                  {isGoogleLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
                      <span>Membuka Google...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Switch to Sign Up */}
                <div className="mt-4 text-center">
                  <p
                    className={`text-xs transition-colors duration-[3000ms] ${
                      isNight ? "text-stone-300" : "text-brown-700/70"
                    }`}
                  >
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("SIGN_UP")}
                      className={`font-bold underline underline-offset-2 transition-colors cursor-pointer hover:text-orange-500 ${
                        isNight ? "text-white" : "text-brown-900"
                      }`}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER SANCTUARY BRAND LINE ── */}
        <footer className="relative z-30 pb-4 text-center">
          <div
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-[3000ms] ${
              isNight ? "text-stone-400" : "text-brown-700/60"
            }`}
          >
            <span className="font-bold">ZYBA</span>
            <span>·</span>
            <span>Pelan-pelan, tapi tetap jalan.</span>
          </div>
        </footer>
      </main>

      {/* TERMS MODAL */}
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
