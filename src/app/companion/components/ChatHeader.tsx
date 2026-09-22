"use client";

import { getMoodColor } from "./ConversationList";

interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: any[];
}

interface Props {
  activeConv: Conversation | undefined;
  selectedModel: string;
  commStyle: string;
  setShowSettingsModal: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
  setShowProModal?: (v: boolean) => void;
  isTTSEnabled?: boolean;
  setIsTTSEnabled?: (v: boolean) => void;
}

export default function ChatHeader({
  activeConv,
  selectedModel,
  commStyle,
  setShowSettingsModal,
  setShowDeleteModal,
  setShowProModal,
  isTTSEnabled = false,
  setIsTTSEnabled,
}: Props) {
  const currentEmotion = activeConv?.emotionTag || "Tenang";
  const moodColor = getMoodColor(currentEmotion);

  return (
    <header className="px-6 py-3.5 border-b border-brown-900/10 flex items-center justify-between bg-white/95 sticky top-0 z-10">
      {/* Left: Mascot Avatar, Name, Online Status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* ZYBA Mascot Logo (4-petal brand) */}
          <div className="w-10 h-10 rounded-2xl bg-cream border border-orange-500/20 flex items-center justify-center shadow-sm relative overflow-hidden">
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="w-2.5 h-2.5 rounded-full bg-brown-900 z-10" />
          </div>
          {/* Online Indicator */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
            title="Online"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-sm text-brown-900">
              Zyba Companion
            </h2>
            <span className="flex items-center gap-1 text-[11px] text-green-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
          <span className="text-[10px] text-brown-700">
            {selectedModel} • Gaya: {commStyle}
          </span>
        </div>
      </div>

      {/* Right: Mood Chip + Plan Badge + Action Icons */}
      <div className="flex items-center gap-2">
        {/* Dynamic Emotion Chip from Latest Analysis (10.1) — muted style per 10.8 */}
        <span
          className={`rounded-pill ${moodColor}/10 text-xs font-semibold px-3 py-1 flex items-center gap-1`}
          title="Emosi terdeteksi dari pesan terbaru"
        >
          <span>✨</span>
          <span>{currentEmotion}</span>
        </span>

        {/* Free Plan / Upgrade Button per AGENTS.md 10.8 (setara posisi Free plan · Upgrade di Claude.ai) */}
        {setShowProModal && (
          <button
            type="button"
            onClick={() => setShowProModal(true)}
            className="px-3 py-1.5 rounded-full bg-orange-500 text-white hover:opacity-90 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>⚡</span>
            <span>Zyba Plus</span>
          </button>
        )}

        {/* Audio Mode Toggle */}
        {setIsTTSEnabled && (
          <button
            type="button"
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className={`p-2 rounded-xl transition-colors text-sm ${
              isTTSEnabled
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "text-brown-700 hover:bg-cream hover:text-brown-900"
            }`}
            title={isTTSEnabled ? "Nonaktifkan suara otomatis" : "Aktifkan suara otomatis"}
            aria-label="Toggle audio mode"
          >
            {isTTSEnabled ? "🔊" : "🔇"}
          </button>
        )}

        {/* Settings Gear (10.1) */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-xl text-brown-700 hover:bg-cream hover:text-brown-900 transition-colors text-sm"
          title="Pengaturan Chatbot"
          aria-label="Pengaturan Chatbot"
        >
          ⚙️
        </button>

        {/* Delete Chat */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-2 rounded-xl text-brown-700 hover:bg-orange-100 hover:text-danger transition-colors text-sm"
          title="Hapus Percakapan"
          aria-label="Hapus Percakapan"
        >
          🗑️
        </button>
      </div>
    </header>
  );
}