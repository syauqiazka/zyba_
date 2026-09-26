import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";

/**
 * GET /api/community/dm/conversations
 * List user's DM conversations sorted by lastMessageAt
 */
// Fast in-memory cache for user profiles (TTL 30s)
const userProfileCache = new Map<string, { data: { name: string; username: string | null; avatarUrl: string | null }; timestamp: number }>();
const PROFILE_CACHE_TTL = 30000;

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

    const otherUserIds = Array.from(
      new Set(
        participations
          .map((p) => p.conversation.participants[0]?.userId)
          .filter((id): id is string => Boolean(id))
      )
    );

    let usersMap = new Map<string, { name: string; username: string | null; avatarUrl: string | null }>();
    const missingIds: string[] = [];

    const now = Date.now();
    for (const uid of otherUserIds) {
      const cached = userProfileCache.get(uid);
      if (cached && now - cached.timestamp < PROFILE_CACHE_TTL) {
        usersMap.set(uid, cached.data);
      } else {
        missingIds.push(uid);
      }
    }

    if (missingIds.length > 0) {
      try {
        const users = await accountDb.user.findMany({
          where: { id: { in: missingIds } },
          select: { id: true, name: true, username: true, avatarUrl: true },
        });
        for (const u of users) {
          const profile = { name: u.name, username: u.username, avatarUrl: u.avatarUrl };
          usersMap.set(u.id, profile);
          userProfileCache.set(u.id, { data: profile, timestamp: now });
        }
      } catch (err) {
        console.warn("[DM] Could not fetch user details for conversations", err);
      }
    }

    // Compute real unread count for each conversation
    const convIds = participations.map((p) => p.conversationId);
    let unreadMap = new Map<string, number>();
    if (convIds.length > 0) {
      const unreadGroups = await communityDb.directMessage.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: { in: convIds },
          senderId: { not: userId },
          readAt: null,
        },
        _count: { id: true },
      });
      unreadMap = new Map(unreadGroups.map((g) => [g.conversationId, g._count.id]));
    }

    const conversations = participations.map((p) => {
      const conv = p.conversation;
      const otherParticipant = conv.participants[0];
      const otherId = otherParticipant?.userId || "unknown";
      const userMeta = usersMap.get(otherId);
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        otherUserId: otherId,
        otherUserName: userMeta?.name || otherId,
        otherUserUsername: userMeta?.username || null,
        otherUserAvatar: userMeta?.avatarUrl || "🦊",
        lastMessage: lastMsg?.content || "",
        lastMessageAt: conv.lastMessageAt.toISOString(),
        unreadCount: unreadMap.get(conv.id) || 0,
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
