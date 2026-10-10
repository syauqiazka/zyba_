import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { reportRepository } from "@/backend/community/reportRepository";
import { CRISIS_RESOURCES } from "@/lib/crisisDetection";

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const commentId = params.commentId;
    if (!commentId) {
      return NextResponse.json({ error: "Comment ID diperlukan" }, { status: 400 });
    }

    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Silakan masuk untuk melaporkan komentar." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid. Silakan masuk kembali." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { reason = "other", details = "" } = body;

    const result = await reportRepository.createReport({
      reporterId: session.userId,
      targetType: "COMMENT",
      targetId: commentId,
      reason: String(reason).trim(),
      details: typeof details === "string" ? details.trim() : undefined,
    });

    if (!result.success && !result.alreadyReported) {
      return NextResponse.json({ error: result.error || "Gagal mengirim laporan." }, { status: 400 });
    }

    const isCrisis = reason === "self_harm";

    return NextResponse.json({
      success: true,
      alreadyReported: Boolean(result.alreadyReported),
      isCrisis,
      crisisResources: isCrisis ? CRISIS_RESOURCES : null,
      message: result.alreadyReported
        ? "Anda sudah melaporkan komentar ini sebelumnya. Tim moderator sedang meninjaunya."
        : isCrisis
        ? "Laporan telah dicatat dengan prioritas darurat. Jika Anda atau seseorang dalam bahaya, mohon hubungi hotline krisis."
        : "Terima kasih, laporan komentar Anda telah diterima dan akan ditinjau oleh tim moderator ZYBA.",
    });
  } catch (error: any) {
    console.error("[Comment Report API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim laporan komentar" },
      { status: 500 }
    );
  }
}
