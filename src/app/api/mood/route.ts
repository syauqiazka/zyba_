import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

async function getCurrentUserId(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session?.userId) return session.userId;
  }
  const user = await prisma.user.findFirst({ select: { id: true } });
  if (!user) throw new Error("No user found — seed database dulu.");
  return user.id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mood, note, stressLevel } = body as {
      mood: string;
      note?: string;
      stressLevel?: number;
    };

    if (!mood) {
      return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
    }

    const userId = await getCurrentUserId(req);

    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        mood: mood as any,
        note,
        stressLevel: stressLevel ? Number(stressLevel) : undefined,
      },
    });

    const risk = note ? detectRisk(note) : false;

    return NextResponse.json({
      success: true,
      entry,
      risk,
      crisisResources: risk ? CRISIS_RESOURCES : null,
    });
  } catch (error: any) {
    console.error("Mood check-in save error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menyimpan mood entry" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ entries: [] });
  }
}
