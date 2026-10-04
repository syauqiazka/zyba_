"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import NavigationProgress from "@/components/ui/NavigationProgress";

const PROTECTED_PATHS = [
  "/dashboard",
  "/wellness-journey",
  "/daily-assessment",
  "/mood-check-in",
  "/activity",
  "/companion",
  "/community",
  "/resources",
  "/assessment",
  "/settings",
  "/welcome",
  "/achievements",
  "/pencapaian",
];

function isProtectedPath(pathname: string | null) {
  if (!pathname) return false;
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function SidebarSkeleton() {
  return (
    <aside className="w-64 md:w-20 lg:w-64 shrink-0 border-r border-brown-900/10 bg-white/70 backdrop-blur-md min-h-screen p-4 lg:p-6 flex flex-col justify-between sticky top-0 h-screen z-30 animate-pulse">
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-2xl bg-cream border border-brown-900/10" />

          <div className="flex flex-col gap-1 md:hidden lg:flex">
            <div className="w-16 h-4 bg-cream rounded" />
            <div className="w-20 h-2 bg-cream rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-cream rounded-2xl"
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function PageLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-300">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-7 h-7 rounded-full bg-orange-500/30 -top-1 left-1/2 -translate-x-1/2 animate-ping" />
        <div className="absolute w-7 h-7 rounded-full bg-green-500/30 -bottom-1 left-1/2 -translate-x-1/2 animate-ping delay-150" />
        <div className="absolute w-7 h-7 rounded-full bg-orange-500/30 -left-1 top-1/2 -translate-y-1/2 animate-ping delay-300" />
        <div className="absolute w-7 h-7 rounded-full bg-green-500/30 -right-1 top-1/2 -translate-y-1/2 animate-ping delay-500" />

        <div className="relative w-12 h-12 rounded-2xl bg-cream border border-orange-500/20 shadow-md flex items-center justify-center z-10 animate-bounce">
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2" />
          <div className="w-3 h-3 rounded-full bg-brown-900 z-20" />
        </div>
      </div>

      <p className="text-xs font-semibold text-brown-700">
        Memuat halaman...
      </p>
    </div>
  );
}

import Link from "next/link";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerAvatar, setHeaderAvatar] = useState<string>("🦊");
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");

  useEffect(() => {
    if (!isProtectedPath(pathname)) {
      setAuthStatus("authenticated");
      return;
    }

    let cancelled = false;

    const verifySession = async () => {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (cancelled) return;

        if (!res.ok) {
          setAuthStatus("unauthenticated");
          const redirectUrl = `/login?redirected=true&redirect=${encodeURIComponent(pathname)}`;
          router.replace(redirectUrl);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (!data?.user) {
          setAuthStatus("unauthenticated");
          router.replace(`/login?redirected=true&redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        setAuthStatus("authenticated");
      } catch {
        if (!cancelled) {
          setAuthStatus("unauthenticated");
          router.replace(`/login?redirected=true&redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  // Baca avatar dari localStorage saat mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("zyba_user_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.avatarUrl) setHeaderAvatar(parsed.avatarUrl);
      }
    } catch {}
  }, []);

  // Sync avatar real-time saat user upload foto baru (tanpa reload)
  useEffect(() => {
    const handler = (e: any) => {
      const url = e?.detail?.avatarUrl;
      if (url) setHeaderAvatar(url);
    };
    window.addEventListener("zyba_user_updated", handler);
    return () => window.removeEventListener("zyba_user_updated", handler);
  }, []);

  // Close sidebar drawer whenever profile popup is requested (mobile)
  useEffect(() => {
    const handler = () => setMobileSidebarOpen(false);
    window.addEventListener("zyba_open_profile", handler);
    return () => window.removeEventListener("zyba_open_profile", handler);
  }, []);

  // Public pages + assessment + feature explainer pages
  if (
    pathname === "/" ||
    pathname === "/onboarding" ||
    pathname === "/login" ||
    pathname.startsWith("/assessment")
  ) {
    return (
      <>
        <NavigationProgress />

        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
      </>
    );
  }

  if (isProtectedPath(pathname) && authStatus !== "authenticated") {
    return (
      <>
        <NavigationProgress />
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-brown-900">
          <div className="w-full max-w-md rounded-[28px] border border-brown-900/10 bg-white p-8 text-center shadow-[0_24px_60px_rgba(41,35,31,0.08)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
              🔒
            </div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brown-700/60">
              Akses dibatasi
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.05em] text-brown-900">
              Silakan masuk terlebih dahulu
            </h1>
            <p className="mt-3 text-sm leading-6 text-brown-700">
              Halaman ini hanya bisa dibuka setelah akun Anda login.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/login?redirected=true&redirect=${encodeURIComponent(pathname ?? "/dashboard")}`)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-brown-900 px-5 py-3 text-sm font-extrabold text-white transition-all hover:bg-orange-500"
            >
              {authStatus === "checking" ? "Memeriksa sesi..." : "Masuk ke ZYBA"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Contextual app-within-app sections
  // These have their own dedicated layouts/sidebar
  if (
    pathname.startsWith("/companion") ||
    pathname.startsWith("/community")
  ) {
    return (
      <>
        <NavigationProgress />

        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
      </>
    );
  }

  // Protected pages — global sidebar + mobile top bar + mobile bottom nav
  return (
    <>
      <NavigationProgress />

      {/* Mobile Sticky Top Header Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-brown-900/10 px-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-cream border border-brown-900/10 flex items-center justify-center text-brown-900 active:scale-95 transition-all"
            aria-label="Buka menu lengkap"
            title="Menu Lengkap"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative w-7 h-7 shrink-0 flex items-center justify-center rounded-xl bg-cream border border-orange-500/20 shadow-2xs">
              <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2" />
              <div className="w-2 h-2 rounded-full bg-brown-900 z-10" />
            </div>
            <span className="font-display font-black text-base tracking-tight text-brown-900">
              ZYBA
            </span>
          </Link>
        </div>

        {/* Right side: Mobile Profile Avatar Button */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("zyba_open_profile"));
          }}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-cream border border-brown-900/10 active:scale-95 transition-all shadow-2xs cursor-pointer"
          title="Buka profil ZYBA"
          aria-label="Profil Saya"
        >
          <div className="w-8 h-8 rounded-full bg-cream border border-orange-400 flex items-center justify-center text-sm shadow-2xs overflow-hidden">
            {headerAvatar.startsWith("http") || headerAvatar.startsWith("/") || headerAvatar.startsWith("data:") ? (
              <img src={headerAvatar} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span>{headerAvatar}</span>
            )}
          </div>
        </button>
      </header>

      {/* Mobile: backdrop overlay — z-50 so it covers bottom nav */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex items-start min-h-screen">
        {/* Sidebar (Desktop sticky, Mobile sliding drawer — z-[55] to appear above overlay+bottom nav) */}
        <div
          className={`fixed md:sticky top-0 left-0 z-[55] h-screen transition-transform duration-300 md:translate-x-0 ${
            mobileSidebarOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar
              onClose={() => setMobileSidebarOpen(false)}
            />
          </Suspense>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-3.5 pt-[68px] pb-24 sm:px-6 md:px-6 md:pt-6 md:pb-12 lg:px-10 lg:pt-8 overflow-x-hidden">
          <Suspense fallback={<PageLoadingFallback />}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar — hidden when sidebar drawer is open */}
      <MobileBottomNav hiddenWhenSidebarOpen={mobileSidebarOpen} />
    </>
  );
}