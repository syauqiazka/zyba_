import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

/**
 * GET /api/community/dm/messages?conversationId=xxx
 * Get messages for a conversation
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    // Verify user is participant
    const participant = await communityDb.directParticipant.findFirst({
      where: {
        conversationId,
        userId: session.userId,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // Get messages
    const messages = await communityDb.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 100, // last 100 messages
    });

    return NextResponse.json({ messages });
  } catch (err: any) {
    console.error("[DM Get Messages]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/community/dm/messages
 * Send a message
 * Body: { conversationId: string, content: string }
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: "conversationId and content required" }, { status: 400 });
    }

    // Verify user is participant
    const participant = await communityDb.directParticipant.findFirst({
      where: {
        conversationId,
        userId: session.userId,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // Create message + update conversation timestamp
    const message = await communityDb.directMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        content: content.trim(),
      },
    });

    await communityDb.directConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Publish via Ably for realtime delivery (non-blocking, never fails message send)
    try {
      const { publishDMMessage } = await import("@/backend/realtime/ably");
      await publishDMMessage(conversationId, message);
    } catch (realtimeErr) {
      console.warn("[DM Realtime Publish warning]:", realtimeErr);
    }

    return NextResponse.json({ message });
  } catch (err: any) {
    console.error("[DM Send Message]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
