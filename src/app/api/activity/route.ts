import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId: string | null = null;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) userId = session.userId;
    }

    return NextResponse.json({
      success: true,
      userId,
      message: "Activity API ready",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId: string | null = null;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) userId = session.userId;
    }

    const body = await req.json();
    const { title, time, duration, category, icon, points } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Nama aktivitas tidak boleh kosong." },
        { status: 400 }
      );
    }

    const isRisk = detectRisk(title);
    if (isRisk) {
      return NextResponse.json(
        {
          error: "Aktivitas mengandung teks yang membutuhkan bantuan segera.",
          isRisk: true,
          crisisResources: CRISIS_RESOURCES,
        },
        { status: 400 }
      );
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      time: time || "12:00",
      duration: duration || "15 min",
      category: category || "Aktivitas Ringan",
      icon: icon || "🚶",
      points: Number(points) || 50,
      completed: false,
      userId: userId || "guest",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      activity: newActivity,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal menambahkan aktivitas." },
      { status: 500 }
    );
  }
}
