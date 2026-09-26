import { Volume2, VolumeX, Settings2, Trash2, Zap, Menu } from "lucide-react";
import { PersonaId, getPersonaById } from "@/backend/ai/personas";
import { getMoodColor } from "./ConversationList";
import { useCompanion } from "../context/CompanionContext";

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
  selectedPersona?: PersonaId;
  setSelectedPersona?: (p: PersonaId) => void;
  setShowSettingsModal: (v: boolean) => void;
  setShowPersonaModal?: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
  setShowProModal?: (v: boolean) => void;
  isTTSEnabled?: boolean;
  setIsTTSEnabled?: (v: boolean) => void;
  ttsProvider?: "elevenlabs" | "edge";
  setTTSProvider?: (provider: "elevenlabs" | "edge") => void;
}

export default function ChatHeader({
  activeConv,
  selectedModel,
  commStyle,
  selectedPersona = "KINA",
  setSelectedPersona,
  setShowSettingsModal,
  setShowPersonaModal,
  setShowDeleteModal,
  setShowProModal,
  isTTSEnabled = false,
  setIsTTSEnabled,
  ttsProvider = "edge",
  setTTSProvider,
}: Props) {
  const currentEmotion = activeConv?.emotionTag || "Tenang";
  const moodColor = getMoodColor(currentEmotion);
  const persona = getPersonaById(selectedPersona);
  const { setMobileSidebarOpen } = useCompanion();

  const openPersonaModal = () => {
    if (setShowPersonaModal) {
      setShowPersonaModal(true);
    } else {
      setShowSettingsModal(true);
    }
  };

  return (
    <header className="px-3 sm:px-6 py-3 border-b border-brown-900/10 flex items-center gap-2 justify-between bg-white/95 sticky top-0 z-10">
      {/* Mobile Hamburger */}
      <button
        type="button"
        className="md:hidden shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-brown-700 hover:bg-cream transition-colors"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Buka menu percakapan"
      >
        <Menu size={18} />
      </button>

      {/* Left: Mascot Avatar, Name, Online Status */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={openPersonaModal}
          className="relative group transition-transform active:scale-95"
          title={`Ganti karakter Zyba (Saat ini: ${persona.name})`}
        >
          {/* ZYBA Mascot Character Avatar */}
          <div className="w-10 h-10 rounded-2xl bg-cream border-2 border-orange-500/20 group-hover:border-orange-500 flex items-center justify-center shadow-xs text-xl transition-all">
            <span>{persona.emoji}</span>
          </div>
          {/* Online Indicator */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
            title="Online"
          />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-sm text-brown-900">
              Zyba • {persona.name}
            </h2>
            <button
              type="button"
              onClick={openPersonaModal}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors flex items-center gap-1 shadow-2xs"
              title="Ganti karakter Zyba"
            >
              <span>{persona.emoji}</span>
              <span className="hidden sm:inline">Ganti Karakter</span>
              <span className="text-[8px]">▾</span>
            </button>
            <span className="hidden md:flex items-center gap-1 text-[11px] text-green-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
          <span className="text-[10px] text-brown-700">
            {persona.description} • {selectedModel}
          </span>
        </div>
      </div>

      {/* Right: Mood Chip + Plan Badge + Action Icons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Dynamic Emotion Chip — hidden on xs, visible sm+ */}
        <span
          className={`hidden sm:flex rounded-pill ${moodColor}/10 text-xs font-semibold px-2.5 py-1 items-center gap-1`}
          title="Emosi terdeteksi dari pesan terbaru"
        >
          <span>✨</span>
          <span className="hidden md:inline">{currentEmotion}</span>
        </span>

        {/* Free Plan / Upgrade Button per AGENTS.md 10.8 (setara posisi Free plan · Upgrade di Claude.ai) */}
        {setShowProModal && (
        <button
          type="button"
          onClick={() => setShowProModal(true)}
          className="px-3 py-1.5 rounded-full bg-orange-500 text-white hover:opacity-90 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          aria-label="Upgrade ke Zyba Plus"
        >
          <Zap size={12} aria-hidden />
          <span>Zyba Plus</span>
        </button>
        )}

        {/* Audio Mode Toggle */}
        {setIsTTSEnabled && (
          <button
            type="button"
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className={`p-2 rounded-xl transition-colors ${
              isTTSEnabled
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "text-brown-700 hover:bg-cream hover:text-brown-900"
            }`}
            title={isTTSEnabled ? "Nonaktifkan suara otomatis" : "Aktifkan suara otomatis"}
            aria-label="Toggle audio mode"
          >
            {isTTSEnabled ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
          </button>
        )}

        {/* TTS Provider Selector (only when audio enabled) */}
        {isTTSEnabled && setTTSProvider && (
          <div className="relative">
            <select
              value={ttsProvider}
              onChange={(e) => setTTSProvider(e.target.value as "elevenlabs" | "edge")}
              className="text-xs px-2 py-1 rounded-lg border border-brown-900/10 bg-white text-brown-700 hover:bg-cream transition-colors cursor-pointer appearance-none pr-6"
              title="Pilih TTS provider"
            >
              <option value="edge">Edge TTS (Free)</option>
              <option value="elevenlabs">ElevenLabs (Premium)</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-brown-700 text-xs">▼</div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-xl text-brown-700 hover:bg-cream hover:text-brown-900 transition-colors"
          title="Pengaturan Chatbot"
          aria-label="Pengaturan Chatbot"
        >
          <Settings2 size={16} aria-hidden />
        </button>

        {/* Delete Chat */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-2 rounded-xl text-brown-700 hover:bg-orange-100 hover:text-danger transition-colors"
          title="Hapus Percakapan"
          aria-label="Hapus Percakapan"
        >
          <Trash2 size={16} aria-hidden />
        </button>
      </div>
    </header>
  );
}
