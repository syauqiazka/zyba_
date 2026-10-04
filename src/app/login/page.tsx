"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";

import DesktopShowcase from "./components/DesktopShowcase";
import SignInCard from "./components/SignInCard";
import ForgotPasswordCard from "./components/ForgotPasswordCard";
import ProfileSecurityFlow from "./components/ProfileSecurityFlow";
import TermsAgreementModal from "./components/TermsAgreementModal";

type AuthMode =
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "SIGN_UP";

const CURRENT_TERMS_VERSION = "1.0";

function getSafeRedirect() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  const redirect = new URLSearchParams(
    window.location.search
  ).get("redirect");

  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
  ) {
    return redirect;
  }

  return "/dashboard";
}

function LoginContent({
  defaultMode,
}: {
  defaultMode?: AuthMode;
}) {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>(
    defaultMode || "SIGN_IN"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // TERMS
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState("");
  const [pendingRedirect, setPendingRedirect] =
    useState("/dashboard");
  const [isAcceptingTerms, setIsAcceptingTerms] =
    useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    const redirected = params.get("redirected") === "true";
    if (redirected) {
      setLoginError(
        "Halaman ini hanya bisa diakses setelah login. Silakan masuk ke akun Anda terlebih dahulu."
      );
    }

    const termsRequired =
      params.get("terms_required") === "1";

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
          const res = await fetch("/api/user/me", {
            cache: "no-store",
          });

          if (!res.ok) return;

          const data = await res.json();
          const user = data?.user;

          if (!user?.email) return;

          const needsTerms =
            !user.termsAcceptedAt ||
            user.termsVersion !== CURRENT_TERMS_VERSION;

          if (needsTerms) {
            setPendingUserEmail(user.email);
            setPendingRedirect(safeRedirect);
            setShowTerms(true);
          }
        } catch (error) {
          console.error(
            "Failed to load user for Terms:",
            error
          );
        }
      };

      loadTermsUser();
    }

    const tab = params.get("tab");

    if (tab === "signup") {
      setAuthMode("SIGN_UP");
    } else if (
      tab === "signin" ||
      tab === "login"
    ) {
      setAuthMode("SIGN_IN");
    } else if (tab === "forgot") {
      setAuthMode("FORGOT_PASSWORD");
    } else if (defaultMode) {
      setAuthMode(defaultMode);
    }

    const errorParam = params.get("error");

    if (!errorParam) {
      return;
    }

    if (errorParam === "oauth_cancelled") {
      setLoginError(
        "Proses masuk dengan Google dibatalkan."
      );
    } else if (
      errorParam === "token_exchange_failed" ||
      errorParam === "profile_fetch_failed"
    ) {
      setLoginError(
        "Gagal otentikasi dengan Google. Silakan coba lagi."
      );
    } else if (
      errorParam === "server_config_error"
    ) {
      setLoginError(
        "Konfigurasi Google Client ID/Secret belum lengkap."
      );
    } else {
      setLoginError(
        "Terjadi kendala saat login dengan Google."
      );
    }
  }, [defaultMode]);

  const handleTermsRequired = (
    userEmail: string,
    redirect: string
  ) => {
    setPendingUserEmail(userEmail);
    setPendingRedirect(redirect);
    setShowTerms(true);
  };

  const handleLoginSuccess = (data: any) => {
    const user = data?.user;

    if (!user?.email) {
      setLoginError(
        "Data akun tidak ditemukan. Silakan coba login kembali."
      );
      return;
    }

    const needsTerms =
      !user.termsAcceptedAt ||
      user.termsVersion !== CURRENT_TERMS_VERSION;

    if (needsTerms) {
      const redirect = user.onboardingCompleted
        ? getSafeRedirect()
        : "/assessment";

      handleTermsRequired(
        user.email,
        redirect
      );

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
        setLoginError(
          data.error ||
          "Email atau password salah."
        );
        return;
      }

      handleLoginSuccess(data);
    } catch (error) {
      console.error("Sign in error:", error);

      setLoginError(
        "Terjadi kesalahan jaringan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!pendingUserEmail) {
      setLoginError(
        "Email akun tidak ditemukan."
      );
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
        throw new Error(
          data.error ||
          "Gagal menyimpan persetujuan Terms."
        );
      }

      setShowTerms(false);

      window.location.href =
        pendingRedirect;
    } catch (error) {
      console.error(
        "Accept terms error:",
        error
      );

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

  return (
    <>
      <main className="min-h-screen bg-cream text-brown-900">
        <div className="mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-5 py-5 sm:px-7 lg:px-10">

          {/* TOP BAR */}
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-brown-700 transition-colors hover:bg-white hover:text-brown-900"
            >
              <ArrowLeft
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              Kembali
            </button>

            <div className="hidden items-center gap-2 text-xs font-semibold text-brown-700/60 sm:flex">
              <ShieldCheck size={14} />

              Privat · aman · bukan diagnosis
            </div>
          </header>

          {/* CONTENT */}
          <div className="flex flex-1 items-center justify-center py-8 md:py-12">
            <div className="grid w-full items-stretch gap-8 lg:grid-cols-[1.02fr_0.78fr] xl:gap-12">

              {/* LEFT */}
              <section className="hidden min-h-[650px] overflow-hidden rounded-[32px] border border-brown-900/10 bg-[#f6f1e7] lg:flex">
                <DesktopShowcase />
              </section>

              {/* RIGHT */}
              <section className="flex items-center">
                <div className="mx-auto w-full max-w-[500px]">

                  {/* BRAND + MODE SWITCH */}
                  <div className="mb-5 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">
                      <span
                        className="relative block h-8 w-8 shrink-0"
                        aria-hidden="true"
                      >
                        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-orange-500" />
                        <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-500" />
                        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green-500" />
                        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-orange-500" />
                        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brown-900" />
                      </span>

                      <span className="font-display text-xl font-extrabold tracking-tight">
                        ZYBA
                      </span>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-brown-900/10 bg-white/70 p-1">

                      <button
                        type="button"
                        onClick={() =>
                          switchMode("SIGN_IN")
                        }
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${authMode === "SIGN_IN"
                          ? "bg-brown-900 text-white shadow-sm"
                          : "text-brown-700 hover:text-brown-900"
                          }`}
                      >
                        Masuk
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          switchMode("SIGN_UP")
                        }
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${authMode === "SIGN_UP"
                          ? "bg-brown-900 text-white shadow-sm"
                          : "text-brown-700 hover:text-brown-900"
                          }`}
                      >
                        Daftar
                      </button>

                    </div>
                  </div>

                  {/* SIGN IN */}
                  {authMode === "SIGN_IN" && (
                    <SignInCard
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      onSubmit={handleSignIn}
                      onGoogleClick={() => {
                        window.location.href =
                          "/api/auth/google";
                      }}
                      onForgotPasswordClick={() =>
                        switchMode(
                          "FORGOT_PASSWORD"
                        )
                      }
                      onSignUpClick={() =>
                        switchMode("SIGN_UP")
                      }
                      isLoading={isLoading}
                    />
                  )}

                  {/* FORGOT PASSWORD */}
                  {authMode ===
                    "FORGOT_PASSWORD" && (
                      <ForgotPasswordCard
                        onBack={() =>
                          switchMode("SIGN_IN")
                        }
                        defaultEmail={email}
                      />
                    )}

                  {/* SIGN UP */}
                  {authMode === "SIGN_UP" && (
                    <ProfileSecurityFlow
                      initialEmail={email}
                      onSwitchToSignIn={() =>
                        switchMode("SIGN_IN")
                      }
                      onSignupSuccess={(userEmail) => {
                        setPendingUserEmail(userEmail);
                        setPendingRedirect("/assessment");
                        setShowTerms(true);
                      }}
                    />
                  )}

                  {/* ERROR */}
                  {loginError &&
                    authMode === "SIGN_IN" && (
                      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-orange-100 px-4 py-3 text-sm font-semibold text-danger shadow-sm">
                        <span
                          aria-hidden="true"
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white"
                        >
                          !
                        </span>

                        <span>
                          {loginError}
                        </span>
                      </div>
                    )}

                  {/* BOTTOM BRAND LINE */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-brown-700/45">
                    <span>ZYBA</span>

                    <ArrowUpRight size={12} />

                    <span>
                      Pelan-pelan, tapi tetap jalan.
                    </span>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* TERMS AGREEMENT */}
      <TermsAgreementModal
        open={showTerms}
        onAccept={handleAcceptTerms}
      />
    </>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<
    string,
    string | string[] | undefined
  >;
}) {
  const tabParam =
    typeof searchParams?.tab === "string"
      ? searchParams.tab
      : undefined;

  const modeFromParam:
    | AuthMode
    | undefined =
    tabParam === "signup"
      ? "SIGN_UP"
      : tabParam === "forgot"
        ? "FORGOT_PASSWORD"
        : undefined;

  return (
    <LoginContent
      defaultMode={modeFromParam}
    />
  );
}