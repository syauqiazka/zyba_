"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDM } from "@/hooks/useDM";
import { MessageCircle, Search, Edit3, Send, Plus, ArrowLeft, ExternalLink } from "lucide-react";
import { formatChatDateSeparator, isSameCalendarDay, formatChatListTime } from "@/lib/dateUtils";

interface TargetUserMeta {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
}

export default function CommunityMessagesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const {
    conversations,
    messages,
    isConnected,
    loadConversations,
    loadMessages,
    subscribeToConversation,
    sendMessage,
    getOrCreateConversation,
  } = useDM();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [targetUserMeta, setTargetUserMeta] = useState<TargetUserMeta | null>(null);
  const [isInitializingTarget, setIsInitializingTarget] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ambil user ID user saat ini untuk identifikasi bubble chat (isMe)
  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.id) {
          setCurrentUserId(data.user.id);
        }
      })
      .catch(() => {});
  }, []);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handler otomatis saat user mengklik "Message" dari profil seseorang (?userId=...)
  useEffect(() => {
    if (!targetUserId) return;

    let isMounted = true;
    setIsInitializingTarget(true);

    // Ambil metadata profil target segera agar header tidak kosong
    fetch(`/api/user/profile/${targetUserId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user && isMounted) {
          setTargetUserMeta({
            id: data.user.id,
            name: data.user.name,
            username: data.user.username,
            avatarUrl: data.user.avatarUrl,
          });
        }
      })
      .catch(() => {});

    // Dapatkan atau buat conversationId lalu langsung buka
    async function startChatWithTarget() {
      try {
        const convId = await getOrCreateConversation(targetUserId!);
        if (convId && isMounted) {
          setActiveConvId(convId);
          await loadConversations();
          loadMessages(convId);
          subscribeToConversation(convId);
          setTimeout(() => inputRef.current?.focus(), 150);
        }
      } catch (err) {
        console.error("Gagal memulai pesan dengan target user:", err);
      } finally {
        if (isMounted) setIsInitializingTarget(false);
      }
    }

    startChatWithTarget();

    return () => {
      isMounted = false;
    };
  }, [targetUserId, getOrCreateConversation, loadConversations, loadMessages, subscribeToConversation]);

  // When active conversation changes, load messages and subscribe
  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      subscribeToConversation(activeConvId);
    }
  }, [activeConvId, loadMessages, subscribeToConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[activeConvId || ""]?.length]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Fallback informasi lawan bicara (dari activeConv atau targetUserMeta)
  const otherUserId = activeConv?.otherUserId || targetUserMeta?.id || targetUserId || "";
  const otherName = activeConv?.otherUserName || targetUserMeta?.name || otherUserId;
  const otherUsername = activeConv?.otherUserUsername || targetUserMeta?.username || null;
  const otherAvatar = activeConv?.otherUserAvatar || targetUserMeta?.avatarUrl || "🦊";

  const activeChatLog = activeConvId ? messages[activeConvId] || [] : [];

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.otherUserName && c.otherUserName.toLowerCase().includes(q)) ||
      (c.otherUserUsername && c.otherUserUsername.toLowerCase().includes(q)) ||
      c.otherUserId.toLowerCase().includes(q) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    const textToSend = input.trim();
    setInput("");
    try {
      await sendMessage(activeConvId, textToSend);
      // Reload daftar obrolan agar lastMessage terupdate
      loadConversations();
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex animate-in fade-in duration-200 bg-white border border-brown-900/10 rounded-2xl overflow-hidden shadow-xs">
      {/* ── Left: conversation list ── */}
      <div className={`w-full md:w-80 shrink-0 border-r border-brown-900/8 flex flex-col ${activeConvId ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-2 border-b border-brown-900/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-sm text-brown-900">Pesan</span>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("dm-search-input");
                el?.focus();
              }}
              className="w-7 h-7 rounded-lg hover:bg-brown-900/5 flex items-center justify-center text-brown-700"
              title="Pesan baru"
            >
              <Edit3 size={15} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brown-700/40" />
            <input
              id="dm-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari percakapan atau username..."
              className="w-full bg-cream/60 text-xs text-brown-900 placeholder:text-brown-700/40 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            />
          </div>
        </div>

        {/* Connection status */}
        {!isConnected && (
          <div className="px-4 py-1.5 bg-orange-100 text-orange-600 text-[10px] font-semibold text-center">
            Menghubungkan kembali...
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-brown-900/8 shrink-0">
          {(["messages", "requests"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === tab
                  ? "text-brown-900 border-b-2 border-brown-900"
                  : "text-brown-700/50 hover:text-brown-900"
              }`}
            >
              {tab === "messages" ? "Pesan" : "Permintaan"}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-1">
          {/* Loading indicator saat inisialisasi user baru dari URL */}
          {isInitializingTarget && !activeConv && (
            <div className="px-4 py-3 flex items-center gap-3 bg-orange-50/60 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-orange-200" />
              <div className="flex-1 min-w-0">
                <div className="h-3 w-24 bg-orange-200 rounded mb-1" />
                <div className="h-2 w-32 bg-orange-100 rounded" />
              </div>
            </div>
          )}

          {filtered.length === 0 && !isInitializingTarget && (
            <div className="flex flex-col items-center justify-center h-40 text-xs text-brown-700/50 gap-2 px-4 text-center">
              <MessageCircle size={28} className="opacity-30" />
              <span>Belum ada pesan aktif</span>
              <p className="text-[11px] text-brown-700/40">
                Pilih profil teman di komunitas dan klik &quot;Message&quot; untuk mulai mengobrol.
              </p>
            </div>
          )}

          {filtered.map((c) => {
            const displayName = c.otherUserName || c.otherUserUsername || c.otherUserId;
            const initials = (c.otherUserName || c.otherUserId).slice(0, 2).toUpperCase();

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveConvId(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-brown-900/4 ${
                  activeConvId === c.id ? "bg-orange-50/60 border-l-4 border-l-orange-500" : "hover:bg-cream/40"
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brown-900 truncate">
                      {displayName}
                    </span>
                    {c.lastMessageAt && (
                      <span className="text-[10px] text-brown-700/50 shrink-0 ml-1 font-medium">
                        {formatChatListTime(c.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  {c.otherUserUsername && (
                    <p className="text-[10px] text-brown-700/50 truncate">@{c.otherUserUsername}</p>
                  )}
                  <p className="text-[11px] text-brown-700/70 truncate mt-0.5">
                    {c.lastMessage || "Mulai obrolan baru"}
                  </p>
                  {c.unreadCount > 0 && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: conversation or empty state ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${!activeConvId ? "hidden md:flex" : "flex"}`}>
        {!activeConvId ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center text-orange-400">
              <MessageCircle size={36} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brown-900">Pesan Komunitas</h3>
              <p className="text-xs text-brown-700 mt-1 max-w-sm">
                Pilih percakapan di sebelah kiri atau buka profil teman di Zyba Community lalu tekan tombol &quot;Message&quot;.
              </p>
            </div>
            <Link
              href="/community"
              className="bg-brown-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-orange-500 transition-colors inline-flex items-center gap-1.5"
            >
              Jelajahi Komunitas →
            </Link>
          </div>
        ) : (
          <>
            {/* Header Percakapan */}
            <div className="px-5 py-3.5 border-b border-brown-900/8 flex items-center justify-between shrink-0 bg-white/80">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  type="button"
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden w-8 h-8 rounded-full hover:bg-brown-900/5 flex items-center justify-center text-brown-700"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {otherName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-brown-900">{otherName}</p>
                    {otherUsername && (
                      <span className="text-xs text-brown-700/50">@{otherUsername}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Anggota Komunitas ZYBA
                  </p>
                </div>
              </div>

              {otherUserId && (
                <Link
                  href={`/community/profile/${otherUserId}`}
                  className="text-xs font-semibold text-brown-700 hover:text-orange-500 flex items-center gap-1 px-3 py-1.5 rounded-full border border-brown-900/10 hover:border-orange-500/40 transition-colors"
                >
                  <span>Lihat Profil</span>
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-cream/20">
              {activeChatLog.length === 0 && (
                <div className="flex flex-col items-center justify-center my-auto gap-2 text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <MessageCircle size={22} />
                  </div>
                  <p className="text-xs font-bold text-brown-900">
                    Mulai percakapan dengan {otherName}
                  </p>
                  <p className="text-[11px] text-brown-700/60 max-w-xs">
                    Ruang obrolan langsung yang aman, privat, dan suportif sesama anggota ZYBA.
                  </p>
                </div>
              )}

              {(() => {
                const firstUnreadIndex = activeChatLog.findIndex(
                  (m) => currentUserId && m.senderId !== currentUserId && !m.readAt
                );

                return activeChatLog.map((msg, idx) => {
                  const isMe = currentUserId ? msg.senderId === currentUserId : false;
                  const prevMsg = activeChatLog[idx - 1];
                  const showDateSeparator =
                    !prevMsg || !isSameCalendarDay(prevMsg.createdAt, msg.createdAt);
                  const showUnreadSeparator = idx === firstUnreadIndex;

                  return (
                    <React.Fragment key={msg.id}>
                      {/* Daily Date Separator */}
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-3 select-none">
                          <span className="bg-cream/90 text-brown-700/70 border border-brown-900/10 text-[11px] font-semibold px-3.5 py-1 rounded-full shadow-2xs">
                            {formatChatDateSeparator(msg.createdAt)}
                          </span>
                        </div>
                      )}

                      {/* Unread Message Separator */}
                      {showUnreadSeparator && (
                        <div className="flex items-center gap-3 my-3 select-none">
                          <div className="flex-1 h-[1px] bg-orange-400/50" />
                          <span className="bg-orange-100 text-orange-700 border border-orange-300 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                            Pesan Belum Dibaca
                          </span>
                          <div className="flex-1 h-[1px] bg-orange-400/50" />
                        </div>
                      )}

                      {/* Chat Bubble */}
                      <div
                        className={`flex flex-col gap-1 max-w-[75%] ${
                          isMe ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        {!isMe && (
                          <span className="text-[10px] font-bold text-brown-700/70 ml-1">
                            {otherName}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed break-words shadow-2xs ${
                            isMe
                              ? "bg-brown-900 text-white rounded-br-xs"
                              : "bg-white border border-brown-900/10 text-brown-900 rounded-bl-xs"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-brown-700/40 px-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMe && (
                            <span
                              className={`font-bold ${
                                msg.readAt ? "text-orange-500" : "text-brown-700/40"
                              }`}
                              title={msg.readAt ? "Dibaca" : "Terkirim"}
                            >
                              {msg.readAt ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                });
              })()}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="px-4 py-3 border-t border-brown-900/8 flex items-center gap-2 shrink-0 bg-white">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={`Tulis pesan ke ${otherName}...`}
                className="flex-1 bg-cream/40 border border-brown-900/10 text-xs text-brown-900 placeholder:text-brown-700/40 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/40"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-orange-500 text-white disabled:opacity-40 hover:bg-orange-600 flex items-center justify-center transition-colors shrink-0"
                title="Kirim pesan"
              >
                <Send size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
