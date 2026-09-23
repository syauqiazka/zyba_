import { useState, useEffect, useCallback, useRef } from "react";

export interface DMMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
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
 * DM Hook - polling fallback (Ably client-side has webpack issues with Next.js)
 * Server still publishes via Ably for future WebSocket support
 */
export function useDM() {
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, DMMessage[]>>({});
  const [isConnected] = useState(true); // always "connected" in polling mode
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/community/dm/conversations");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("[DM] Load conversations failed:", err);
    }
  }, []);

  // Load messages for conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`/api/community/dm/messages?conversationId=${conversationId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages((prev) => ({ ...prev, [conversationId]: data.messages }));
      }
    } catch (err) {
      console.error("[DM] Load messages failed:", err);
    }
  }, []);

  // Poll active conversation for new messages (5s interval)
  useEffect(() => {
    if (activeConvIdRef.current) {
      pollIntervalRef.current = setInterval(() => {
        loadMessages(activeConvIdRef.current!);
      }, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [loadMessages]);

  // Subscribe = start polling
  const subscribeToConversation = useCallback((conversationId: string) => {
    activeConvIdRef.current = conversationId;
    console.log(`[DM] Polling dm:${conversationId}`);
  }, []);

  // Send message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const res = await fetch("/api/community/dm/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content }),
      });

      const data = await res.json();
      
      // Optimistic update
      if (data.message) {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), data.message],
        }));
      }

      return data.message;
    } catch (err) {
      console.error("[DM] Send message failed:", err);
      throw err;
    }
  }, []);

  // Create or get conversation
  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    try {
      const res = await fetch("/api/community/dm/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId }),
      });

      const data = await res.json();
      return data.conversationId;
    } catch (err) {
      console.error("[DM] Create conversation failed:", err);
      throw err;
    }
  }, []);

  return {
    conversations,
    messages,
    isConnected,
    loadConversations,
    loadMessages,
    subscribeToConversation,
    sendMessage,
    getOrCreateConversation,
  };
}
