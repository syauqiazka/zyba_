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

    const { postId, content, parentId } = await req.json();
    
    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { error: "Post ID and content required" },
        { status: 400 }
      );
    }

    const comment = await communityDb.communityComment.create({
      data: {
        postId,
        userId: session.userId,
        content: content.trim(),
        parentId: parentId || null,
      },
    });

    // Resolve author name from Account DB manually
    const authorRes = await fetch(`/api/account/user/${session.userId}`).catch(() => null);
    const authorData = authorRes?.ok ? await authorRes.json() : null;

    return NextResponse.json({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      userId: comment.userId,
      author: authorData?.user?.name || "Pengguna ZYBA",
      avatar: authorData?.user?.avatarUrl || "fox",
    });
  } catch (error: any) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create comment" },
      { status: 500 }
    );
  }
}