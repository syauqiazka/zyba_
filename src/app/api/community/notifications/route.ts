import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";
import { formatRelativeTime } from "@/lib/dateUtils";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const unreadOnly = searchParams.get("unread") === "true";

    const whereClause: any = {
      recipientId: session.userId,
    };

    if (unreadOnly) {
      whereClause.readAt = null;
    }

    const notifications = await communityDb.communityNotification.findMany({
      where: whereClause,
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = notifications.length > limit;
    const items = hasMore ? notifications.slice(0, -1) : notifications;

    // Batch fetch actor users
    const actorIds = [...new Set(items.map(n => n.actorId))];
    const actors = await accountDb.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, avatarUrl: true, username: true },
    });
    const actorMap = new Map(actors.map(a => [a.id, a]));

    return NextResponse.json({
      notifications: items.map(n => {
        const actor = actorMap.get(n.actorId);
        return {
          id: n.id,
          recipientId: n.recipientId,
          actorId: n.actorId,
          user: actor?.name || "Pengguna ZYBA",
          username: actor?.username || null,
          avatar: actor?.avatarUrl || "🦊",
          type: n.type,
          action: n.type,
          postId: n.postId,
          commentId: n.commentId,
          conversationId: n.conversationId,
          time: formatRelativeTime(n.createdAt),
          read: Boolean(n.readAt),
          readAt: n.readAt?.toISOString() || null,
          createdAt: n.createdAt.toISOString(),
        };
      }),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch (error: any) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      await communityDb.communityNotification.updateMany({
        where: { recipientId: session.userId, readAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ success: true, allRead: true });
    }

    if (notificationId) {
      await communityDb.communityNotification.updateMany({
        where: { id: notificationId, recipientId: session.userId },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing notificationId or markAllRead" }, { status: 400 });
  } catch (error: any) {
    console.error("Mark notification read error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark notification read" },
      { status: 500 }
    );
  }
}