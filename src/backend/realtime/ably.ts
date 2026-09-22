// Ably Realtime Client for Community DM (AGENTS.md 31.D)
// SERVER-ONLY — don't import this in client components
import "server-only";
import Ably from "ably";

let ablyServerClient: Ably.Realtime | null = null;

export function getAblyServerClient(): Ably.Realtime {
  if (!ablyServerClient) {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      throw new Error("ABLY_API_KEY not configured");
    }
    ablyServerClient = new Ably.Realtime({ key: apiKey });
  }
  return ablyServerClient;
}

/**
 * Publish message to Ably channel for realtime delivery
 * Channel: dm:{conversationId}
 */
export async function publishDMMessage(conversationId: string, message: {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}) {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`dm:${conversationId}`);
    
    await channel.publish("new-message", {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    });
    
    console.log(`[Ably] Published message to dm:${conversationId}`);
  } catch (err) {
    console.error("[Ably] Publish failed:", err);
    // Don't throw — message already saved to DB
  }
}

/**
 * Get Ably token for client-side auth (scoped to user's DM channels)
 */
export async function getAblyTokenForUser(userId: string): Promise<string> {
  const ably = getAblyServerClient();
  
  const tokenParams: Ably.TokenParams = {
    clientId: userId,
    capability: {
      "dm:*": ["subscribe", "history"], // can subscribe to any DM channel they're in
    },
  };
  
  const tokenRequest = await ably.auth.createTokenRequest(tokenParams);
  return JSON.stringify(tokenRequest);
}
