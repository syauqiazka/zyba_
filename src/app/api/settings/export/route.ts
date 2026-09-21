import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session) return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });
    const uid = session.userId;

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
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
