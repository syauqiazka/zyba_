import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";

// DELETE /api/account/delete — hapus semua data user dari 3 DB (Bagian 24.1)
// Alur: verifikasi session → hapus dari Community DB → hapus dari Companion DB → hapus dari Account DB (terakhir)
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session) return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });
    const uid = session.userId;

    // 1. Community DB: hapus likes, comments, posts milik user
    const posts = await communityDb.communityPost.findMany({ where: { userId: uid }, select: { id: true } });
    const postIds = posts.map(p => p.id);
    if (postIds.length > 0) {
      await communityDb.communityLike.deleteMany({ where: { postId: { in: postIds } } });
      await communityDb.communityComment.deleteMany({ where: { postId: { in: postIds } } });
      await communityDb.communityPost.deleteMany({ where: { userId: uid } });
    }
    await communityDb.communityComment.deleteMany({ where: { userId: uid } });
    await communityDb.communityLike.deleteMany({ where: { userId: uid } });

    // 2. Companion DB: hapus messages dan conversations
    const convs = await companionDb.conversation.findMany({ where: { userId: uid }, select: { id: true } });
    const convIds = convs.map(c => c.id);
    if (convIds.length > 0) {
      await companionDb.message.deleteMany({ where: { conversationId: { in: convIds } } });
      await companionDb.conversation.deleteMany({ where: { userId: uid } });
    }

    // 3. Account DB: hapus semua data lalu user (cascade akan handle relations)
    await accountDb.user.delete({ where: { id: uid } });

    const response = NextResponse.json({ success: true, message: "Akun dan semua data telah dihapus." });
    response.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err: any) {
    console.error("[Delete Account Error]:", err);
    return NextResponse.json({ error: err.message || "Gagal menghapus akun." }, { status: 500 });
  }
}
