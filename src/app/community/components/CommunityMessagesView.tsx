"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDM } from "@/hooks/useDM";
import { MessageCircle, Search, Edit3, Send, Plus } from "lucide-react";

export default function CommunityMessagesView() {
  const {
    conversations,
    messages,
    isConnected,
    loadConversations,
    loadMessages,
    subscribeToConversation,
    sendMessage,
  } = useDM();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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
  const activeChatLog = activeConvId ? (messages[activeConvId] || []) : [];
  const filtered = conversations.filter((c) =>
    c.otherUserId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    try {
      await sendMessage(activeConvId, input.trim());
      setInput("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="w-full h-full flex animate-in fade-in duration-200 bg-white border border-brown-900/10 rounded-2xl overflow-hidden shadow-xs">
      {/* ── Left: conversation list ── */}
      <div className="w-72 shrink-0 border-r border-brown-900/8 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 border-b border-brown-900/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-sm text-brown-900">Pesan</span>
            <button
              type="button"
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="w-full bg-cream/60 text-xs text-brown-900 placeholder:text-brown-700/40 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            />
          </div>
        </div>

        {/* Connection status */}
        {!isConnected && (
          <div className="px-4 py-1.5 bg-orange-100 text-orange-600 text-[10px] font-semibold text-center">
            Reconnecting...
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
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-xs text-brown-700/50 gap-1">
              <MessageCircle size={24} className="opacity-30" />
              <span>Tidak ada pesan</span>
            </div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveConvId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                activeConvId === c.id ? "bg-brown-900/5" : "hover:bg-brown-900/3"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {c.otherUserId.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brown-900 truncate">
                    {c.otherUserId}
                  </span>
                  <span className="text-[10px] text-brown-700/40 shrink-0 ml-1">
                    {new Date(c.lastMessageAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-[11px] text-brown-700/60 truncate mt-0.5">{c.lastMessage}</p>
                {c.unreadCount > 0 && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: conversation or empty state ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConv ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full border-2 border-brown-900/20 flex items-center justify-center text-brown-900/30">
              <MessageCircle size={36} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brown-900">Pesanmu</h3>
              <p className="text-xs text-brown-700 mt-1">
                Kirim pesan ke sesama anggota komunitas ZYBA.
              </p>
            </div>
            <button
              type="button"
              onClick={() => conversations[0] && setActiveConvId(conversations[0].id)}
              className="bg-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Kirim pesan
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-brown-900/8 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {activeConv.otherUserId.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-brown-900">{activeConv.otherUserId}</p>
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Aktif di Komunitas
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
              {activeChatLog.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-xs text-brown-700/40">
                  <span>Belum ada pesan. Mulai percakapan!</span>
                </div>
              )}
              {activeChatLog.map((msg) => {
                // TODO: get current userId from session
                const isMe = false; // placeholder
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}
                  >
                    {!isMe && (
                      <span className="text-[10px] font-bold text-brown-700 mb-0.5">
                        {activeConv.otherUserId}
                      </span>
                    )}
                    <p
                      className={`text-sm leading-relaxed ${
                        isMe ? "text-brown-900" : "text-brown-800"
                      }`}
                    >
                      {msg.content}
                    </p>
                    <span className="text-[10px] text-brown-700/30">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-brown-900/8 flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-brown-900/5 flex items-center justify-center text-brown-700/40 hover:text-brown-700"
                title="Lampiran"
              >
                <Plus size={16} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Tulis pesan..."
                className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-700/30 focus:outline-none py-1"
              />
              {input.trim() ? (
                <button
                  type="button"
                  onClick={handleSend}
                  className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center transition-colors"
                  title="Kirim"
                >
                  <Send size={14} />
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
