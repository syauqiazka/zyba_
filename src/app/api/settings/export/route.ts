import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session) return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });
    const uid = session.userId;

    const exportLimit = await checkRateLimit(`export:${uid}`, 5, 300);
    if (!exportLimit.allowed) {
      return rateLimitResponse(exportLimit.retryAfterSec, "Permintaan ekspor data terlalu sering. Silakan tunggu.");
    }

    const [user, moodEntries, journalEntries, activities, assessment, conversations, posts] = await Promise.all([
      accountDb.user.findUnique({ where: { id: uid }, select: { id: true, name: true, email: true, createdAt: true } }),
      accountDb.moodEntry.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" } }),
      accountDb.journalEntry.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" } }),
      accountDb.activityLog.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" } }),
      accountDb.assessment.findUnique({ where: { userId: uid } }),
      companionDb.conversation.findMany({ where: { userId: uid }, include: { messages: true } }),
      communityDb.communityPost.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" } }),
    ]);

    const exportData = { exportedAt: new Date().toISOString(), user, assessment, moodEntries, journalEntries, activities, conversations, communityPosts: posts };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="zyba-data-${uid}-${Date.now()}.json"`,
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("[Settings Export Error]:", err);
    return NextResponse.json({ error: "Gagal mengekspor data pengguna." }, { status: 500 });
  }
}
