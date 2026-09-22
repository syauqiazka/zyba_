import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const existing = await communityDb.communityBookmark.findUnique({
      where: {
        userId_postId: { userId: session.userId, postId },
      },
    });

    if (existing) {
      return NextResponse.json({ bookmarked: true });
    }

    await communityDb.communityBookmark.create({
      data: { userId: session.userId, postId },
    });

    return NextResponse.json({ bookmarked: true });
  } catch (error: any) {
    console.error("Bookmark error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    await communityDb.communityBookmark.deleteMany({
      where: { userId: session.userId, postId },
    });

    return NextResponse.json({ bookmarked: false });
  } catch (error: any) {
    console.error("Unbookmark error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unbookmark" },
      { status: 500 }
    );
  }
}

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

    const bookmarks = await communityDb.communityBookmark.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error: any) {
    console.error("Get bookmarks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get bookmarks" },
      { status: 500 }
    );
  }
}