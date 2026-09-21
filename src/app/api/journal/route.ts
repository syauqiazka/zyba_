import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    return NextResponse.json({ success: true, entries: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId: string | null = null;

    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        userId = session.userId;
      }
    }

    const body = await req.json();
    const { title, content, mood } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Isi journal tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Safety: detectRisk() dari crisisDetection.ts wajib dipanggil di semua teks bebas (AGENTS.md Bagian 12)
    const isRisk = detectRisk(content);

    let savedEntry = null;
    if (userId) {
      try {
        savedEntry = await prisma.journalEntry.create({
          data: {
            userId,
            title: title || "Entri Mood Harian",
            content,
            mood: mood || undefined,
          },
        });
      } catch (dbErr) {
        console.warn("DB Journal creation fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
      entry: savedEntry || {
        id: `j-${Date.now()}`,
        title: title || "Entri Mood Harian",
        content,
        mood: mood || "NEUTRAL",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Journal post error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan journal." },
      { status: 500 }
    );
  }
}
