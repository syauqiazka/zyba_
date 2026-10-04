"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfilePopover, { ProfileUser } from "../profile/ProfilePopover";
import ProfileSettingsModal from "../profile/ProfileSettingsModal";
import UserAvatar from "./UserAvatar";
import {
  Home,
  CalendarCheck,
  Bot,
  Zap,
  Heart,
  Users,
  BookOpen,
  Trophy,
  Quote,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/daily-assessment", label: "Assessment Harian", icon: CalendarCheck },
  { href: "/companion", label: "Tanya Zyba", icon: Bot },
  { href: "/activity", label: "Kegiatan Rutin Harian", icon: Zap },
  { href: "/wellness-journey", label: "Ruang Sehat", icon: Heart },
  { href: "/community", label: "Komunitas Zyba", icon: Users },
  { href: "/resources", label: "Wawasan", icon: Quote },
  { href: "/guidebook", label: "Buku Panduan", icon: BookOpen },
  { href: "/achievements", label: "Pencapaian", icon: Trophy },
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
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const updatedUser: ProfileUser = {
              name: data.user.name || "Pengguna ZYBA",
              email: data.user.email || "user@zyba.app",
              avatarUrl: data.user.avatarUrl || "🦊",
              plan: data.user.plan || "FREE",
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

  useEffect(() => {
    const handleOpenProfile = () => {
      setIsProfilePopoverOpen(true);
    };
    window.addEventListener("zyba_open_profile", handleOpenProfile);
    return () => window.removeEventListener("zyba_open_profile", handleOpenProfile);
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
    <aside className="w-[82vw] max-w-[290px] md:w-20 lg:w-64 shrink-0 border-r border-brown-900/10 bg-cream p-3 md:p-3 lg:p-5 flex flex-col sticky top-0 h-[100dvh] md:h-screen shadow-[12px_0_36px_-28px_rgba(59,42,32,0.5)] transition-all duration-300 overflow-y-auto scrollbar-none pb-6 md:pb-5">
      {/* Top section: Logo + Nav */}
      <div className="flex flex-col gap-5 flex-1">
        {/* Brand Logo & Close button row */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group justify-start md:justify-center lg:justify-start" title="ZYBA Wellness">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-2xl bg-cream border border-orange-500/20 shadow-sm group-hover:scale-105 transition-transform">
              {/* 4-petal floral logomark (Orange & Green) */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
              <div className="w-2.5 h-2.5 rounded-full bg-brown-900 z-10" />
            </div>
            <div className="flex flex-col md:hidden lg:flex">
              <span className="font-display font-extrabold text-xl tracking-tight text-brown-900 leading-tight">
                ZYBA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-green-600 -mt-0.5">
                Gen Z Wellness
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 active:scale-95 flex items-center justify-center text-brown-700 transition-colors border border-brown-900/10"
              aria-label="Tutup menu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`group/link relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-start md:justify-center lg:justify-start gap-3 ${
                  isActive
                    ? "bg-brown-900 text-cream shadow-md shadow-brown-900/15 font-semibold"
                    : "text-brown-700 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:text-brown-900 hover:shadow-xs"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={isActive ? "text-cream shrink-0" : "text-brown-700 shrink-0"}
                />
                <span className="md:hidden lg:inline truncate">{item.label}</span>
                {item.href === "/companion" && (
                  <span className="ml-auto text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-500 md:hidden lg:inline">
                    BETA
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="flex flex-col gap-3 pt-4 border-t border-brown-900/10 shrink-0">
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

          <div className={currentUser.plan === "PLUS"
            ? "relative overflow-hidden rounded-2xl border border-orange-300/70 bg-gradient-to-br from-orange-50 via-white to-green-50 p-1.5 lg:p-2 shadow-[0_8px_24px_-16px_rgba(233,130,85,0.7)]"
            : "bg-white/80 hover:bg-white border border-brown-900/10 rounded-2xl p-1.5 lg:p-2 flex items-center justify-between md:justify-center lg:justify-between transition-colors shadow-xs"}>
            {currentUser.plan === "PLUS" && (
              <div className="absolute right-2 top-2 md:hidden lg:flex items-center gap-1 rounded-full bg-brown-900 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white shadow-sm">
                <Sparkles size={9} /> PLUS
              </div>
            )}

            {/* Left: User Avatar + Name + Handle (Clicking toggles Profile Popover) */}
            <button
              type="button"
              onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
              className="flex items-center justify-start md:justify-center lg:justify-start gap-2.5 p-1 rounded-xl hover:bg-green-100/60 transition-colors text-left flex-1 min-w-0 cursor-pointer group"
              title="Buka profil"
            >
              <UserAvatar
                src={currentUser.avatarUrl}
                name={currentUser.name}
                size="sm"
                statusConfig={{
                  status: "online",
                  hexColor: "#23a55a",
                  label: "Aktif",
                }}
              />

              <div className="flex flex-col min-w-0 flex-1 md:hidden lg:flex">
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
              className="p-2 rounded-xl text-brown-700/70 hover:text-brown-900 hover:bg-brown-900/10 transition-colors cursor-pointer shrink-0 md:hidden lg:block"
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

