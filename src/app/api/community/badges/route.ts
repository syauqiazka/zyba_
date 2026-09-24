import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

/**
 * GET /api/community/badges
 * Returns real unread counts for CommunitySidebar:
 * - unreadMessageCount: unread DMs where user is recipient
 * - newFollowerCount: unread follow notifications
 * - unreadNotificationCount: total unread notifications
 */
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

    // 1. Unread notifications count
    const [unreadNotificationCount, newFollowerCount] = await Promise.all([
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
    ]);

    // 2. Unread direct messages count
    // Find all conversation IDs user is participant in
    const userConversations = await communityDb.directParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });

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

    return NextResponse.json({
      unreadMessageCount,
      newFollowerCount,
      unreadNotificationCount,
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
