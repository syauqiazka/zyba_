"use client";

import React, { useState, useEffect, useRef } from "react";

export interface ProfileUser {
  name: string;
  email: string;
  avatarUrl?: string;
  plan?: "FREE" | "PLUS";
  handle?: string;
  statusText?: string;
  customStatus?: string;
  streak?: number;
  zybaScore?: number | null;
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
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [customStatus, setCustomStatus] = useState(user.customStatus || "when yah");
  const [isEditingCustomStatus, setIsEditingCustomStatus] = useState(false);
  const [customStatusInput, setCustomStatusInput] = useState(customStatus);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
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
  };

  const handleSaveCustomStatus = () => {
    if (customStatusInput.trim()) {
      setCustomStatus(customStatusInput.trim());
    }
    setIsEditingCustomStatus(false);
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

  const handle = user.handle || user.email.split("@")[0] || "schatz_232";

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-16 left-2 z-50 w-76 sm:w-80 rounded-3xl bg-[#FAF7F2] text-brown-900 shadow-2xl border border-brown-900/15 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="h-16 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 relative">
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-brown-900 shadow-2xs">
            ZYBA
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-0 relative">
        <div className="flex items-end justify-between -mt-9 mb-3">
          <div className="relative group">
            <div className="w-18 h-18 rounded-full bg-cream p-1 shadow-lg flex items-center justify-center border-4 border-[#FAF7F2]">
              <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-3xl overflow-hidden font-display font-bold text-white shadow-inner">
                {user.avatarUrl && user.avatarUrl.length <= 4 ? (
                  <span>{user.avatarUrl}</span>
                ) : (
                  <span>{user.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>

            <div
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#FAF7F2] ${statusColors[onlineStatus]}`}
            />
          </div>

          <div className="relative -mt-2">
            {isEditingCustomStatus ? (
              <div className="flex items-center gap-1 bg-white border border-brown-900/15 rounded-xl px-2 py-1 shadow-sm">
                <input
                  type="text"
                  value={customStatusInput}
                  onChange={(e) => setCustomStatusInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveCustomStatus()}
                  className="bg-transparent text-xs text-brown-900 outline-hidden w-24"
                  placeholder="Set status..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveCustomStatus}
                  className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-md hover:bg-orange-600 font-bold"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingCustomStatus(true)}
                title="Klik untuk ubah status"
                className="bg-white hover:bg-cream border border-brown-900/15 text-brown-900 rounded-2xl px-3 py-1 text-xs shadow-xs flex items-center gap-1.5 transition-colors group cursor-pointer"
              >
                <span className="truncate max-w-[120px] font-semibold">{customStatus}</span>
                <span className="text-[10px] text-brown-700/60 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-brown-900/10 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-extrabold text-brown-900 leading-tight flex items-center gap-1.5">
                {user.name}
              </h3>
              <p className="text-xs text-brown-700/80 font-medium flex items-center gap-1 mt-0.5">
                <span>@{handle}</span>
                <span className="text-[9px] bg-orange-100 text-orange-600 font-extrabold px-1.5 py-0.2 rounded-full">
                  PRO
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-brown-900/10 pt-2 text-xs text-brown-900 flex items-center gap-2">
            <span className="text-base">🎵</span>
            <div className="truncate">
              <span className="text-brown-700/70 text-[10px] block font-bold uppercase tracking-wider">
                Mendengarkan
              </span>
              <span className="text-xs text-brown-900 font-semibold truncate block">
                {user.statusText || "HIVI-jatuh cinta lagi"}
              </span>
            </div>
          </div>

          <div className="border-t border-brown-900/10 pt-2 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-brown-700/70 tracking-wider">
              Wellness Badges
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-orange-50 border border-orange-200 rounded-lg px-2 py-0.5 text-orange-600 font-bold flex items-center gap-1 shadow-2xs">
                🔥 {user.streak || 1}d
              </span>
              {user.zybaScore && (
                <span className="text-xs bg-green-50 border border-green-200 rounded-lg px-2 py-0.5 text-green-700 font-bold shadow-2xs">
                  Score {user.zybaScore}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings("Account");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-brown-900 hover:bg-cream transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Profile</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-brown-900 hover:bg-cream transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusColors[onlineStatus]}`} />
                <span>{statusLabels[onlineStatus]}</span>
              </div>
              <svg className={`w-3.5 h-3.5 text-brown-700 transition-transform ${showStatusMenu ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {showStatusMenu && (
              <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-brown-900/15 rounded-2xl p-1 shadow-xl z-20 flex flex-col gap-0.5">
                {(["online", "idle", "dnd", "invisible"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusSelect(st)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brown-900 hover:bg-cream text-left transition-colors cursor-pointer"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[st]}`} />
                    <span>{statusLabels[st]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
