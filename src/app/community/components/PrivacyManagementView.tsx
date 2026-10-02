  "use client";

import React, { useState, useEffect } from "react";
import { useCommunity } from "../context/CommunityContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserEntry {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

// ─── Helper: resolve user display info from API ───────────────────────────────
async function fetchUserInfo(userId: string): Promise<UserEntry> {
  try {
    const res = await fetch(`/api/community/users/${encodeURIComponent(userId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const d = await res.json();
      return {
        id: userId,
        name: d.user?.name || userId,
        avatarUrl: d.user?.avatarUrl || null,
        bio: d.user?.bio || null,
      };
    }
  } catch {}
  return { id: userId, name: userId, avatarUrl: null, bio: null };
}

// ─── Avatar mini ──────────────────────────────────────────────────────────────
function MiniAvatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const colors = [
    "bg-orange-200 text-orange-900",
    "bg-green-200 text-green-900",
    "bg-amber-200 text-amber-900",
    "bg-purple-200 text-purple-900",
    "bg-sky-200 text-sky-900",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-brown-900/10"
      />
    );
  }
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${color}`}
    >
      {initials || "?"}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = "blocked" | "muted";

// ─── Main component ───────────────────────────────────────────────────────────
export default function PrivacyManagementView() {
  const {
    mutedUserIds,
    blockedUserIds,
    handleUnmuteUser,
    handleUnblockUser,
  } = useCommunity();

  const [tab, setTab] = useState<Tab>("blocked");
  const [mutedUsers, setMutedUsers] = useState<UserEntry[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<UserEntry[]>([]);
  const [loadingMuted, setLoadingMuted] = useState(false);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [confirmUnblock, setConfirmUnblock] = useState<string | null>(null);
  const [confirmUnmute, setConfirmUnmute] = useState<string | null>(null);

  // Resolve user info for blocked list
  useEffect(() => {
    if (blockedUserIds.length === 0) {
      setBlockedUsers([]);
      return;
    }
    setLoadingBlocked(true);
    Promise.all(blockedUserIds.map(fetchUserInfo))
      .then(setBlockedUsers)
      .finally(() => setLoadingBlocked(false));
  }, [blockedUserIds]);

  // Resolve user info for muted list
  useEffect(() => {
    if (mutedUserIds.length === 0) {
      setMutedUsers([]);
      return;
    }
    setLoadingMuted(true);
    Promise.all(mutedUserIds.map(fetchUserInfo))
      .then(setMutedUsers)
      .finally(() => setLoadingMuted(false));
  }, [mutedUserIds]);

  const activeList = tab === "blocked" ? blockedUsers : mutedUsers;
  const isLoading = tab === "blocked" ? loadingBlocked : loadingMuted;

  const handleUnblock = (userId: string) => {
    handleUnblockUser(userId);
    setConfirmUnblock(null);
  };

  const handleUnmute = (userId: string) => {
    handleUnmuteUser(userId);
    setConfirmUnmute(null);
  };

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center py-6 px-4">
      <div className="w-full max-w-[600px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-lg text-brown-900 tracking-tight">
            Privasi &amp; Akun
          </h1>
          <p className="text-xs text-brown-700/60 mt-1">
            Kelola akun yang kamu bisukan atau blokir di Zyba Community.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-brown-900/6 rounded-xl mb-5">
          {(
            [
              {
                key: "blocked" as Tab,
                label: "Diblokir",
                count: blockedUserIds.length,
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                ),
              },
              {
                key: "muted" as Tab,
                label: "Dibisukan",
                count: mutedUserIds.length,
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                ),
              },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                tab === t.key
                  ? "bg-white text-brown-900 shadow-sm"
                  : "text-brown-700/60 hover:text-brown-900"
              }`}
            >
              {t.icon}
              {t.label}
              {t.count > 0 && (
                <span
                  className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    tab === t.key
                      ? "bg-orange-500 text-white"
                      : "bg-brown-900/12 text-brown-700"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info banner for blocked tab */}
        {tab === "blocked" && (
          <div className="mb-4 bg-orange-50 border border-orange-200/60 rounded-xl px-4 py-3 flex gap-3 items-start">
            <svg className="shrink-0 mt-0.5 text-orange-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-orange-800 leading-relaxed">
              Akun yang diblokir tidak bisa melihat postinganmu, mengirim pesan, atau berinteraksi denganmu di komunitas.
            </p>
          </div>
        )}

        {tab === "muted" && (
          <div className="mb-4 bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 flex gap-3 items-start">
            <svg className="shrink-0 mt-0.5 text-amber-600" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              Postingan dari akun yang dibisukan tidak muncul di feed kamu, tapi mereka tetap bisa berinteraksi denganmu.
            </p>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden">
          {isLoading ? (
            // Skeleton
            <div className="divide-y divide-brown-900/6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-brown-900/8 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-brown-900/8 rounded" />
                    <div className="h-2.5 w-48 bg-brown-900/5 rounded" />
                  </div>
                  <div className="h-7 w-20 bg-brown-900/6 rounded-full" />
                </div>
              ))}
            </div>
          ) : activeList.length === 0 ? (
            // Empty state
            <div className="py-16 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center mb-3 shadow-xs">
                {tab === "blocked" ? (
                  <svg className="w-7 h-7 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-sm text-brown-900 mb-1">
                {tab === "blocked"
                  ? "Tidak ada akun yang diblokir"
                  : "Tidak ada akun yang dibisukan"}
              </h3>
              <p className="text-xs text-brown-700/60 max-w-xs leading-relaxed">
                {tab === "blocked"
                  ? "Ketika kamu memblokir seseorang, namanya akan muncul di sini."
                  : "Ketika kamu membisukan seseorang, namanya akan muncul di sini."}
              </p>
            </div>
          ) : (
            // User list
            <div className="divide-y divide-brown-900/6">
              {activeList.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-brown-900/[0.02] transition-colors"
                >
                  <MiniAvatar name={user.name} src={user.avatarUrl} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown-900 truncate">
                      {user.name}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-brown-700/60 truncate mt-0.5">
                        {user.bio}
                      </p>
                    )}
                    <p className="text-[10px] text-brown-700/40 mt-0.5 font-mono">
                      @{user.id}
                    </p>
                  </div>

                  {/* Action button */}
                  {tab === "blocked" ? (
                    confirmUnblock === user.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setConfirmUnblock(null)}
                          className="text-xs text-brown-700/60 hover:text-brown-900 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUnblock(user.id)}
                          className="text-xs font-semibold bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
                        >
                          Ya, buka blokir
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmUnblock(user.id)}
                        className="shrink-0 text-xs font-semibold text-danger border border-danger/30 px-3 py-1.5 rounded-full hover:bg-danger/8 transition-colors"
                      >
                        Diblokir
                      </button>
                    )
                  ) : confirmUnmute === user.id ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setConfirmUnmute(null)}
                        className="text-xs text-brown-700/60 hover:text-brown-900 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnmute(user.id)}
                        className="text-xs font-semibold bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
                      >
                        Ya, batalkan bisukan
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmUnmute(user.id)}
                      className="shrink-0 text-xs font-semibold text-amber-700 border border-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors"
                    >
                      Dibisukan
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        {activeList.length > 0 && (
          <p className="text-center text-[11px] text-brown-700/40 mt-4 leading-relaxed">
            {tab === "blocked"
              ? `${blockedUserIds.length} akun diblokir · Klik "Diblokir" untuk membuka blokir`
              : `${mutedUserIds.length} akun dibisukan · Klik "Dibisukan" untuk membatalkan bisukan`}
          </p>
        )}
      </div>
    </div>
  );
}
