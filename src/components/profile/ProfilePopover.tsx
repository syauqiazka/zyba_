"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Settings,
  LogOut,
  Sparkles,
  Flame,
  Award,
  Calendar,
  MessageCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  Heart,
  Smile,
} from "lucide-react";
import { isAvatarUrl } from "@/lib/avatarUtils";
import UserAvatar from "@/components/ui/UserAvatar";

export interface ProfileUser {
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  plan?: "FREE" | "PLUS";
  handle?: string;
  statusText?: string;
  customStatus?: string;
  streak?: number;
  zybaScore?: number | null;
  createdAt?: string;
}

interface ProfilePopoverProps {
  user: ProfileUser;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: (tab?: string) => void;
  onLogout: () => void;
}

export default function ProfilePopover({
  user,
  isOpen,
  onClose,
  onOpenSettings,
  onLogout,
}: ProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [onlineStatus, setOnlineStatus] = useState<"online" | "idle" | "dnd" | "invisible">("online");
  const [customStatus, setCustomStatus] = useState(user.customStatus || user.statusText || "");
  const [isEditingCustomStatus, setIsEditingCustomStatus] = useState(false);
  const [customStatusInput, setCustomStatusInput] = useState(customStatus);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Discord-style personal note (persisted locally)
  const [note, setNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  // Load saved note & status from localStorage
  useEffect(() => {
    try {
      const savedNote = localStorage.getItem("zyba_user_profile_note");
      if (savedNote) {
        setNote(savedNote);
        setNoteInput(savedNote);
      }
      const savedStatus = localStorage.getItem("zyba_user_online_status");
      if (savedStatus && ["online", "idle", "dnd", "invisible"].includes(savedStatus)) {
        setOnlineStatus(savedStatus as any);
      }
      const savedCustomStatus = localStorage.getItem("zyba_user_custom_status");
      if (savedCustomStatus) {
        setCustomStatus(savedCustomStatus);
        setCustomStatusInput(savedCustomStatus);
      }
    } catch {}
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
        setIsEditingCustomStatus(false);
        setIsEditingNote(false);
        setShowStatusMenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStatusSelect = (status: "online" | "idle" | "dnd" | "invisible") => {
    setOnlineStatus(status);
    setShowStatusMenu(false);
    try {
      localStorage.setItem("zyba_user_online_status", status);
      // Notify same-tab components (PostCard, MessagesView)
      window.dispatchEvent(new CustomEvent("zyba_status_change"));
    } catch {}
  };

  const handleSaveCustomStatus = () => {
    const trimmed = customStatusInput.trim() || "when yah";
    setCustomStatus(trimmed);
    setIsEditingCustomStatus(false);
    try {
      localStorage.setItem("zyba_user_custom_status", trimmed);
    } catch {}
  };

  const handleSaveNote = () => {
    setNote(noteInput);
    setIsEditingNote(false);
    try {
      localStorage.setItem("zyba_user_profile_note", noteInput);
    } catch {}
  };

  const statusColors = {
    online: "bg-[#23a55a]",
    idle: "bg-[#f0b232]",
    dnd: "bg-[#f23f43]",
    invisible: "bg-[#80848e]",
  };

  const statusLabels = {
    online: "Aktif",
    idle: "Sedang Istirahat",
    dnd: "Sedang Fokus",
    invisible: "Mode Tenang",
  };

  const handle = user.username || user.handle || (user.email ? user.email.split("@")[0] : "schatz_232");
  const isPro = user.plan === "PLUS";

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-16 left-0 sm:left-2 z-50 w-80 sm:w-84 rounded-3xl bg-[#FAF7F2] text-brown-900 shadow-2xl border border-brown-900/15 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 select-none font-body"
      style={{
        boxShadow: "0 20px 40px -15px rgba(59, 42, 32, 0.25), 0 0 0 1px rgba(59, 42, 32, 0.08)",
      }}
    >
      {/* ── 1. Top Banner (Discord Style with ZYBA Palette) ───────── */}
      <div className="h-24 w-full bg-gradient-to-tr from-[#E67E22] via-[#F2884B] to-[#8FAE5D] relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Top-Right Badge: ZYBA PRO / FREE */}
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
          {isPro ? (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-brown-900 text-white shadow-xs flex items-center gap-1 border border-white/20">
              <Sparkles size={10} className="text-orange-400 fill-orange-400" />
              ZYBA PLUS
            </span>
          ) : (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-brown-900 shadow-xs border border-brown-900/10">
              ZYBA
            </span>
          )}
        </div>
      </div>

      {/* ── 2. Profile Overlap Row (Avatar + Status Speech Bubble) ─ */}
      <div className="px-4 pt-0 pb-3 relative">
        <div className="flex items-end justify-between -mt-13 mb-3">
          {/* Avatar with Discord Border & Edit Overlay */}
          <div
            className="relative group cursor-pointer"
            onClick={() => {
              onClose();
              onOpenSettings("Account");
            }}
            title="Klik untuk edit profil"
          >
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] p-1.5 shadow-lg border-4 border-[#FAF7F2] relative">
              <UserAvatar
                src={user.avatarUrl}
                name={user.name}
                size="lg"
                className="w-full h-full text-3xl"
                showStatus={false}
              />
              {/* Discord-style Hover Edit Overlay */}
              <div className="absolute inset-1.5 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-150">
                <Pencil size={18} className="text-white" />
              </div>
            </div>

            {/* Discord-style Status Icon at 4 o'clock */}
            <div
              className={`absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full border-[3px] border-[#FAF7F2] flex items-center justify-center shadow-xs ${statusColors[onlineStatus]}`}
            >
              {onlineStatus === "dnd" && (
                <div className="w-2 h-0.5 bg-white rounded-full" />
              )}
              {onlineStatus === "idle" && (
                <div className="w-2 h-2 rounded-full border-r border-b border-[#FAF7F2] -rotate-45" />
              )}
              {onlineStatus === "invisible" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FAF7F2]" />
              )}
            </div>
          </div>

          {/* Discord Floating Speech Bubble ("when yah") */}
          <div className="relative mb-1">
            {isEditingCustomStatus ? (
              <div className="flex items-center gap-1 bg-white border border-brown-900/15 rounded-2xl px-2.5 py-1 shadow-sm">
                <input
                  type="text"
                  value={customStatusInput}
                  onChange={(e) => setCustomStatusInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveCustomStatus()}
                  className="bg-transparent text-xs text-brown-900 outline-hidden w-28 font-medium"
                  placeholder="Set status..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveCustomStatus}
                  className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold hover:bg-orange-600 transition-colors"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingCustomStatus(true)}
                title="Klik untuk ubah status"
                className="relative bg-brown-900 text-cream hover:bg-brown-900/90 rounded-2xl px-3 py-1.5 text-xs shadow-md border border-brown-900/10 flex items-center gap-1.5 transition-all group cursor-pointer"
              >
                {/* Speech bubble tail pointing to avatar */}
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-brown-900 rotate-45 rounded-xs" />
                <span className="relative z-10 font-bold truncate max-w-[130px]">{customStatus}</span>
                <Pencil size={11} className="relative z-10 text-cream/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Main Identity Card (Discord Style Box) ─────────────── */}
        <div className="bg-white rounded-2xl p-4 border border-brown-900/10 shadow-xs flex flex-col gap-3">
          {/* Display Name & Username */}
          <div>
            <h3 className="text-lg font-display font-black text-brown-900 leading-tight tracking-tight">
              {user.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-brown-700/80 mt-0.5 flex-wrap">
              <span className="font-semibold text-brown-900">@{handle}</span>
              <span className="text-brown-700/40">•</span>
              <span className="text-brown-700/60 font-medium">Gen Z Wellness</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings("Account");
                }}
                className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-600 font-extrabold px-2 py-0.5 rounded-md hover:bg-orange-200 transition-colors ml-auto cursor-pointer"
              >
                <span>{isPro ? "PRO MEMBER" : "FREE TIER"}</span>
                <ChevronDown size={10} />
              </button>
            </div>
          </div>

          {/* Discord Badges Row */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-brown-900/8 flex-wrap">
            {/* ZYBA Flower Badge */}
            <div
              className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-sm shadow-2xs hover:scale-105 transition-transform cursor-pointer"
              title="Zyba Pioneer Member"
            >
              🌸
            </div>
            {/* Streak Badge */}
            <div
              className="px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold flex items-center gap-1 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
              title={`Streak Check-In: ${user.streak || 1} Hari`}
            >
              <Flame size={13} className="text-orange-500 fill-orange-500" />
              <span>{user.streak || 1}d</span>
            </div>
            {/* Zyba Score Badge */}
            <div
              className="px-2 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center gap-1 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
              title={`Skor Wellness: ${user.zybaScore || 46}`}
            >
              <Award size={13} className="text-green-600" />
              <span>Score {user.zybaScore || 46}</span>
            </div>
            {/* Persona Badge */}
            <div
              className="w-7 h-7 rounded-lg bg-cream border border-brown-900/10 flex items-center justify-center text-sm shadow-2xs hover:scale-105 transition-transform cursor-pointer"
              title="Companion: Kina"
            >
              🦊
            </div>
          </div>

          {/* Discord-style Action Buttons Row */}
          <div className="flex items-center gap-2 pt-1 border-t border-brown-900/8">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings("Account");
              }}
              className="flex-1 bg-brown-900 hover:bg-orange-500 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
            >
              <Pencil size={13} />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings("General");
              }}
              className="w-9 h-9 rounded-xl bg-cream border border-brown-900/10 hover:bg-brown-900/10 text-brown-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Pengaturan Aplikasi"
            >
              <Settings size={15} />
            </button>
          </div>

          {/* Section: Bio / Tentang Saya */}
          <div className="pt-2.5 border-t border-brown-900/8">
            <span className="text-[10px] font-black uppercase text-brown-700/60 tracking-wider block mb-1">
              Bio
            </span>
            {user.bio?.trim() ? (
              <p className="text-xs text-brown-900 font-medium leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="text-xs text-brown-700/50 italic">
                Belum ada bio. Tambahkan lewat Edit Profile.
              </p>
            )}
          </div>

          {/* Section: Member Since (Anggota Sejak) */}
          <div className="pt-2.5 border-t border-brown-900/8 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-brown-700/70">
              <Calendar size={13} />
              <span className="text-[11px] font-bold">Anggota Sejak</span>
            </div>
            <span className="text-xs font-bold text-brown-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Baru Bergabung"}
            </span>
          </div>

          {/* Section: Note (Only visible to you) - Classic Discord Feature! */}
          <div className="pt-2 border-t border-brown-900/8">
            <span className="text-[10px] font-black uppercase text-brown-700/60 tracking-wider block mb-1">
              Catatan (Hanya terlihat olehmu)
            </span>
            {isEditingNote ? (
              <div className="flex flex-col gap-1.5">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Tulis catatan pribadimu di sini..."
                  rows={2}
                  className="w-full text-xs text-brown-900 bg-cream/60 border border-brown-900/15 rounded-xl p-2 outline-hidden focus:ring-1 focus:ring-orange-500 font-medium resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(false)}
                    className="text-[11px] font-bold text-brown-700 hover:text-brown-900 px-2 py-1"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="text-[11px] font-bold bg-brown-900 text-white px-3 py-1 rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingNote(true)}
                className="w-full text-left text-xs text-brown-700/60 hover:text-brown-900 font-medium italic p-1.5 rounded-lg hover:bg-cream/60 transition-colors cursor-pointer"
              >
                {note ? `"${note}"` : "Klik untuk menambahkan catatan..."}
              </button>
            )}
          </div>
        </div>

        {/* ── 4. Quick Status & Logout Dropdown Menu ─────────────────── */}
        <div className="mt-2.5 flex flex-col gap-1">
          {/* Status selector toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-brown-900 hover:bg-white/80 transition-colors cursor-pointer border border-transparent hover:border-brown-900/10"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[onlineStatus]}`} />
                <span>{statusLabels[onlineStatus]}</span>
              </div>
              <ChevronRight
                size={14}
                className={`text-brown-700 transition-transform ${showStatusMenu ? "rotate-90" : ""}`}
              />
            </button>

            {/* Status Options Menu */}
            {showStatusMenu && (
              <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-white border border-brown-900/15 rounded-2xl p-1.5 shadow-xl z-20 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {(["online", "idle", "dnd", "invisible"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusSelect(st)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      onlineStatus === st ? "bg-orange-50 text-orange-600" : "text-brown-900 hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${statusColors[st]}`} />
                      <span>{statusLabels[st]}</span>
                    </div>
                    {onlineStatus === st && <Check size={13} className="text-orange-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} className="text-danger" />
            <span>Keluar (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
