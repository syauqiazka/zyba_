import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";
import { invalidateUserMeCache, invalidateDailyAssessmentCache } from "@/lib/server/userMeCache";
import { invalidateUserPlanCache } from "@/backend/billing/entitlements";
import { invalidateCommunityCache } from "@/lib/communityCache";

/**
 * DELETE /api/account/delete
 * Permanently deletes the authenticated user's account and all personal wellness data.
 * Adheres to Privacy & Data Protection requirements (TAHAP 6).
 */
export async function DELETE(req: NextRequest) {
  try {
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Sesi login diperlukan." },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // 1. Bersihkan data di database Companion (percakapan & pesan)
    try {
      await companionDb.conversation.deleteMany({
        where: { userId },
      });
      await companionDb.premiumInsightCache.deleteMany({
        where: { userId },
      }).catch(() => {});
    } catch (companionErr) {
      console.warn("[Account Delete] Companion cleanup warning:", companionErr);
    }

    // 2. Bersihkan data di database Community
    try {
      await communityDb.communityBookmark.deleteMany({ where: { userId } }).catch(() => {});
      await communityDb.communityLike.deleteMany({ where: { userId } }).catch(() => {});
      await communityDb.communityFollow.deleteMany({
        where: { OR: [{ followerId: userId }, { followingId: userId }] },
      }).catch(() => {});
      await communityDb.communityNotification.deleteMany({
        where: { OR: [{ recipientId: userId }, { actorId: userId }] },
      }).catch(() => {});
      await communityDb.directMessage.deleteMany({
        where: { senderId: userId },
      }).catch(() => {});
      await communityDb.directParticipant.deleteMany({
        where: { userId },
      }).catch(() => {});
      await communityDb.communityComment.deleteMany({ where: { userId } }).catch(() => {});
      await communityDb.communityPost.deleteMany({ where: { userId } }).catch(() => {});
      invalidateCommunityCache();
    } catch (commErr) {
      console.warn("[Account Delete] Community cleanup warning:", commErr);
    }

    // 3. Bersihkan data di database Account (User dan relasi cascade)
    try {
      await accountDb.dailyAssessment.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.moodEntry.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.journalEntry.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.activityLog.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.assessment.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.subscription.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.payment.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.notificationPref.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.userAchievement.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.userBadge.deleteMany({ where: { userId } }).catch(() => {});
      await accountDb.user.delete({ where: { id: userId } }).catch(() => {});
    } catch (accountErr) {
      console.warn("[Account Delete] Account DB cleanup warning:", accountErr);
    }

    // 4. Invalidate cache server
    invalidateUserMeCache(userId);
    invalidateDailyAssessmentCache(userId);
    invalidateUserPlanCache(userId);

    // 5. Hapus cookie auth-token
    const response = NextResponse.json({
      success: true,
      message: "Akun dan semua data terkait berhasil dihapus secara permanen.",
    });

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("[Account Delete Error]:", error);
    return NextResponse.json(
      { error: "Gagal menghapus akun. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}