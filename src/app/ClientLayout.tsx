"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import NavigationProgress from "@/components/ui/NavigationProgress";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

        <div className="flex items-center gap-2">
          <Link
            href="/achievements"
            className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
            title="Lihat Pencapaian"
          >
            <span>🏆</span>
            <span>Badge</span>
          </Link>
          <Link
            href="/settings"
            className="w-9 h-9 rounded-xl bg-cream border border-brown-900/10 flex items-center justify-center text-brown-700 active:scale-95 transition-all text-xs"
            title="Pengaturan"
            aria-label="Pengaturan"
          >
            ⚙️
          </Link>
        </div>
      </header>

      {/* Mobile: backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex items-start min-h-screen">
        {/* Sidebar (Desktop sticky, Mobile sliding drawer) */}
        <div
          className={`fixed md:sticky top-0 left-0 z-50 h-screen transition-transform duration-300 md:translate-x-0 ${
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </>
  );
}