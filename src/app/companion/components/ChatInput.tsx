"use client";

import { Paperclip, Mic, Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";
import { AIModelType } from "@/backend/ai/aiModelManager";
import { useSTT } from "@/hooks/useSTT";
import { useCompanion } from "../context/CompanionContext";

interface Props {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isVoiceActive?: boolean;
  setIsVoiceActive?: (v: boolean) => void;
  selectedModel: AIModelType;
  setSelectedModel?: (m: AIModelType) => void;
  commStyle?: "CASUAL" | "FORMAL" | "FUN";
  setCommStyle?: (s: "CASUAL" | "FORMAL" | "FUN") => void;
}

export default function ChatInput({
  inputText,
  setInputText,
  handleSendMessage,
  isSending,
  selectedModel,
  setSelectedModel,
  commStyle = "CASUAL",
  setCommStyle,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { percentRemaining, tokensRemaining } = useCompanion();

  // Real Speech-to-Text via Web Speech API (Indonesian language support)
  const {
    isListening,
    error: sttError,
    setError: setSttError,
    toggleListening,
    stopListening,
  } = useSTT({
    lang: "id-ID",
    onTranscript: (spokenText) => {
      setInputText(spokenText);
    },
  });

  // Adjust textarea height dynamically based on input length
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputText]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateKeyboardOffset = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (!isMobile) {
        setKeyboardOffset(0);
        return;
      }

      // visualViewport shrinks when the Android/iOS keyboard opens.
      const offset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      );
      setKeyboardOffset(offset);
    };

    updateKeyboardOffset();
    viewport.addEventListener("resize", updateKeyboardOffset);
    viewport.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardOffset);
      viewport.removeEventListener("scroll", updateKeyboardOffset);
      window.removeEventListener("resize", updateKeyboardOffset);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends the message; Shift + Enter creates a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isSending) {
        if (isListening) stopListening();
        handleSendMessage();
      }
    }
  };

  const handleTriggerSend = () => {
    if (!inputText.trim() || isSending) return;
    if (isListening) stopListening();
    handleSendMessage();
  };

  return (
    <div
      className="p-3 sm:p-4 border-t border-brown-900/10 bg-white sticky bottom-0 z-40 shrink-0 md:static"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        ...(keyboardOffset > 0
          ? {
              position: "fixed",
              left: 0,
              right: 0,
              bottom: keyboardOffset,
            }
          : {}),
      }}
    >
      {/* Real Voice input active feedback */}
      {isListening && (
        <div className="mb-2 flex items-center justify-between bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs animate-in fade-in duration-150">
          <span className="font-semibold flex min-w-0 flex-1 items-center gap-2 leading-4 break-words">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Mendengarkan suaramu... Ucapkan perasaanmu langsung ke Zyba.
          </span>
          <button
            type="button"
            onClick={stopListening}
            className="text-xs font-bold underline cursor-pointer hover:text-orange-700 ml-2 shrink-0"
          >
            Selesai
          </button>
        </div>
      )}

      {/* Voice Recognition Error feedback */}
      {sttError && (
        <div className="mb-2 flex items-center justify-between bg-red-50 text-danger border border-red-200 px-4 py-2 rounded-full text-xs animate-in fade-in duration-150">
          <span className="truncate flex-1 text-xs">{sttError}</span>
          <button
            type="button"
            onClick={() => setSttError(null)}
            className="text-xs font-bold ml-2 underline cursor-pointer hover:text-red-800"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Rounded full-width composer card with attachment, mic, and send button */}
      <div className="relative flex items-center w-full bg-cream/70 rounded-full focus-within:ring-1 focus-within:ring-brown-900/10 focus-within:bg-white transition-all pl-3 pr-2 py-1 shadow-xs">
        {/* Attachment Icon — Honestly disabled with clear explanation */}
        <button
          type="button"
          disabled
          className="p-2 text-brown-700/40 cursor-not-allowed rounded-full transition-colors"
          title="Lampiran dokumen/foto belum didukung saat ini (fokus pada pendampingan teks & suara)"
          aria-label="Lampiran belum didukung"
          aria-disabled="true"
        >
          <Paperclip size={16} aria-hidden />
        </button>

        {/* Real Voice/Mic Icon via Web Speech API */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isListening
              ? "text-orange-600 bg-orange-200 animate-pulse"
              : "text-brown-700 hover:text-brown-900 hover:bg-cream"
          }`}
          title={isListening ? "Hentikan perekaman suara" : "Bicara dengan suara (Bahasa Indonesia)"}
          aria-label={isListening ? "Hentikan perekaman suara" : "Input suara"}
        >
          <Mic size={16} aria-hidden />
        </button>

        {/* Multiline auto-growing Textarea: Enter to send, Shift+Enter for newline */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan ke Zyba... (Enter kirim, Shift+Enter baris baru)"
          disabled={isSending}
          rows={1}
          className="flex-1 min-w-0 bg-transparent px-2 sm:px-3 py-2 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/60 focus:outline-none resize-none max-h-28 overflow-y-auto leading-relaxed"
        />

        {/* Circular Send Button with loading spinner */}
        <button
          type="button"
          onClick={handleTriggerSend}
          disabled={!inputText.trim() || isSending}
          aria-label="Kirim Pesan"
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
            inputText.trim() && !isSending
              ? "bg-orange-500 text-white hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-brown-900/20 text-white/70 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <Loader2 size={14} className="animate-spin text-white" />
          ) : (
            <Send size={14} aria-hidden className="rotate-45" />
          )}
        </button>
      </div>

      {/* Kontrol Model & Gaya menempel ke input chat */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-1 px-1 text-xs text-brown-700">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {setSelectedModel && (
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          )}

          {setCommStyle && (
            <div className="flex bg-cream/80 rounded-full border border-brown-900/10 p-0.5 shrink-0" title="Gaya Komunikasi AI">
              {(["CASUAL", "FORMAL", "FUN"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setCommStyle(style)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    commStyle === style
                      ? "bg-brown-900 text-white shadow-2xs"
                      : "text-brown-700 hover:text-brown-900"
                  }`}
                >
                  {style.charAt(0) + style.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-brown-700/50 hidden sm:inline">
            Enter untuk kirim · Shift+Enter baris baru
          </span>
          <span
            className="text-[10px] text-brown-700/70 font-medium flex items-center gap-1.5"
            title={`${tokensRemaining.toLocaleString("id-ID")} token tersisa`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                percentRemaining <= 15
                  ? "bg-danger animate-pulse"
                  : percentRemaining <= 40
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            />
            {percentRemaining}% token tersisa
          </span>
        </div>
      </div>
    </div>
  );
}
