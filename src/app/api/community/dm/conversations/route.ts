import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

/**
 * GET /api/community/dm/conversations
 * List user's DM conversations sorted by lastMessageAt
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

    const userId = session.userId;

    // Get conversations where user is participant
    const participations = await communityDb.directParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } }, // get OTHER participant
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1, // last message only
            },
          },
        },
      },
      orderBy: {
        conversation: {
          lastMessageAt: "desc",
        },
      },
    });

    const conversations = participations.map((p) => {
      const conv = p.conversation;
      const otherParticipant = conv.participants[0];
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        otherUserId: otherParticipant?.userId || "unknown",
        lastMessage: lastMsg?.content || "",
        lastMessageAt: conv.lastMessageAt.toISOString(),
        unreadCount: 0, // TODO: implement read tracking
      };
    });

    return NextResponse.json({ conversations });
  } catch (err: any) {
    console.error("[DM Conversations]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/community/dm/conversations
 * Create or get existing conversation with another user
 * Body: { otherUserId: string }
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

    const { otherUserId } = await req.json();
    if (!otherUserId) {
      return NextResponse.json({ error: "otherUserId required" }, { status: 400 });
    }

    const userId = session.userId;

    // Check if conversation already exists between these two users
    const existingParticipations = await communityDb.directParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    const existing = existingParticipations.find((p) => {
      const participants = p.conversation.participants;
      return (
        participants.length === 2 &&
        participants.some((part) => part.userId === otherUserId)
      );
    });

    if (existing) {
      return NextResponse.json({ conversationId: existing.conversationId });
    }

    // Create new conversation
    const conversation = await communityDb.directConversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: otherUserId }],
        },
      },
    });

    return NextResponse.json({ conversationId: conversation.id });
  } catch (err: any) {
    console.error("[DM Create Conversation]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
