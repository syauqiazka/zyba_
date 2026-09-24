import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

async function getCurrentUserId(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session?.userId) return session.userId;
  }
  const user = await accountDb.user.findFirst({ select: { id: true } });
  if (!user) throw new Error("No user found.");
  return user.id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mood, note, stressLevel } = body as { mood: string; note?: string; stressLevel?: number };
    if (!mood) return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
    
    const userId = await getCurrentUserId(req);

    // Cek apakah hari ini sudah pernah check-in mood
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const existingToday = await accountDb.moodEntry.findFirst({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    });

    if (existingToday) {
      return NextResponse.json(
        {
          error: "Kamu sudah melakukan Mood Check-In hari ini. Evaluasi hanya dapat dilakukan 1 kali per hari.",
          hasCheckedInToday: true,
          entry: existingToday,
        },
        { status: 400 }
      );
    }

    const entry = await accountDb.moodEntry.create({
      data: { userId, mood: mood as any, note, stressLevel: stressLevel ? Number(stressLevel) : undefined },
    });
    const risk = note ? detectRisk(note) : false;
    return NextResponse.json({ success: true, entry, risk, crisisResources: risk ? CRISIS_RESOURCES : null });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan mood entry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const entries = await accountDb.moodEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 });
    
    // Cek apakah ada check-in hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEntry = entries.find((e) => new Date(e.createdAt) >= todayStart) || null;

    return NextResponse.json({
      entries,
      hasCheckedInToday: !!todayEntry,
      todayEntry,
    });
  } catch {
    return NextResponse.json({ entries: [], hasCheckedInToday: false, todayEntry: null });
  }
}
