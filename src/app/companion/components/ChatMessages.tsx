"use client";

import React, { useState } from "react";
import { AIModelType } from "@/backend/ai/aiModelManager";
import ModelSelector from "./ModelSelector";
import { useTTS } from "@/hooks/useTTS";
import { formatChatDateSeparator, isSameCalendarDay } from "@/lib/dateUtils";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  flaggedForRisk?: boolean;
  modelUsed?: string;
  time: string;
  createdAt?: string;
}

interface Props {
  messages: Message[];
  isSending: boolean;
  selectedModel: AIModelType;
  setSelectedModel?: (m: AIModelType) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSelectPromptStarter?: (prompt: string) => void;
  onSendMessage?: (text: string) => void;
  chatMode?: "curhat" | "solusi";
  setChatMode?: (mode: "curhat" | "solusi") => void;
  ttsProvider?: "elevenlabs" | "edge";
}

/**
 * 5 Prompt starter chips matching Claude.ai (Image 1):
 * [ Write | Learn | Code | Life stuff | Claude's choice ]
 */
const CLAUDE_PROMPTS = [
  { icon: "✍️", label: "Curhat Bebas", prompt: "Aku ingin curhat tentang hal yang mengganjal di pikiranku hari ini." },
  { icon: "💡", label: "Pahami Emosi", prompt: "Bantu aku memahami kenapa belakangan ini aku mudah merasa lelah dan cemas." },
  { icon: "🎯", label: "Rencana Aksi", prompt: "Berikan aku 3 langkah praktis untuk menghentikan kebiasaan menunda pekerjaan (prokrastinasi)." },
  { icon: "☕", label: "Life stuff", prompt: "Butuh obrolan santai penenang pikiran setelah seharian beraktivitas padat." },
  { icon: "✨", label: "Rekomendasi Zyba", prompt: "Pandu aku melakukan latihan mindfulness relaksasi pernapasan 5 menit sekarang." },
];

