"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfilePopover, { ProfileUser } from "../profile/ProfilePopover";
import ProfileSettingsModal from "../profile/ProfileSettingsModal";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/daily-assessment", label: "Assessment Harian", icon: "calendar-check" },
  { href: "/mood-check-in", label: "Mood Check-In", icon: "smile" },
  { href: "/companion", label: "Zyba Companion", icon: "bot" },
  { href: "/activity", label: "Smart Activity Planner", icon: "activity" },
  { href: "/wellness-journey", label: "Wellness Journey", icon: "heart" },
  { href: "/community", label: "Zyba Community", icon: "users" },
  { href: "/resources", label: "Resources", icon: "book" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Instant hydration from localStorage cache to eliminate any loading delay
  const [currentUser, setCurrentUser] = useState<ProfileUser>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.name) {
            return {
              name: parsed.name,
              email: parsed.email || "user@zyba.app",
              avatarUrl: parsed.avatarUrl || "🦊",
              plan: parsed.plan || "FREE",
              streak: parsed.stats?.streak || 1,
              zybaScore: parsed.stats?.zybaScore || null,
            };
          }
        }
      } catch {}
    }
    return {
      name: "Pengguna ZYBA",
      email: "user@zyba.app",
      avatarUrl: "🦊",
      plan: "FREE",
      streak: 1,
      zybaScore: null,
    };
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const updatedUser: ProfileUser = {
              name: data.user.name || "Pengguna ZYBA",
              email: data.user.email || "user@zyba.app",
              avatarUrl: data.user.avatarUrl || "🦊",
              streak: data.stats?.streak || 1,
              zybaScore: data.stats?.zybaScore || null,
            };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem(
                "zyba_user_cache",
                JSON.stringify({
                  ...updatedUser,
                  stats: data.stats,
                })
              );
            } catch {}
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    // Hapus cookie auth-token via API lalu redirect ke halaman login
    await fetch("/api/auth", { method: "DELETE" });
    try {
      localStorage.removeItem("zyba_user_cache");
    } catch {}
    router.push("/login");
  };

  return (
    <aside className="w-64 shrink-0 border-r border-brown-900/10 bg-cream/95 min-h-screen p-5 flex flex-col justify-between sticky top-0 h-screen z-30 shadow-[12px_0_36px_-28px_rgba(59,42,32,0.5)]">
      {/* Mobile close button */}
      {onClose && (
        <button type="button" onClick={onClose} className="md:hidden absolute top-3 right-3 w-8 h-8 rounded-lg bg-brown-900/5 hover:bg-brown-900/10 flex items-center justify-center text-brown-700" aria-label="Tutup menu">
          ✕
        </button>
      )}
      <div className="flex flex-col gap-7">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-2xl bg-cream border border-orange-500/20 shadow-sm group-hover:scale-105 transition-transform">
            {/* 4-petal floral logomark (Orange & Green) */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="w-2.5 h-2.5 rounded-full bg-brown-900 z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-brown-900">
              ZYBA
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-green-500 -mt-1">
              Gen Z Wellness
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group/link relative px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                  isActive
                    ? "bg-brown-900 text-cream shadow-md shadow-brown-900/10 font-semibold"
                    : "text-brown-700 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:text-brown-900 hover:shadow-sm"
                }`}
              >
                <RenderIcon name={item.icon} isActive={isActive} />
                <span>{item.label}</span>
                {item.href === "/companion" && (
                  <span className="ml-auto text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-500">
                    BETA
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Zyba Plus Badge */}
      <div className="flex flex-col gap-3 pt-4 border-t border-brown-900/10">
        <Link
          href="/settings/zyba-plus"
          className="bg-white/70 rounded-xl p-3 flex items-center justify-between border border-brown-900/10 transition-colors hover:bg-white hover:border-orange-500/30"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-orange-100 text-orange-500" aria-hidden="true">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75l1.42 4.83a2 2 0 001.36 1.36L19.6 11.4l-4.82 1.42a2 2 0 00-1.36 1.36L12 19.02l-1.42-4.84a2 2 0 00-1.36-1.36L4.4 11.4l4.82-1.46a2 2 0 001.36-1.36L12 3.75z" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brown-900">
                {currentUser.plan === "PLUS" ? "Zyba Plus" : "Upgrade"}
              </span>
              <span className="text-[10px] text-brown-700">
                {currentUser.plan === "PLUS" ? "Fitur AI Unlocked" : "Unlock fitur premium"}
              </span>
            </div>
          </div>
          {currentUser.plan === "PLUS" ? (
            <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
              PRO
            </span>
          ) : (
            <span className="text-[10px] text-orange-500 font-bold">
              →
            </span>
          )}
        </Link>

        {/* Profile User Control Bar */}
        <div className="relative">
          {/* Profile Popover */}
          <ProfilePopover
            user={currentUser}
            isOpen={isProfilePopoverOpen}
            onClose={() => setIsProfilePopoverOpen(false)}
            onOpenSettings={(tab) => {
              setIsProfilePopoverOpen(false);
              setIsSettingsModalOpen(true);
            }}
            onLogout={handleLogout}
          />

          <div className="bg-white/80 hover:bg-white border border-brown-900/10 rounded-2xl p-2 flex items-center justify-between transition-colors shadow-xs">
            {/* Left: User Avatar + Name + Handle (Clicking toggles Profile Popover) */}
            <button
              type="button"
              onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-green-100/60 transition-colors text-left flex-1 min-w-0 mr-1 cursor-pointer group"
              title="Buka profil"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white font-display font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden">
                  {currentUser.avatarUrl && currentUser.avatarUrl.length <= 4 ? (
                    <span className="text-base">{currentUser.avatarUrl}</span>
                  ) : (
                    <span>{currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "ZY"}</span>
                  )}
                </div>
                {/* Online indicator dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-white" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-brown-900 truncate leading-tight group-hover:text-orange-500 transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-brown-700/80 truncate">
                  @{currentUser.email ? currentUser.email.split("@")[0] : "schatz_232"}
                </span>
              </div>
            </button>

            {/* Right: Settings Gear Icon (Image 2) */}
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl text-brown-700/70 hover:text-brown-900 hover:bg-brown-900/10 transition-colors cursor-pointer shrink-0"
              title="Pengaturan Akun"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Settings Modal */}
        <ProfileSettingsModal
          user={currentUser}
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onUserUpdate={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
          onLogout={handleLogout}
        />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-2 rounded-2xl w-full text-left text-xs font-semibold text-brown-700/60 hover:text-danger hover:bg-orange-50 transition-colors group"
        >
          <svg
            className="w-4 h-4 text-brown-700/50 group-hover:text-danger transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}

function RenderIcon({ name, isActive }: { name: string; isActive: boolean }) {
  const strokeClass = isActive ? "stroke-cream" : "stroke-brown-700";
  switch (name) {
    case "home":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "clipboard-check":
      // ClipboardCheck — Assessment (onboarding baseline)
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case "calendar-check":
      // CalendarCheck2 — Assessment Harian
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l2 2 4-4" />
        </svg>
      );
    case "smile":
      // Smile — Mood Check-In
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "bot":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
        </svg>
      );
    case "activity":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "users":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "book":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "settings":
      // Settings gear icon
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}



