import { useState, useEffect, useCallback, useRef } from "react";

export interface DMMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
}

export interface DMConversation {
  id: string;
  otherUserId: string;
  otherUserName?: string;
  otherUserUsername?: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

/**
 * useDM Hook
 * Realtime messaging with reactive polling (tanpa harus reload).
 * - Polling pesan aktif setiap 2.5 detik
 * - Polling daftar obrolan & unread badge setiap 5 detik
 * - Auto mark-as-read & update badge count instan
 */
export function useDM(currentUserId?: string | null) {
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, DMMessage[]>>({});
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const activeConvIdRef = useRef<string | null>(null);
  activeConvIdRef.current = activeConvId;

  const currentUserIdRef = useRef<string | null | undefined>(currentUserId);
  currentUserIdRef.current = currentUserId;

  // ── 1. Load Conversations ──────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/community/dm/conversations", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.warn("[DM] Load conversations failed:", err);
    }
  }, []);

  // ── 2. Load Messages for a Conversation ────────────────────────────
  const loadMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    try {
      const res = await fetch(`/api/community/dm/messages?conversationId=${encodeURIComponent(convId)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages((prev) => {
          const current = prev[convId] || [];
          // Hanya update jika berbeda untuk cegah re-render berlebih
          if (
            current.length !== data.messages.length ||
            current[current.length - 1]?.id !== data.messages[data.messages.length - 1]?.id ||
            current[current.length - 1]?.readAt !== data.messages[data.messages.length - 1]?.readAt
          ) {
            return { ...prev, [convId]: data.messages };
          }
          return prev;
        });

        // Jika pesan berhasil dimuat, unread di percakapan ini otomatis di-clear
        setConversations((prev) =>
          prev.map((c) => (c.id === convId && c.unreadCount > 0 ? { ...c, unreadCount: 0 } : c))
        );

        // Notifikasi ke sidebar untuk update badge
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("zyba_badge_update"));
        }
      }
    } catch (err) {
      console.warn("[DM] Load messages failed:", err);
    }
  }, []);

  // ── 3. Fast Adaptive Polling & Focus-Refresh (Snappy Chat Experience) ─
  useEffect(() => {
    if (!activeConvId) return;

    // Load langsung seketika saat percakapan dibuka
    loadMessages(activeConvId);

    // Refresh seketika saat user kembali fokus ke tab
    const handleFocus = () => {
      if (activeConvIdRef.current) {
        loadMessages(activeConvIdRef.current);
        loadConversations();
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // Polling cepat: 1200ms saat tab aktif, 4000ms saat di background
    const interval = setInterval(() => {
      if (activeConvIdRef.current) {
        if (!document.hidden) {
          loadMessages(activeConvIdRef.current);
        }
      }
    }, 1200);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [activeConvId, loadMessages, loadConversations]);

  // ── 4. Polling Daftar Conversations (setiap 4s saat aktif) ────────────
  useEffect(() => {
    loadConversations();

    const interval = setInterval(() => {
      if (!document.hidden) {
        loadConversations();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [loadConversations]);

  // ── 5. Subscribe to conversation ─────────────────────────────────────
  const subscribeToConversation = useCallback((convId: string) => {
    setActiveConvId(convId);
  }, []);

  // ── 6. Send Message ──────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (convId: string, content: string) => {
      if (!convId || !content.trim()) return;

      const trimmed = content.trim();

      // Optimistic message — gunakan currentUserId agar isMe langsung true tanpa flash
      const tempId = "temp_" + Date.now();
      const optimisticMsg: DMMessage = {
        id: tempId,
        senderId: currentUserIdRef.current || "me",
        content: trimmed,
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      setMessages((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), optimisticMsg],
      }));

      // Update percakapan di list seketika
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, lastMessage: trimmed, lastMessageAt: new Date().toISOString() }
            : c
        )
      );

      try {
        const res = await fetch("/api/community/dm/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: convId, content: trimmed }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const data = await res.json();
        if (data.message) {
          // Replace optimistic message dengan real message dari database
          setMessages((prev) => ({
            ...prev,
            [convId]: (prev[convId] || []).map((m) => (m.id === tempId ? data.message : m)),
          }));
        }

        // Trigger update badge & conversations
        loadConversations();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("zyba_badge_update"));
        }

        return data.message;
      } catch (err) {
        console.error("[DM] Send message failed:", err);
        // Rollback optimistic message jika gagal
        setMessages((prev) => ({
          ...prev,
          [convId]: (prev[convId] || []).filter((m) => m.id !== tempId),
        }));
        throw err;
      }
    },
    [loadConversations]
  );

  // ── 7. Get or Create Conversation ────────────────────────────────────
  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    try {
      const res = await fetch("/api/community/dm/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await res.json();
      return data.conversationId as string;
    } catch (err) {
      console.error("[DM] Create conversation failed:", err);
      throw err;
    }
  }, []);

  return {
    conversations,
    messages,
    activeConvId,
    setActiveConvId,
    isConnected,
    loadConversations,
    loadMessages,
    subscribeToConversation,
    sendMessage,
    getOrCreateConversation,
  };
}