export default function ChatMessages({
  messages,
  isSending,
  selectedModel,
  setSelectedModel,
  messagesEndRef,
  onSelectPromptStarter,
  onSendMessage,
  chatMode = "curhat",
  setChatMode,
  ttsProvider = "edge",
}: Props) {
  const [centerInput, setCenterInput] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const { speak, isPlaying, isLoading } = useTTS();

  const handleCenterSubmit = () => {
    if (!centerInput.trim() || isSending) return;
    if (onSendMessage) {
      onSendMessage(centerInput.trim());
      setCenterInput("");
    }
  };

  // 1. EXACT CLAUDE.AI EMPTY STATE (Image 1)
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center text-center">
        {/* Emblem + "You're here!" */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          {/* Orange Starburst Claude/Zyba Emblem */}
          <div className="relative w-6 h-6 flex items-center justify-center text-orange-600 text-2xl font-black select-none">
            ✳
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-brown-900 tracking-tight">
            You&apos;re here!
          </h1>
        </div>

        {/* Floating Center Input Box — Exact Claude.ai card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-brown-900/12 shadow-sm p-4 text-left transition-all focus-within:shadow-md focus-within:border-brown-900/25">
          <textarea
            value={centerInput}
            onChange={(e) => setCenterInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCenterSubmit();
              }
            }}
            placeholder="How can I help you today?"
            rows={2}
            className="w-full bg-transparent text-sm text-brown-900 placeholder:text-brown-700/50 resize-none focus:outline-none leading-relaxed"
          />

          {/* Bottom attached controls row */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-brown-900/6 text-xs text-brown-700">
            {/* Left: "+" button & Mode Toggle [Chat | Cowork] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-brown-900/10 flex items-center justify-center text-brown-700/70 hover:text-brown-900 hover:bg-brown-900/5 transition-colors"
                title="Tambahkan dokumen atau lampiran"
              >
                +
              </button>

              {setChatMode && (
                <div className="flex bg-[#F5EFEB] rounded-full p-0.5 border border-brown-900/8">
                  <button
                    type="button"
                    onClick={() => setChatMode("curhat")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      chatMode === "curhat"
                        ? "bg-white text-brown-900 shadow-2xs"
                        : "text-brown-700/70 hover:text-brown-900"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatMode("solusi")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      chatMode === "solusi"
                        ? "bg-white text-brown-900 shadow-2xs"
                        : "text-brown-700/70 hover:text-brown-900"
                    }`}
                  >
                    Cowork
                  </button>
                </div>
              )}
            </div>

            {/* Right: Model Selector + Mic + Soundwave + Send Button */}
            <div className="flex items-center gap-1.5">
              {setSelectedModel ? (
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
              ) : (
                <span className="text-[11px] font-semibold text-brown-700 px-2 py-1 rounded-lg bg-cream/70">
                  {selectedModel}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsMicActive(!isMicActive)}
                className={`p-1.5 rounded-lg text-sm transition-colors ${
                  isMicActive ? "bg-orange-100 text-orange-600" : "text-brown-700/60 hover:text-brown-900"
                }`}
                title="Voice input"
              >
                🎙️
              </button>

              <button
                type="button"
                onClick={handleCenterSubmit}
                disabled={!centerInput.trim() || isSending}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs hover:bg-orange-600 disabled:opacity-30 transition-all shadow-2xs"
                title="Kirim pesan"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* 5 Prompt Starter Chips (Claude.ai: Write, Learn, Code, Life stuff, Claude's choice) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          {CLAUDE_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (onSelectPromptStarter) onSelectPromptStarter(item.prompt);
                else if (onSendMessage) onSendMessage(item.prompt);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brown-900/10 text-xs font-semibold text-brown-900 hover:bg-cream hover:border-brown-900/25 transition-all shadow-2xs active:scale-95"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. ACTIVE CHAT STREAM
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
      {messages.map((msg, idx) => {
        const isUser = msg.role === "USER";
        const prevMsg = messages[idx - 1];
        const showDateSeparator =
          msg.createdAt &&
          (!prevMsg?.createdAt || !isSameCalendarDay(prevMsg.createdAt, msg.createdAt));

        return (
          <React.Fragment key={msg.id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-2 select-none">
                <span className="bg-cream/90 text-brown-700/70 border border-brown-900/10 text-[11px] font-semibold px-3.5 py-1 rounded-full shadow-2xs">
                  {formatChatDateSeparator(msg.createdAt!)}
                </span>
              </div>
            )}
            <div
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
            <div
              className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Mascot / Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cream border border-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-600 shrink-0 shadow-2xs select-none">
                  ✳
                </div>
              )}

              {/* Message Content */}
              <div
                className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? "bg-brown-900 text-white rounded-br-xs"
                    : "bg-white text-brown-900 border border-brown-900/8 rounded-bl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {/* TTS Speaker Icon — only for AI replies */}
                {!isUser && hoveredMessageId === msg.id && (
                  <button
                    type="button"
                    onClick={() => speak(msg.content, ttsProvider === "elevenlabs")}
                    disabled={isLoading}
                    className="mt-2 p-1.5 rounded-lg border border-brown-900/10 hover:bg-orange-50 hover:border-orange-500/30 transition-colors text-brown-700 hover:text-orange-600 disabled:opacity-50"
                    title={isPlaying ? "Stop audio" : "Play audio"}
                  >
                    {isLoading ? "⏳" : isPlaying ? "⏸️" : "🔊"}
                  </button>
                )}
              </div>
            </div>

            {/* Time / Model footer */}
            <div
              className={`text-[10px] text-brown-700/50 mt-1 px-1 flex items-center gap-2 ${
                isUser ? "text-right" : "text-left pl-11"
              }`}
            >
              <span>{msg.time}</span>
              {!isUser && msg.modelUsed && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[9px]">{msg.modelUsed}</span>
                </>
              )}
            </div>
          </div>
        </React.Fragment>
        );
      })}

      {/* Typing Indicator */}
      {isSending && (
        <div className="flex items-start gap-3 pl-1">
          <div className="w-8 h-8 rounded-xl bg-cream border border-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-600 shrink-0 select-none">
            ✳
          </div>
          <div className="bg-white border border-brown-900/8 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-pulse delay-150" />
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-pulse delay-300" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
