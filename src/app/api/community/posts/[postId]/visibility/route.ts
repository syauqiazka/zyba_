import { NextRequest, NextResponse } from "next/server";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";

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

    const post = await communityDb.communityPost.findUnique({
      where: { id: params.postId },
      select: { userId: true, isHidden: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden — bukan postingan kamu" }, { status: 403 });
    }

    const updated = await communityDb.communityPost.update({
      where: { id: params.postId },
      data: { isHidden: !post.isHidden },
      select: { id: true, isHidden: true },
    });

    return NextResponse.json({
      success: true,
      isHidden: updated.isHidden,
      message: updated.isHidden
        ? "Postingan berhasil disembunyikan"
        : "Postingan kembali ditampilkan",
    });
  } catch (error: any) {
    console.error("Visibility toggle error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengubah visibilitas" },
      { status: 500 }
    );
  }
}
