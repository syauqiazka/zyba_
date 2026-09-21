"use client";

import React, { useState } from "react";
import { useCommunity, CommunityMessage } from "../context/CommunityContext";

export default function CommunityMessagesView() {
  const { messages } = useCommunity();
  const [activeMsg, setActiveMsg] = useState<CommunityMessage | null>(messages[0] || null);
  const [chatLog, setChatLog] = useState<{ sender: "user" | "peer"; text: string; time: string }[]>([
    { sender: "peer", text: "Halo Alex! Selamat datang di Zyba Peer Support.", time: "10:28" },
    { sender: "user", text: "Terima kasih banyak Sarah, senang bisa saling dukung di sini.", time: "10:29" },
    { sender: "peer", text: "Kapan pun butuh teman ngobrol atau sharing seputar latihan napas, kabari ya!", time: "10:30" },
  ]);
  const [replyText, setReplyText] = useState("");

  const handleSend = () => {
    if (!replyText.trim()) return;
    setChatLog([...chatLog, { sender: "user", text: replyText.trim(), time: "Baru saja" }]);
    setReplyText("");
  };

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 px-2 h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-200">
      {/* Messages List Column */}
      <div className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-brown-900/10 p-3 flex flex-col shadow-2xs">
        <h2 className="font-bold text-sm text-brown-900 px-2 py-1 mb-2">
          Messages
        </h2>
        <div className="flex-1 overflow-y-auto space-y-1">
          {messages.map((m) => {
            const isSelected = activeMsg?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMsg(m)}
                className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all ${
                  isSelected ? "bg-brown-900/8 font-bold" : "hover:bg-brown-900/5 text-brown-700"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-cream border border-brown-900/10 flex items-center justify-center font-bold text-xs text-brown-900 shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brown-900 truncate">{m.user}</p>
                    <span className="text-[10px] text-brown-700/50">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-brown-700/70 truncate">{m.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Column */}
      <div className="flex-1 bg-white rounded-2xl border border-brown-900/10 flex flex-col shadow-2xs overflow-hidden">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-brown-900/6 flex items-center justify-between bg-cream/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600">
              {activeMsg?.avatar || "U"}
            </div>
            <div>
              <p className="text-xs font-bold text-brown-900">{activeMsg?.user}</p>
              <p className="text-[10px] text-green-600 font-medium">● Online di Komunitas</p>
            </div>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatLog.map((chat, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${chat.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  chat.sender === "user"
                    ? "bg-brown-900 text-white rounded-br-xs"
                    : "bg-[#FAF7F2] text-brown-900 border border-brown-900/8 rounded-bl-xs"
                }`}
              >
                {chat.text}
              </div>
              <span className="text-[9px] text-brown-700/40 mt-0.5 px-1">{chat.time}</span>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <div className="p-3 border-t border-brown-900/6 flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tulis pesan..."
            className="flex-1 bg-[#FAF7F2] rounded-full px-4 py-2 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!replyText.trim()}
            className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold hover:bg-orange-600 disabled:opacity-30 transition-all shadow-xs"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
