"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AIModelType } from "@/backend/ai/aiModelManager";
import { detectRisk } from "@/lib/crisisDetection";

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  flaggedForRisk?: boolean;
  modelUsed?: string;
  time: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: Message[];
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Overthinking Seputar Tugas Akhir",
    lastMsg: "Terima kasih Zyba, latihan pernapasan tadi sangat membantu fokusku.",
    time: "10:45 AM",
    emotionTag: "Tenang",
    messages: [
      {
        id: "m-1",
        role: "USER",
        content: "Halo Zyba, aku merasa cemas sekali memikirkan deadline tugas minggu depan.",
        time: "10:40 AM",
      },
      {
        id: "m-2",
        role: "ASSISTANT",
        content:
          "Halo Alex! Sangat wajar merasa cemas saat menghadapi banyak tugas sekaligus. Cobalah tarik napas perlahan 4 detik, tahan 4 detik, lalu hembuskan 4 detik. Mari pecah tugasmu menjadi langkah-langkah kecil yang bisa diselesaikan hari ini.",
        modelUsed: "gemini-1.5-flash",
        time: "10:41 AM",
      },
      {
        id: "m-3",
        role: "USER",
        content: "Terima kasih Zyba, latihan pernapasan tadi sangat membantu fokusku.",
        time: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Evaluasi Kualitas Tidur Minggu Ini",
    lastMsg: "Cobalah mematikan gadget 30 menit sebelum tidur ya.",
    time: "Kemarin",
    emotionTag: "Reflektif",
    messages: [
      {
        id: "m-4",
        role: "USER",
        content: "Belakangan ini aku baru bisa tidur jam 2 pagi. Kepala rasanya berat.",
        time: "23:15 PM",
      },
      {
        id: "m-5",
        role: "ASSISTANT",
        content:
          "Kurang tidur dapat mempengaruhi regulasi emosi dan imunitas tubuh. Cobalah mematikan gadget 30 menit sebelum tidur dan dengarkan audio relaksasi di menu Resources.",
        modelUsed: "gemini-1.5-flash",
        time: "23:16 PM",
      },
    ],
  },
];

export type CompanionSection = "chat" | "projects" | "artifacts" | "code" | "customize";

// URL slug ↔ section mapping
export const SECTION_TO_SLUG: Record<CompanionSection, string> = {
  chat: "",
  projects: "projects",
  artifacts: "artifacts",
  code: "code",
  customize: "customize",
};

const SLUG_TO_SECTION: Record<string, CompanionSection> = {
  "": "chat",
  projects: "projects",
  artifacts: "artifacts",
  code: "code",
  customize: "customize",
};

interface CompanionContextType {
  conversations: Conversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  activeSection: CompanionSection;
  setActiveSection: (sec: CompanionSection) => void;
  chatMode: "curhat" | "solusi";
  setChatMode: (mode: "curhat" | "solusi") => void;
  inputText: string;
  setInputText: (text: string) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (val: boolean) => void;
  commStyle: "CASUAL" | "FORMAL" | "FUN";
  setCommStyle: (style: "CASUAL" | "FORMAL" | "FUN") => void;
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
  isSending: boolean;
  showSettingsModal: boolean;
  setShowSettingsModal: (val: boolean) => void;
  showProModal: boolean;
  setShowProModal: (val: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (val: boolean) => void;
  crisisAlert: boolean;
  setCrisisAlert: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleCreateNewChat: () => void;
  handleDeleteChat: () => void;
  handleSendMessage: (customText?: string) => Promise<void>;
  activeConv: Conversation;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const CompanionContext = createContext<CompanionContextType | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive activeSection from URL
  const activeSection: CompanionSection = (() => {
    const parts = pathname.split("/").filter(Boolean); // ["companion", "projects"] or ["companion"]
    const slug = parts[1] || "";
    return SLUG_TO_SECTION[slug] || "chat";
  })();

  const setActiveSection = useCallback(
    (sec: CompanionSection) => {
      const slug = SECTION_TO_SLUG[sec];
      router.push(slug ? `/companion/${slug}` : "/companion");
    },
    [router]
  );

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [chatMode, setChatMode] = useState<"curhat" | "solusi">("curhat");
  const [inputText, setInputText] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [selectedModel, setSelectedModel] = useState<AIModelType>("gemini-1.5-flash");
  const [isSending, setIsSending] = useState(false);

  // Modals & Banners
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText("");
    setIsSending(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newUserMsg: Message = {
      id: `m-${Date.now()}`,
      role: "USER",
      content: textToSend,
      time: timeNow,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? textToSend.slice(0, 32) : c.title,
            lastMsg: textToSend,
            time: "Baru saja",
            messages: [...c.messages, newUserMsg],
          };
        }
        return c;
      })
    );

    // Crisis check
    const isRisk = detectRisk(textToSend);
    if (isRisk) {
      setCrisisAlert(true);
    }

    try {
      const response = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationId: activeConvId,
          model: selectedModel,
          style: commStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menerima respons AI");
      }

      const data = await response.json();

      if (data.isRisk) {
        setCrisisAlert(true);
      }

      const newAiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ASSISTANT",
        content:
          data.reply ||
          "Aku selalu di sini mendengarkanmu. Ceritakan lebih lanjut apa yang sedang membebani pikiranmu.",
        modelUsed: data.modelUsed || selectedModel,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMsg: newAiMsg.content.slice(0, 60) + "...",
              time: "Baru saja",
              emotionTag: data.emotionTag || c.emotionTag || "Tenang",
              messages: [...c.messages, newAiMsg],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Companion chat error:", err);
      const fallbackAiMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: "ASSISTANT",
        content:
          "Maaf Alex, koneksi sedang sibuk sejenak. Namun ingatlah untuk selalu menarik napas perlahan dan beristirahat sejenak bila terasa kewalahan.",
        modelUsed: selectedModel,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, fallbackAiMsg] } : c
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "Percakapan Baru",
      lastMsg: "Mulai percakapan baru dengan Zyba...",
      time: "Baru saja",
      emotionTag: "Netral",
      messages: [],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const handleDeleteChat = () => {
    if (conversations.length <= 1) {
      setShowDeleteModal(false);
      return;
    }
    const filtered = conversations.filter((c) => c.id !== activeConvId);
    setConversations(filtered);
    setActiveConvId(filtered[0]?.id || "");
    setShowDeleteModal(false);
  };

  return (
    <CompanionContext.Provider
      value={{
        conversations,
        activeConvId,
        setActiveConvId,
        activeSection,
        setActiveSection,
        chatMode,
        setChatMode,
        inputText,
        setInputText,
        isVoiceActive,
        setIsVoiceActive,
        commStyle,
        setCommStyle,
        selectedModel,
        setSelectedModel,
        isSending,
        showSettingsModal,
        setShowSettingsModal,
        showProModal,
        setShowProModal,
        showDeleteModal,
        setShowDeleteModal,
        crisisAlert,
        setCrisisAlert,
        searchQuery,
        setSearchQuery,
        handleCreateNewChat,
        handleDeleteChat,
        handleSendMessage,
        activeConv,
        messagesEndRef,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error("useCompanion must be used within a CompanionProvider");
  }
  return context;
}
