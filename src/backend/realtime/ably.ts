// Ably Realtime Client for Community DM (REST API - Lightweight, no got/webpack chunk dependencies)
import "server-only";

/**
 * Publish message to Ably channel for realtime delivery via REST API
 * Channel: dm:{conversationId}
 */
export async function publishDMMessage(
  conversationId: string,
  message: {
    id: string;
    senderId: string;
    content: string;
    createdAt: Date;
  }
) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return;
  }

  try {
    const channel = `dm:${conversationId}`;
    const url = `https://rest.ably.io/channels/${encodeURIComponent(channel)}/messages`;
    const authHeader = `Basic ${Buffer.from(apiKey.trim()).toString("base64")}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "new-message",
        data: {
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Ably REST] Publish status ${res.status}:`, errText);
    } else {
      console.log(`[Ably REST] Published message to dm:${conversationId}`);
    }
  } catch (err) {
    console.warn("[Ably REST] Publish warning:", err);
    // Don't throw — message is already safely stored in Postgres DB
  }
}

/**
 * Get Ably token request for client-side auth
 */
export async function getAblyTokenForUser(userId: string): Promise<string> {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return JSON.stringify({ token: "mock_ably_token" });
  }

  const [keyName] = apiKey.split(":");
  if (!keyName) {
    return JSON.stringify({ token: "mock_ably_token" });
  }

  try {
    const url = `https://rest.ably.io/keys/${encodeURIComponent(keyName)}/requestToken`;
    const authHeader = `Basic ${Buffer.from(apiKey.trim()).toString("base64")}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: userId,
        capability: {
          "dm:*": ["subscribe", "history"],
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return JSON.stringify(data);
    }
  } catch (err) {
    console.warn("[Ably Token] Failed to fetch token via REST:", err);
  }

  return JSON.stringify({ token: "mock_ably_token" });
}
