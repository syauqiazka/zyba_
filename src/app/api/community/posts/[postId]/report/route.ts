import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    if (!postId) {
      return NextResponse.json({ error: "Post ID diperlukan" }, { status: 400 });
    }

    let reporterId: string | null = null;
    const token = req.cookies.get("auth-token")?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        reporterId = session.userId;
      }
    }

    const body = await req.json().catch(() => ({}));
    const { reason = "other", details = "" } = body;

    // Log the report for moderation audit
    console.info(`[COMMUNITY_REPORT] Post: ${postId}, Reason: ${reason}, Reporter: ${reporterId || "anonymous"}, Details: ${details}`);

    const isCrisis = reason === "self_harm";

    return NextResponse.json({
      success: true,
      isCrisis,
      message: isCrisis
        ? "Laporan telah dicatat. Jika ini situasi darurat atau ada ancaman melukai diri, mohon hubungi layanan bantuan darurat."
        : "Terima kasih, laporan Anda telah diterima dan akan ditinjau oleh tim moderator ZYBA.",
    });
  } catch (error: any) {
    console.error("[Report API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim laporan" },
      { status: 500 }
    );
  }
}
