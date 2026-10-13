"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PanelLeftClose,
  PanelLeft,
  FolderKanban,
  FileText,
  Code,
  Sliders,
  MessageSquare,
  Search,
  ArrowUpDown,
  Plus,
  X,
  Trash2,
  ChevronDown,
  Download,
  Settings,
  ArrowLeft,
} from "lucide-react";
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
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  onClose?: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  Tenang: "bg-mood-neutral",
  Bahagia: "bg-mood-happy",
  Sedih: "bg-mood-sad",
  Overjoyed: "bg-mood-overjoyed",
  Tekanan: "bg-mood-depressed",
};

export default function CompanionSidebar({
  conversations,
  activeConvId,
  onSelectConv,
  onNewChat,
  sidebarVisible,
  onToggleSidebar,
  onClose,
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

  const isActive = (sec: CompanionSection) => {
    const slug = SECTION_TO_SLUG[sec];
    if (!slug) {
      return (
        pathname === "/companion" ||
        pathname === "/companion/" ||
        (!Object.values(SECTION_TO_SLUG)
          .filter(Boolean)
          .some((s) => pathname.startsWith(`/companion/${s}`)) &&
          pathname.startsWith("/companion"))
      );
    }
    return pathname.startsWith(`/companion/${slug}`);
  };

  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 text-left
     ${
       active
         ? "bg-brown-900/8 text-brown-900 font-bold"
         : "text-brown-700 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:text-brown-900 hover:shadow-sm"
     }`;

  const displayName = (() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.name) return parsed.name;
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
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="p-2 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:shadow-sm transition-all duration-300"
          title="Kembali ke Dashboard ZYBA"
        >
          <Home size={16} />
        </Link>

        {/* Toggle back open */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:shadow-sm transition-all duration-300"
          title="Buka bilah sisi"
        >
          <PanelLeft size={16} />
        </button>

        <div className="w-8 border-t border-brown-900/10 my-1" />

        {/* New chat */}
        <button
          type="button"
          onClick={() => { setActiveSection("chat"); onNewChat(); }}
          className="p-2 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 transition-all duration-300"
          title="Percakapan Baru"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>

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
          <MessageSquare size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-[82vw] max-w-[290px] md:w-64 lg:w-72 shrink-0 bg-[#FAF7F2] border-r border-brown-900/10 h-screen select-none transition-all duration-300 z-60">
      {/* ── 1. Top Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-brown-900/8 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group"
          title="Kembali ke Dashboard ZYBA"
        >
          <ArrowLeft size={16} className="text-brown-700/60 group-hover:text-brown-900 group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base text-brown-900 tracking-tight">
              Tanya Zyba
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 active:scale-95 flex items-center justify-center text-brown-700 transition-colors"
              title="Tutup menu"
              aria-label="Tutup menu"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          )}
          {/* Hide sidebar button (desktop) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:flex text-brown-700/40 hover:text-brown-900 p-1 rounded-md hover:bg-brown-900/5 transition-colors"
            title="Sembunyikan bilah sisi"
            aria-label="Sembunyikan bilah sisi"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
      </div>

      {/* ── 2. New Chat Button ──────────────────────────────────────────── */}
      <div className="p-3 pb-1.5 shrink-0 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => { setActiveSection("chat"); onNewChat(); }}
          className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-900/10 text-brown-900 text-xs font-bold hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-green-100/80 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 shadow-2xs active:scale-[0.99] flex items-center gap-2.5"
        >
          <Plus size={15} strokeWidth={2.5} />
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

      {/* ── 3. Riwayat Percakapan Section Header ─────────────────────────── */}
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
            title="Cari percakapan"
          >
            <Search size={13} />
          </button>
          <button
            type="button"
            className="text-brown-700/40 hover:text-brown-900 p-1 rounded transition-colors"
            title="Urutkan"
          >
            <ArrowUpDown size={13} />
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

      {/* ── 4. Conversation List ─────────────────────────────────────────── */}
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
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── 5. Bottom User Bar ───────────────────────────────────────────── */}
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
            <span className="text-xs font-bold text-brown-900 block truncate">{displayName} · Gratis</span>
          </div>
          <ChevronDown size={12} className="text-brown-700/40 shrink-0" />
        </button>

        <div className="flex items-center gap-1 text-brown-700/40">
          <button
            type="button"
            onClick={() => setShowProModal(true)}
            className="p-1.5 hover:text-brown-900 hover:bg-brown-900/5 rounded-lg transition-colors"
            title="Unduh aplikasi"
          >
            <Download size={14} />
          </button>
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 hover:text-brown-900 hover:bg-brown-900/5 rounded-lg transition-colors"
            title="Pengaturan"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
