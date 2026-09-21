"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommunity, CommunityView, VIEW_TO_SLUG } from "../context/CommunityContext";

/**
 * Instagram-style collapsible Community Sidebar
 * - Default: icon-only (w-16), collapsed
 * - On hover: expands to full width (w-64) with smooth slide animation
 * - Active item: brown-900 fill; hover: orange→green gradient (matches dashboard)
 */
export default function CommunitySidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const {
    currentView,
    setCurrentView,
    setIsPostModalOpen,
    notifications,
    messages,
  } = useCommunity();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMsgs = messages.filter((m) => (m.unreadCount || 0) > 0).length;

  // Build href from view slug
  const href = (view: CommunityView) => {
    const slug = VIEW_TO_SLUG[view];
    return slug ? `/community/${slug}` : "/community";
  };

  // Active check from URL
  const isActive = (view: CommunityView) => {
    const h = href(view);
    if (h === "/community") {
      return pathname === "/community" || pathname === "/community/for-you";
    }
    return pathname === h || pathname.startsWith(h + "/");
  };

  // ─── Icon definitions ─────────────────────────────────────────────────────
  const icons = {
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    plus: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    search: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    messages: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    activity: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    profile: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    insights: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    following: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    saved: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    liked: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    ghost: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-2 3 2 3-2 3 2 4-2.67V10a8 8 0 0 0-8-8z" />
      </svg>
    ),
    archive: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    hamburger: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    back: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    ),
  };

  // ─── Main nav items ───────────────────────────────────────────────────────
  const NAV_ITEMS: {
    id: CommunityView;
    label: string;
    iconKey: keyof typeof icons;
    badge?: number;
    isAction?: boolean;
  }[] = [
      { id: "FOR_YOU", label: "Untuk Kamu", iconKey: "home" },
      { id: "SEARCH", label: "Cari", iconKey: "search" },
      { id: "MESSAGES", label: "Pesan", iconKey: "messages", badge: unreadMsgs > 0 ? unreadMsgs : undefined },
      { id: "ACTIVITY", label: "Notifikasi", iconKey: "activity", badge: unreadNotifs > 0 ? unreadNotifs : undefined },
      { id: "PROFILE", label: "Profil", iconKey: "profile" },
      { id: "INSIGHTS", label: "Statistik", iconKey: "insights" },
    ];

  const OTHER_FEEDS: { id: CommunityView; label: string; iconKey: keyof typeof icons }[] = [
    { id: "FOLLOWING", label: "Mengikuti", iconKey: "following" },
    { id: "SAVED", label: "Disimpan", iconKey: "saved" },
    { id: "LIKED", label: "Disukai", iconKey: "liked" },
    { id: "GHOST_POSTS", label: "Postingan Tersembunyi", iconKey: "ghost" },
    { id: "ARCHIVE", label: "Arsip", iconKey: "archive" },
  ];

  // ─── Shared item style ────────────────────────────────────────────────────
  const itemClass = (active: boolean) =>
  `relative flex items-center w-full py-2.5 rounded-xl transition-all duration-300 cursor-pointer select-none
   ${expanded ? "gap-3 px-3 justify-start" : "gap-0 px-0 justify-center"}
   ${
     active
       ? "bg-brown-900 text-cream shadow-md shadow-brown-900/10 font-bold"
       : "text-brown-700 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:text-brown-900 hover:shadow-sm"
   }`;

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ width: expanded ? 240 : 64 }}
      className="hidden md:flex flex-col shrink-0 bg-[#FAF7F2] border-r border-brown-900/10 h-screen select-none transition-[width] duration-300 ease-in-out overflow-hidden z-30"
    >
      {/* ── Top logo row ─────────────────────────────────────── */}
      <div className="flex items-center h-14 px-3.5 border-b border-brown-900/8 shrink-0 gap-3 overflow-hidden">
        {/* Hamburger / logo icon — always visible */}
        <div className="w-7 h-7 shrink-0 flex items-center justify-center text-brown-900/70">
          {icons.hamburger}
        </div>

        {/* Label — fades in when expanded */}
        <div
          className="flex items-center gap-2 overflow-hidden transition-all duration-300"
          style={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
        >
          <Link href="/dashboard" className="flex items-center gap-1.5 group" title="Kembali ke ZYBA">
            <span className="font-bold text-sm text-brown-900 tracking-tight whitespace-nowrap">
              Zyba Community
            </span>
          </Link>
        </div>
      </div>

      {/* ── Scrollable Nav ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-4">

        {/* Back to dashboard — always icon, label on expand */}
        <div className="px-2.5">
          <Link
            href="/dashboard"
            title="Kembali ke Dashboard"
            className={`${itemClass(false)} text-xs font-semibold`}
          >
            <span className="shrink-0 flex items-center justify-center w-5">{icons.back}</span>
            <span
              className="whitespace-nowrap text-xs font-semibold transition-all duration-200"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0, overflow: "hidden" }}
            >
              Kembali ke ZYBA
            </span>
          </Link>
        </div>

        {/* Main Nav */}
        <nav className="px-2.5 space-y-0.5">
          {/* For you */}
          <button
            type="button"
            onClick={() => setCurrentView("FOR_YOU")}
            title="For you"
            className={itemClass(isActive("FOR_YOU"))}
          >
            <span className="shrink-0 flex items-center justify-center w-5">{icons.home}</span>
            <span
              className="whitespace-nowrap text-xs font-semibold transition-all duration-200"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0, overflow: "hidden" }}
            >
              For you
            </span>
          </button>

          {/* + Thread Baru */}
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            title="Thread Baru"
            className={itemClass(false)}
          >
            <span className="shrink-0 flex items-center justify-center w-5">{icons.plus}</span>
            <span
              className="whitespace-nowrap text-xs font-semibold transition-all duration-200"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0, overflow: "hidden" }}
            >
              Thread Baru
            </span>
          </button>

          {/* Other nav items */}
          {NAV_ITEMS.slice(1).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              title={item.label}
              className={itemClass(isActive(item.id))}
            >
              <span className="shrink-0 flex items-center justify-center w-5">{icons[item.iconKey]}</span>
              <span
                className="whitespace-nowrap text-xs font-semibold transition-all duration-200 flex-1 text-left"
                style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0, overflow: "hidden" }}
              >
                {item.label}
              </span>
              {/* Badge — only visible when expanded */}
              {item.badge && expanded && (
                <span className="ml-auto w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {item.badge}
                </span>
              )}
              {/* Dot badge on collapsed */}
              {item.badge && !expanded && (
                <span className="absolute top-1.5 right-1 w-2 h-2 rounded-full bg-orange-500 border border-[#FAF7F2]" />
              )}
            </button>
          ))}
        </nav>

        {/* Other Feeds Section */}
        <div className="px-2.5 border-t border-brown-900/6 pt-3">
          {/* Section label — only when expanded */}
          <div
            className="px-3 pb-1.5 transition-all duration-200 overflow-hidden"
            style={{ opacity: expanded ? 1 : 0, maxHeight: expanded ? 32 : 0 }}
          >
            <span className="text-[10px] font-bold text-brown-700/50 uppercase tracking-wider whitespace-nowrap">
              Feed Lain
            </span>
          </div>

          <nav className="space-y-0.5">
            {OTHER_FEEDS.map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => setCurrentView(feed.id)}
                title={feed.label}
                className={itemClass(isActive(feed.id))}
              >
                <span className="shrink-0 flex items-center justify-center w-5">{icons[feed.iconKey]}</span>
                <span
                  className="whitespace-nowrap text-xs font-semibold transition-all duration-200"
                  style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0, overflow: "hidden" }}
                >
                  {feed.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
