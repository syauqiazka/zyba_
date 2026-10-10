import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/backend/billing/admin";
import { userRepository } from "@/backend/auth/userRepository";
import { reportRepository } from "@/backend/community/reportRepository";
import { communityDb } from "@/backend/db/communityClient";
import { invalidateCommunityCache } from "@/lib/communityCache";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Memerlukan role Administrator." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      reportId,
      targetUserId,
      action,
      reason = "Pelanggaran pedoman komunitas",
      durationDays = 7,
      targetType,
      targetId,
      resolutionNote,
    } = body;

    if (!action) {
      return NextResponse.json({ error: "Action moderasi wajib ditentukan." }, { status: 400 });
    }

    const cleanReason = String(reason || resolutionNote || "Tindakan moderasi resmi ZYBA").trim();

    let actionResult: any = { success: true };

    switch (action) {
      case "WARN": {
        if (!targetUserId) return NextResponse.json({ error: "Target user ID diperlukan." }, { status: 400 });
        actionResult = await userRepository.warnUser(targetUserId, cleanReason, admin.id, reportId);
        break;
      }

      case "HIDE_POST": {
        const idToHide = targetId || reportId;
        if (!idToHide) return NextResponse.json({ error: "Target post ID diperlukan." }, { status: 400 });
        await reportRepository.hideContent("POST", idToHide);
        if (targetUserId) {
          await userRepository.recordModerationLog({
            adminId: admin.id,
            targetUserId,
            action: "HIDE_POST",
            reason: cleanReason,
            reportId,
            metadata: { targetId: idToHide },
          });
        }
        break;
      }

      case "HIDE_COMMENT": {
        const idToHide = targetId || reportId;
        if (!idToHide) return NextResponse.json({ error: "Target comment ID diperlukan." }, { status: 400 });
        await reportRepository.hideContent("COMMENT", idToHide);
        if (targetUserId) {
          await userRepository.recordModerationLog({
            adminId: admin.id,
            targetUserId,
            action: "HIDE_COMMENT",
            reason: cleanReason,
            reportId,
            metadata: { targetId: idToHide },
          });
        }
        break;
      }

      case "DELETE_POST": {
        const idToDelete = targetId || reportId;
        if (!idToDelete) return NextResponse.json({ error: "Target post ID diperlukan." }, { status: 400 });
        await reportRepository.deleteContent("POST", idToDelete);
        if (targetUserId) {
          await userRepository.recordModerationLog({
            adminId: admin.id,
            targetUserId,
            action: "DELETE_POST",
            reason: cleanReason,
            reportId,
            metadata: { targetId: idToDelete },
          });
        }
        break;
      }

      case "DELETE_COMMENT": {
        const idToDelete = targetId || reportId;
        if (!idToDelete) return NextResponse.json({ error: "Target comment ID diperlukan." }, { status: 400 });
        await reportRepository.deleteContent("COMMENT", idToDelete);
        if (targetUserId) {
          await userRepository.recordModerationLog({
            adminId: admin.id,
            targetUserId,
            action: "DELETE_COMMENT",
            reason: cleanReason,
            reportId,
            metadata: { targetId: idToDelete },
          });
        }
        break;
      }

      case "SUSPEND": {
        if (!targetUserId) return NextResponse.json({ error: "Target user ID diperlukan." }, { status: 400 });
        const days = Math.max(1, Number(durationDays) || 7);
        actionResult = await userRepository.suspendUser(targetUserId, days, cleanReason, admin.id, reportId);
        break;
      }

      case "BAN": {
        if (!targetUserId) return NextResponse.json({ error: "Target user ID diperlukan." }, { status: 400 });
        actionResult = await userRepository.banUser(targetUserId, cleanReason, admin.id, reportId);
        // Sembunyikan semua postingan dan komentar pengguna yang diblokir permanen
        try {
          await communityDb.communityPost.updateMany({
            where: { userId: targetUserId },
            data: { isHidden: true },
          });
          await communityDb.communityComment.updateMany({
            where: { userId: targetUserId },
            data: { isHidden: true },
          });
        } catch (dbErr) {
          console.warn("[BAN] Gagal menyembunyikan postingan/komentar user:", dbErr);
        }
        break;
      }

      case "LIFT_RESTRICTION": {
        if (!targetUserId) return NextResponse.json({ error: "Target user ID diperlukan." }, { status: 400 });
        actionResult = await userRepository.liftRestrictions(targetUserId, admin.id, cleanReason);
        // Pulihkan postingan dan komentar pengguna yang sebelumnya diblokir
        try {
          await communityDb.communityPost.updateMany({
            where: { userId: targetUserId },
            data: { isHidden: false },
          });
          await communityDb.communityComment.updateMany({
            where: { userId: targetUserId },
            data: { isHidden: false },
          });
        } catch (dbErr) {
          console.warn("[LIFT_RESTRICTION] Gagal memulihkan postingan/komentar user:", dbErr);
        }
        break;
      }

      case "DISMISS_REPORT": {
        if (!reportId) return NextResponse.json({ error: "Report ID diperlukan untuk menolak laporan." }, { status: 400 });
        await reportRepository.updateReport(reportId, "DISMISSED", admin.id, cleanReason);
        if (targetUserId) {
          await userRepository.recordModerationLog({
            adminId: admin.id,
            targetUserId,
            action: "DISMISS_REPORT",
            reason: cleanReason,
            reportId,
          });
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Action '${action}' tidak dikenali.` }, { status: 400 });
    }

    // Jika ini pemrosesan dari laporan dan bukan DISMISS, tandai laporan sebagai ACTION_TAKEN
    if (reportId && action !== "DISMISS_REPORT") {
      await reportRepository.updateReport(
        reportId,
        "ACTION_TAKEN",
        admin.id,
        `${action}: ${cleanReason}`
      );
    }

    // Invalidate community cache agar post/comment yang di-hide langsung lenyap dari feed
    invalidateCommunityCache();

    return NextResponse.json({
      success: true,
      action,
      message: `Tindakan moderasi '${action}' berhasil dijalankan oleh ${admin.name}.`,
      result: actionResult,
    });
  } catch (error: any) {
    console.error("[Admin Moderation Action Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menjalankan tindakan moderasi." },
      { status: 500 }
    );
  }
}
