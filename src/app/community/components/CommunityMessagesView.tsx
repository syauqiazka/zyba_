"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCommunity, CommunityMessage } from "../context/CommunityContext";

type ChatEntry = { id: string; sender: "user" | "peer"; text: string; time: string };

const SEED_CHATS: Record<string, ChatEntry[]> = {};

export default function CommunityMessagesView() {
  const { messages } = useCommunity();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, ChatEntry[]>>(SEED_CHATS);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeMsg = messages.find((m) => m.id === activeId) ?? null;
  const activeChatLog = activeId ? (chats[activeId] ?? []) : [];
  const filtered = messages.filter((m) => m.user.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatLog.length]);

  const handleSend = () => {
    if (!input.trim() || !activeId) return;
    const entry: ChatEntry = { id: `msg-${Date.now()}`, sender: "user", text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setChats(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), entry] }));
    setInput("");
  };

  return (
    <div className="w-full h-full flex animate-in fade-in duration-200 bg-white border border-brown-900/10 rounded-2xl overflow-hidden shadow-xs">

      {/* ── Left: conversation list ── */}
      <div className="w-72 shrink-0 border-r border-brown-900/8 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 border-b border-brown-900/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-sm text-brown-900">Pesan</span>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-brown-900/5 flex items-center justify-center text-brown-700" title="Pesan baru">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brown-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." className="w-full bg-cream/60 text-xs text-brown-900 placeholder:text-brown-700/40 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500/30" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brown-900/8 shrink-0">
          {(["messages", "requests"] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === tab ? "text-brown-900 border-b-2 border-brown-900" : "text-brown-700/50 hover:text-brown-900"}`}>
              {tab === "messages" ? "Pesan" : "Permintaan"}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-xs text-brown-700/50 gap-1">
              <span>Tidak ada pesan</span>
            </div>
          )}
          {filtered.map(m => (
            <button key={m.id} type="button" onClick={() => setActiveId(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${activeId === m.id ? "bg-brown-900/5" : "hover:bg-brown-900/3"}`}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {m.avatar || m.user.slice(0,1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brown-900 truncate">{m.user}</span>
                  <span className="text-[10px] text-brown-700/40 shrink-0 ml-1">{m.time}</span>
                </div>
                <p className="text-[11px] text-brown-700/60 truncate mt-0.5">{m.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: conversation or empty state ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeMsg ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full border-2 border-brown-900/20 flex items-center justify-center text-brown-900/30">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brown-900">Pesanmu</h3>
              <p className="text-xs text-brown-700 mt-1">Kirim pesan ke sesama anggota komunitas ZYBA.</p>
            </div>
            <button type="button" onClick={() => messages[0] && setActiveId(messages[0].id)}
              className="bg-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-orange-600 transition-colors">
              Kirim pesan
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-brown-900/8 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {activeMsg.avatar || activeMsg.user.slice(0,1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-brown-900">{activeMsg.user}</p>
                <p className="text-[10px] text-green-600 font-medium">● Aktif di Komunitas</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-brown-700/40">
                <button type="button" title="Profil" className="hover:text-brown-900 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </button>
              </div>
            </div>

            {/* Messages — NO bubbles, just text + time per row */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
              {activeChatLog.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-xs text-brown-700/40">
                  <span>Belum ada pesan. Mulai percakapan!</span>
                </div>
              )}
              {activeChatLog.map(chat => (
                <div key={chat.id} className={`flex flex-col gap-0.5 ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                  {chat.sender === "peer" && (
                    <span className="text-[10px] font-bold text-brown-700 mb-0.5">{activeMsg.user}</span>
                  )}
                  <p className={`text-sm leading-relaxed ${chat.sender === "user" ? "text-brown-900" : "text-brown-800"}`}>
                    {chat.text}
                  </p>
                  <span className="text-[10px] text-brown-700/30">{chat.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-brown-900/8 flex items-center gap-2 shrink-0">
              <button type="button" className="w-8 h-8 rounded-full hover:bg-brown-900/5 flex items-center justify-center text-brown-700/40 hover:text-brown-700" title="Lampiran">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Tulis pesan..."
                className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-700/30 focus:outline-none py-1" />
              {input.trim() ? (
                <button type="button" onClick={handleSend} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors px-1">
                  Kirim
                </button>
              ) : (
                <button type="button" className="w-8 h-8 rounded-full hover:bg-brown-900/5 flex items-center justify-center text-brown-700/40 hover:text-brown-700" title="Emoji">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
