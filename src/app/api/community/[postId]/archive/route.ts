import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { invalidateCommunityCache } from "@/lib/communityCache";

/**
 * POST /api/community/[postId]/archive
 * Marks a post as hidden (archived). Only the post owner can do this.
 * Archived posts are still retrievable in the /archive view but hidden from main feed.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await communityRepository.archivePost(
      params.postId,
      session.userId
    );

    if (!result.success) {
      const status =
        result.error === "Forbidden" ? 403 :
        result.error === "Post not found" ? 404 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    invalidateCommunityCache();

    return NextResponse.json({
      success: true,
      message: "Postingan berhasil diarsipkan dan disembunyikan dari feed.",
    });
  } catch (error: any) {
    console.error("[Community Archive] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengarsipkan postingan." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/community/[postId]/archive
 * Un-archives a post (makes it visible again).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { communityDb } = await import("@/backend/db/communityClient");
    const post = await communityDb.communityPost.findUnique({
      where: { id: params.postId },
      select: { userId: true, isHidden: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await communityDb.communityPost.update({
      where: { id: params.postId },
      data: { isHidden: false },
    });

    return NextResponse.json({
      success: true,
      message: "Postingan berhasil dipulihkan dari arsip.",
    });
  } catch (error: any) {
    console.error("[Community UnArchive] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memulihkan postingan." },
      { status: 500 }
    );
  }
}
