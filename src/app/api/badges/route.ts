/**
 * GET  /api/badges — get user's pinned badge slots (0-2)
 * POST /api/badges — set a badge in a slot { slot, badgeKey, customLabel? }
 * DELETE /api/badges?slot=N — clear a slot
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { slot: "asc" },
    });

    return NextResponse.json({ badges });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slot, badgeKey, customLabel } = await request.json();

    if (typeof slot !== "number" || slot < 0 || slot > 2) {
      return NextResponse.json({ error: "Invalid slot (0–2)" }, { status: 400 });
    }

    // Verify user has unlocked this achievement
    const achievement = await prisma.achievement.findUnique({ where: { key: badgeKey } });
    if (!achievement) return NextResponse.json({ error: "Badge tidak ditemukan" }, { status: 404 });

    const unlocked = await prisma.userAchievement.findFirst({
      where: { userId, achievementId: achievement.id },
    });
    if (!unlocked) {
      return NextResponse.json(
        { error: "Achievement belum di-unlock" },
        { status: 403 }
      );
    }

    const badge = await prisma.userBadge.upsert({
      where: { userId_slot: { userId, slot } },
      update: { badgeKey, customLabel: customLabel ?? null },
      create: { userId, slot, badgeKey, customLabel: customLabel ?? null },
    });

    return NextResponse.json({ badge });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const slot = parseInt(searchParams.get("slot") ?? "");

    if (isNaN(slot) || slot < 0 || slot > 2) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    await prisma.userBadge.deleteMany({ where: { userId, slot } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
