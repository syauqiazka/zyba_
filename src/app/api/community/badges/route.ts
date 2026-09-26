import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

// Fast in-memory cache for badges (TTL 10s per user)
const badgesCache = new Map<string, { data: any; timestamp: number }>();
const BADGES_CACHE_TTL = 10000;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({
        unreadMessageCount: 0,
        newFollowerCount: 0,
        unreadNotificationCount: 0,
      });
    }

    const session = await verifySessionToken(token);
    if (!session || !session.userId) {
      return NextResponse.json({
        unreadMessageCount: 0,
        newFollowerCount: 0,
        unreadNotificationCount: 0,
      });
    }

    const userId = session.userId;

    const cached = badgesCache.get(userId);
    if (cached && Date.now() - cached.timestamp < BADGES_CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // 1. Unread notifications count & conversations in parallel
    const [unreadNotificationCount, newFollowerCount, userConversations] = await Promise.all([
      communityDb.communityNotification.count({
        where: {
          recipientId: userId,
          readAt: null,
        },
      }),
      communityDb.communityNotification.count({
        where: {
          recipientId: userId,
          type: "follow",
          readAt: null,
        },
      }),
      communityDb.directParticipant.findMany({
        where: { userId },
        select: { conversationId: true },
      }),
    ]);

    // 2. Unread direct messages count
    let unreadMessageCount = 0;
    if (userConversations.length > 0) {
      const convIds = userConversations.map((c) => c.conversationId);
      unreadMessageCount = await communityDb.directMessage.count({
        where: {
          conversationId: { in: convIds },
          senderId: { not: userId },
          readAt: null,
        },
      });
    }

    const responseData = {
      unreadMessageCount,
      newFollowerCount,
      unreadNotificationCount,
    };

    badgesCache.set(userId, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "private, max-age=10",
      },
    });
  } catch (error: any) {
    console.warn("[/api/community/badges] Failed to fetch badge counts:", error);
    return NextResponse.json({
      unreadMessageCount: 0,
      newFollowerCount: 0,
      unreadNotificationCount: 0,
    });
  }
}
