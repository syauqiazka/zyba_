"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompanion, CompanionSection, SECTION_TO_SLUG } from "../context/CompanionContext";
import { getPersonaById } from "@/backend/ai/personas";

interface Conversation {
  id: string;
  title: string;
  time: string;
  emotionTag: string;
}

interface CompanionSidebarProps {
  conversations: Conversation[];
  activeConvId: string | undefined;
  onSelectConv: (id: string) => void;
  onNewChat: () => void;
  /** Sidebar visibility — passed from layout */
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  Tenang: "bg-mood-neutral",
  Bahagia: "bg-mood-happy",
  Sedih: "bg-mood-sad",
  Overjoyed: "bg-mood-overjoyed",
  Tekanan: "bg-mood-depressed",
};

/**
 * CompanionSidebar — Claude.ai layout with:
 * - URL-based routing (/companion, /companion/projects, /companion/artifacts, etc.)
 * - Dashboard-matching hover styles (orange→green gradient, -translate-y-0.5)
 * - Hide sidebar button (collapses to icon rail)
 */
export default function CompanionSidebar({
  conversations,
  activeConvId,
  onSelectConv,
  onNewChat,
  sidebarVisible,
  onToggleSidebar,
}: CompanionSidebarProps) {
  const pathname = usePathname();
  const {
    activeSection,
    setActiveSection,
    setShowSettingsModal,
    showPersonaModal,
    setShowPersonaModal,
    setShowDeleteModal,
    setConvIdToDelete,
    selectedPersona,
    setShowProModal,
  } = useCompanion();
  const currentPersona = getPersonaById(selectedPersona);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Active check based on URL ────────────────────────────────────────────
  const isActive = (sec: CompanionSection) => {
    const slug = SECTION_TO_SLUG[sec];
    if (!slug) {
      // "chat" section = root /companion or /companion/ (no sub-slug)
      return (
        pathname === "/companion" ||
        pathname === "/companion/" ||
        // also active if a chat conv is open but no specific sub-section slug
        (!Object.values(SECTION_TO_SLUG)
          .filter(Boolean)
          .some((s) => pathname.startsWith(`/companion/${s}`)) &&
          pathname.startsWith("/companion"))
      );
    }
    return pathname.startsWith(`/companion/${slug}`);
  };

  // ── Shared nav item style (subtle active per AGENTS.md 10.8) ────────────
  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 text-left
     ${
       active
         ? "bg-brown-900/8 text-brown-900 font-bold"
         : "text-brown-700 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:text-brown-900 hover:shadow-sm"
     }`;

  // ── Icon helpers ─────────────────────────────────────────────────────────
  const icons = {
    collapse: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    ),
    expand: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M15 3v18" />
      </svg>
    ),
    projects: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    artifacts: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    code: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    customize: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    chat: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    search: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    sort: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="4" y1="6" x2="16" y2="6" />
        <line x1="4" y1="12" x2="12" y2="12" />
        <line x1="4" y1="18" x2="8" y2="18" />
      </svg>
    ),
  };

  const NAV_SECTIONS: { id: CompanionSection; label: string; iconKey: keyof typeof icons; badge?: string }[] = [];
  // Bagian 23.1: Proyek/Catatan/Kode/Pengaturan dihapus — scope creep

  // ── Dynamic username from localStorage cache ─────────────────────────────
  const displayName = (() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          return parsed.name || "Pengguna";
        }
      } catch {}
    }
    return "Pengguna";
  })();

  const displayInitial = displayName.charAt(0).toUpperCase();

  // ── When collapsed, show a slim icon rail ───────────────────────────────
  if (!sidebarVisible) {
    return (
      <aside className="flex flex-col w-14 shrink-0 bg-[#FAF7F2] border-r border-brown-900/10 h-screen items-center py-3 gap-2 select-none transition-all duration-300 z-20">
        {/* Toggle back open */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:shadow-sm transition-all duration-300"
          title="Tampilkan sidebar"
        >
          {icons.expand}
        </button>

        <div className="w-8 border-t border-brown-900/10 my-1" />

        {/* New chat */}
        <button
          type="button"
          onClick={() => { setActiveSection("chat"); onNewChat(); }}
          className="p-2 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 transition-all duration-300"
          title="Percakapan Baru"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Section icons */}
        {NAV_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            title={s.label}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isActive(s.id)
                ? "bg-brown-900/8 text-brown-900"
                : "text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80"
            }`}
          >
            {icons[s.iconKey]}
          </button>
        ))}

        {/* Chat icon */}
        <button
          type="button"
          onClick={() => setActiveSection("chat")}
          title="Riwayat Percakapan"
          className={`p-2 rounded-xl transition-all duration-300 ${
            isActive("chat")
              ? "bg-brown-900/8 text-brown-900"
              : "text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80"
          }`}
        >
          {icons.chat}
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-72 md:w-64 lg:w-68 shrink-0 bg-[#FAF7F2] border-r border-brown-900/10 h-screen select-none transition-all duration-300 z-20">
      {/* ── 1. Top Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-brown-900/8 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group"
          title="Kembali ke Dashboard ZYBA"
        >
          <span className="text-sm text-brown-700/60 group-hover:text-brown-900 group-hover:-translate-x-0.5 transition-transform">
            ←
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base text-brown-900 tracking-tight">
              Zyba Companion
            </span>
          </div>
        </Link>

        {/* Hide sidebar button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="text-brown-700/40 hover:text-brown-900 p-1 rounded-md hover:bg-brown-900/5 transition-colors"
          title="Hide sidebar"
          aria-label="Hide sidebar"
        >
          {icons.collapse}
        </button>
      </div>

      {/* ── 2. New Chat Button ──────────────────────────────────────────── */}
      <div className="p-3 pb-1.5 shrink-0 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => { setActiveSection("chat"); onNewChat(); }}
          className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-900/10 text-brown-900 text-xs font-bold hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 shadow-2xs active:scale-[0.99] flex items-center gap-2.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Percakapan Baru</span>
        </button>

        {/* ── Character Banner / Selector ─────────────────────────────── */}
        <button
          type="button"
          onClick={() => setShowPersonaModal(true)}
          className="w-full py-2 px-3 rounded-xl bg-cream/70 hover:bg-orange-100/70 border border-orange-500/20 text-brown-900 text-xs font-bold transition-all duration-200 flex items-center justify-between group shadow-2xs"
          title="Klik untuk memilih karakter Zyba"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{currentPersona.emoji}</span>
            <div className="text-left truncate">
              <span className="text-xs font-extrabold text-brown-900 block truncate">
                {currentPersona.name}
              </span>
              <span className="text-[10px] text-brown-700/70 font-normal block truncate">
                {currentPersona.label.split("—")[1]?.trim() || "Pendamping"}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-orange-600 bg-white/90 px-2 py-0.5 rounded-full font-bold shadow-2xs group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
            Ganti
          </span>
        </button>
      </div>

      {/* ── 3. Section Nav: Projects, Artifacts, Code, Customize ─────────── */}
      <nav className="px-2 pb-2 space-y-0.5 shrink-0">
        {NAV_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() =>
              s.id === "customize"
                ? (setActiveSection("customize"), setShowSettingsModal(true))
                : setActiveSection(s.id)
            }
            className={`${navItemClass(isActive(s.id))} justify-between`}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-brown-700/70">{icons[s.iconKey]}</span>
              <span>{s.label}</span>
            </div>
            {s.badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                {s.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── 4. Riwayat Percakapan Section Header ─────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between shrink-0 border-t border-brown-900/6">
        <button
          type="button"
          onClick={() => setActiveSection("chat")}
          className={`text-[11px] font-semibold transition-colors ${
            isActive("chat") ? "text-brown-900" : "text-brown-700/50 hover:text-brown-900"
          }`}
        >
          Riwayat Percakapan
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="text-brown-700/40 hover:text-brown-900 p-1 rounded transition-colors"
            title="Search chats"
          >
            {icons.search}
          </button>
          <button
            type="button"
            className="text-brown-700/40 hover:text-brown-900 p-1 rounded transition-colors"
            title="Sort options"
          >
            {icons.sort}
          </button>
        </div>
      </div>

      {/* Search Input */}
      {showSearchInput && (
        <div className="px-3 py-1.5 shrink-0 animate-in fade-in duration-150">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan..."
            autoFocus
            className="w-full bg-white rounded-lg px-2.5 py-1.5 text-xs text-brown-900 placeholder:text-brown-700/40 border border-brown-900/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      )}

      {/* ── 5. Conversation List ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {filtered.length === 0 ? (
          <p className="text-[11px] text-brown-700/40 px-3 py-4 text-center">
            {searchQuery ? "Tidak ditemukan" : "Belum ada riwayat"}
          </p>
        ) : (
          filtered.map((conv) => {
            const active = conv.id === activeConvId && isActive("chat");
            const moodColor = MOOD_COLORS[conv.emotionTag] || "bg-brown-900/30";
            return (
              <div
                key={conv.id}
                className={`w-full flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-brown-900/8 text-brown-900 font-semibold"
                    : "text-brown-700 hover:bg-cream/60 hover:text-brown-900"
                }`}
              >
                <button
                  type="button"
                  onClick={() => { setActiveSection("chat"); onSelectConv(conv.id); }}
                  className="flex-1 flex items-center gap-2 text-left truncate min-w-0"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${moodColor} shrink-0 opacity-70 group-hover:opacity-100`} />
                  <span className="truncate text-xs">{conv.title}</span>
                </button>

                {/* Delete button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConvIdToDelete(conv.id);
                    setShowDeleteModal(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-brown-700/40 hover:text-danger hover:bg-danger/10 rounded-md transition-all shrink-0"
                  title="Hapus percakapan"
                  aria-label={`Hapus ${conv.title}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── 6. Bottom User Bar ───────────────────────────────────────────── */}
      <div className="p-3 border-t border-brown-900/8 bg-[#FAF7F2] shrink-0 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowProModal(true)}
          className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:-translate-y-0.5 p-1.5 rounded-xl transition-all duration-300 min-w-0"
        >
          <div className="w-6 h-6 rounded-full bg-brown-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            {displayInitial}
          </div>
          <div className="text-left truncate">
            <span className="text-xs font-bold text-brown-900 block truncate">{displayName} · Free</span>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brown-700/40 shrink-0">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className="flex items-center gap-1 text-brown-700/40">
          <button
            type="button"
            onClick={() => setShowProModal(true)}
            className="p-1.5 hover:text-brown-900 hover:bg-brown-900/5 rounded-lg transition-colors"
            title="Download desktop app"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 hover:text-brown-900 hover:bg-brown-900/5 rounded-lg transition-colors"
            title="Settings"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
