import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { invalidateCommunityCache } from "@/lib/communityCache";

/**
 * DELETE /api/community/[postId]
 * Permanently deletes a post. Only the post owner can do this.
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

    const result = await communityRepository.deletePost(
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
      message: "Postingan berhasil dihapus.",
    });
  } catch (error: any) {
    console.error("[Community DELETE] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus postingan." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/community/[postId]
 * Update post content and/or commentsDisabled flag.
 * Only the post owner can do this.
 * Body: { content?: string, commentsDisabled?: boolean }
 */
export async function PATCH(
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

    const body = await req.json();
    const { content, commentsDisabled } = body as {
      content?: string;
      commentsDisabled?: boolean;
    };

    // At least one field must be provided
    const hasContent = typeof content === "string" && content.trim().length > 0;
    const hasCommentsFlag = typeof commentsDisabled === "boolean";

    if (!hasContent && !hasCommentsFlag) {
      return NextResponse.json(
        { error: "Tidak ada perubahan yang diberikan." },
        { status: 400 }
      );
    }

    const { communityDb } = await import("@/backend/db/communityClient");
    const post = await communityDb.communityPost.findUnique({
      where: { id: params.postId },
      select: { userId: true, commentsDisabled: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden — bukan postingan kamu" }, { status: 403 });
    }

    // Build update data
    const updateData: { content?: string; commentsDisabled?: boolean } = {};
    if (hasContent) updateData.content = content!.trim();
    if (hasCommentsFlag) updateData.commentsDisabled = commentsDisabled;

    const updated = await communityDb.communityPost.update({
      where: { id: params.postId },
      data: updateData,
      select: {
        id: true,
        content: true,
        commentsDisabled: true,
        createdAt: true,
      },
    });

    invalidateCommunityCache();

    return NextResponse.json({
      success: true,
      post: updated,
      message: hasCommentsFlag
        ? commentsDisabled
          ? "Komentar berhasil dimatikan."
          : "Komentar berhasil diaktifkan kembali."
        : "Postingan berhasil diperbarui.",
    });
  } catch (error: any) {
    console.error("[Community PATCH] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui postingan." },
      { status: 500 }
    );
  }
}
