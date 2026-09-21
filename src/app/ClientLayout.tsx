"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import NavigationProgress from "@/components/ui/NavigationProgress";

function SidebarSkeleton() {
  return (
    <aside className="w-64 shrink-0 border-r border-brown-900/10 bg-white/70 backdrop-blur-md min-h-screen p-6 flex flex-col justify-between sticky top-0 h-screen z-30">
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-2xl bg-cream border border-brown-900/10 animate-pulse" />
          <div className="flex flex-col gap-1">
            <div className="w-16 h-4 bg-cream rounded animate-pulse" />
            <div className="w-20 h-2 bg-cream rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-cream rounded-2xl animate-pulse" />
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
      <p className="text-xs font-semibold text-brown-700">Memuat halaman...</p>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Public pages AND assessment (full-screen, no sidebar)
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

  // Contextual app-within-app sections (Bagian 10.7 & 11.5) have their own dedicated sidebars
  if (pathname.startsWith("/companion") || pathname.startsWith("/community")) {
    return (
      <>
        <NavigationProgress />
        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
      </>
    );
  }

  // Protected and internal app pages (dashboard, companion, community, dll) render with Sidebar
  return (
    <>
      <NavigationProgress />
      <div className="flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 max-w-[1400px] mx-auto px-6 py-6 md:px-10 md:py-8 min-w-0">
          <Suspense fallback={<PageLoadingFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
    </>
  );
}
