"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AIModelType } from "@/backend/ai/aiModelManager";
import { PersonaId } from "@/backend/ai/personas";
import { detectRisk } from "@/lib/crisisDetection";
import { useTTS } from "@/hooks/useTTS";
import { formatChatListTime } from "@/lib/dateUtils";

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  flaggedForRisk?: boolean;
  modelUsed?: string;
  time: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: Message[];
}

export const INITIAL_CONVERSATIONS: Conversation[] = [];

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
  activeConvId: string | null;
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
  selectedPersona: PersonaId;
  setSelectedPersona: (persona: PersonaId) => void;
  isSending: boolean;
  showSettingsModal: boolean;
  setShowSettingsModal: (val: boolean) => void;
  showPersonaModal: boolean;
  setShowPersonaModal: (val: boolean) => void;
  showProModal: boolean;
  setShowProModal: (val: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (val: boolean) => void;
  convIdToDelete: string | null;
  setConvIdToDelete: (id: string | null) => void;
  crisisAlert: boolean;
  setCrisisAlert: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleCreateNewChat: () => void;
  handleDeleteChat: (idToDelete?: string) => Promise<void>;
  handleSendMessage: (customText?: string) => Promise<void>;
  activeConv: Conversation | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  quotaRemaining: number | null;
  isTTSEnabled: boolean;
  setIsTTSEnabled: (val: boolean) => void;
  ttsProvider: "elevenlabs" | "edge";
  setTTSProvider: (provider: "elevenlabs" | "edge") => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (val: boolean) => void;
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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<"curhat" | "solusi">("curhat");
  const [inputText, setInputText] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Persist commStyle, selectedModel & selectedPersona across refreshes via localStorage
  const [commStyle, setCommStyleRaw] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [selectedModel, setSelectedModelRaw] = useState<AIModelType>("gemini-3.8-flash");
  const [selectedPersona, setSelectedPersonaRaw] = useState<PersonaId>("KINA");
  const [isSending, setIsSending] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [_hydrated, setHydrated] = useState(false);

  // Load persisted preferences on mount (client-only)
  useEffect(() => {
    try {
      const savedModel = localStorage.getItem("zyba_companion_model") as AIModelType | null;
      const savedStyle = localStorage.getItem("zyba_companion_style") as "CASUAL" | "FORMAL" | "FUN" | null;
      const savedPersona = localStorage.getItem("zyba_companion_persona") as PersonaId | null;
      if (savedModel) setSelectedModelRaw(savedModel);
      if (savedStyle) setCommStyleRaw(savedStyle);
      if (savedPersona && ["KINA", "OLLIE", "RUBI", "BRUNO"].includes(savedPersona)) {
        setSelectedPersonaRaw(savedPersona);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const setSelectedModel = useCallback((model: AIModelType) => {
    setSelectedModelRaw(model);
    try { localStorage.setItem("zyba_companion_model", model); } catch {}
  }, []);

  const setCommStyle = useCallback((style: "CASUAL" | "FORMAL" | "FUN") => {
    setCommStyleRaw(style);
    try { localStorage.setItem("zyba_companion_style", style); } catch {}
  }, []);

  const setSelectedPersona = useCallback((persona: PersonaId) => {
    setSelectedPersonaRaw(persona);
    try { localStorage.setItem("zyba_companion_persona", persona); } catch {}
  }, []);

  // Modals & Banners
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [convIdToDelete, setConvIdToDelete] = useState<string | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop } = useTTS();
  const [latestAIMessageId, setLatestAIMessageId] = useState<string | null>(null);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false); // Audio mode off by default
  const [ttsProvider, setTTSProvider] = useState<"elevenlabs" | "edge">("edge"); // Default Edge TTS
  const playedMessageIds = useRef<Set<string>>(new Set()); // Track played messages

  const activeConv = activeConvId ? (conversations.find((c) => c.id === activeConvId) ?? undefined) : undefined;

  // Stop audio when switching conversations
  useEffect(() => {
    stop(); // stop any playing audio
  }, [activeConvId, stop]);

  // Fetch conversations on mount
  useEffect(() => {
    fetch("/api/companion/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations) {
          const mapped = data.conversations.map((c: any) => ({
            id: c.id,
            title: c.title,
            lastMsg: c.messages[c.messages.length - 1]?.content || "Percakapan baru",
            time: formatChatListTime(c.updatedAt || (c.messages.length > 0 ? c.messages[c.messages.length - 1].createdAt : undefined)),
            emotionTag: "Netral",
            messages: c.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              modelUsed: m.modelUsed,
            })),
          }));
          setConversations(mapped);
          if (mapped.length > 0) {
            setActiveConvId(mapped[0].id);
          }
        }
      })
      .catch((err) => console.error("[Fetch Conversations]:", err));
  }, []);

  // Fetch quota on mount
  useEffect(() => {
    fetch("/api/companion/quota")
      .then((res) => res.json())
      .then((data) => {
        if (data.remaining !== undefined) {
          setQuotaRemaining(data.remaining === Infinity ? null : data.remaining);
        }
      })
      .catch((err) => console.error("[Quota Check]:", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isSending]);

  // Auto-play TTS when new AI message arrives (only if TTS enabled)
  useEffect(() => {
    if (!latestAIMessageId || !isTTSEnabled) return;
    
    // Skip if already played
    if (playedMessageIds.current.has(latestAIMessageId)) return;
    
    const activeMessages = activeConv?.messages || [];
    const latestMsg = activeMessages.find(m => m.id === latestAIMessageId);
    
    if (latestMsg && latestMsg.role === "ASSISTANT") {
      // Mark as played immediately
      playedMessageIds.current.add(latestAIMessageId);
      
      // Auto-play after small delay (let message render first)
      setTimeout(() => {
        speak(latestMsg.content, ttsProvider === "elevenlabs");
      }, 300);
    }
  }, [latestAIMessageId, activeConv?.messages, speak, isTTSEnabled, ttsProvider]);

  // Stop audio when conversation changes
  useEffect(() => {
    return () => {
      stop(); // cleanup audio on activeConvId change
    };
  }, [activeConvId, stop]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    // Auto-create conversation if none is active (new chat state)
    let currentConvId = activeConvId;
    
    if (!currentConvId) {
      const tempId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: tempId,
        title: textToSend.slice(0, 32),
        lastMsg: textToSend,
        time: "Baru saja",
        emotionTag: "Netral",
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(tempId);
      currentConvId = tempId;
      
      // Save to DB immediately and get real ID
      try {
        const dbResponse = await fetch("/api/companion/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newConv.title }),
        });
        const dbData = await dbResponse.json();
        
        // Update local state with DB ID (replace temp ID)
        if (dbData.conversation) {
          const dbId = dbData.conversation.id;
          setConversations((prev) => prev.map((c) => c.id === tempId ? { ...c, id: dbId } : c));
          setActiveConvId(dbId);
          currentConvId = dbId;
        }
      } catch (err) {
        console.error("[Create Conversation]:", err);
      }
    }

    setInputText("");
    setIsSending(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newUserMsg: Message = {
      id: `m-${Date.now()}`,
      role: "USER",
      content: textToSend,
      time: timeNow,
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === currentConvId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? textToSend.slice(0, 32) : c.title,
            lastMsg: textToSend,
            time: formatChatListTime(new Date()),
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
          conversationId: currentConvId, // use DB ID
          model: selectedModel,
          style: commStyle,
          persona: selectedPersona,
        }),
      });

      // Handle quota exceeded (403)
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.error === "QUOTA_EXCEEDED") {
          setShowProModal(true);
          setIsSending(false);
          return;
        }
      }

      if (!response.ok) {
        throw new Error("Gagal menerima respons AI");
      }

      const data = await response.json();

      // Update quota after successful message
      if (data.quotaRemaining !== undefined) {
        setQuotaRemaining(data.quotaRemaining);
      }

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
        createdAt: new Date().toISOString(),
      };

      // Auto-play TTS for AI reply
      setLatestAIMessageId(newAiMsg.id);

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConvId) {
            return {
              ...c,
              lastMsg: newAiMsg.content.slice(0, 60) + "...",
              time: formatChatListTime(new Date()),
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
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConvId ? { ...c, messages: [...c.messages, fallbackAiMsg] } : c
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewChat = () => {
    // Don't create a temp conversation that would vanish on refresh.
    // Just clear the active conversation so the welcome/empty state shows.
    // A real DB conversation is created only when the first message is sent.
    setActiveConvId(null);
    setInputText("");
  };

  const handleDeleteChat = async (idToDelete?: string) => {
    const targetId = idToDelete || convIdToDelete || activeConvId;
    if (!targetId) {
      setShowDeleteModal(false);
      setConvIdToDelete(null);
      return;
    }

    // Delete from DB
    try {
      await fetch(`/api/companion/conversations?id=${targetId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("[Delete Conversation]:", err);
    }

    const filtered = conversations.filter((c) => c.id !== targetId);
    setConversations(filtered);
    
    if (targetId === activeConvId) {
      if (filtered.length === 0) {
        // Last conversation deleted — reset to empty state
        setActiveConvId(null);
      } else {
        // Switch to first remaining conversation
        setActiveConvId(filtered[0].id);
      }
    }
    
    setShowDeleteModal(false);
    setConvIdToDelete(null);
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
        selectedPersona,
        setSelectedPersona,
        isSending,
        showSettingsModal,
        setShowSettingsModal,
        showPersonaModal,
        setShowPersonaModal,
        showProModal,
        setShowProModal,
        showDeleteModal,
        setShowDeleteModal,
        convIdToDelete,
        setConvIdToDelete,
        crisisAlert,
        setCrisisAlert,
        searchQuery,
        setSearchQuery,
        handleCreateNewChat,
        handleDeleteChat,
        handleSendMessage,
        activeConv,
        messagesEndRef,
        quotaRemaining,
        isTTSEnabled,
        setIsTTSEnabled,
        ttsProvider,
        setTTSProvider,
        mobileSidebarOpen,
        setMobileSidebarOpen,
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
