import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

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

    return NextResponse.json({
      notifications: items.map(n => ({
        id: n.id,
        recipientId: n.recipientId,
        actorId: n.actorId,
        type: n.type,
        postId: n.postId,
        commentId: n.commentId,
        conversationId: n.conversationId,
        readAt: n.readAt?.toISOString(),
        createdAt: n.createdAt.toISOString(),
      })),
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

    const { notificationId } = await req.json();

    await communityDb.communityNotification.update({
      where: { id: notificationId, recipientId: session.userId },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mark notification read error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark notification read" },
      { status: 500 }
    );
  }
}