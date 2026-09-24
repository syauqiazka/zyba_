import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import {
  userRepository,
  computeStreak,
} from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import { accountDb } from "@/backend/db/accountClient";
import {
  calculateZybaScore,
  scoreToCondition,
} from "@/backend/scoring/zybaScore";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      console.log("[/api/user/me] No token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      console.log("[/api/user/me] Invalid session");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user =
      (await userRepository.findById(session.userId)) ||
      (await userRepository.findByEmail(session.email));

    if (!user) {
      console.log("[/api/user/me] User not found:", session.userId, session.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestAssessment = await userRepository.getLatestAssessment(user.id);
    const hasAssessment = Boolean(latestAssessment || (user.zybaScore !== null && user.zybaScore !== undefined));

    let zybaScore: number | null = null;
    let condition = "Belum Dinilai";

    if (hasAssessment) {
      // D.2: Calculate Zyba Score on-demand from 7-day rolling window
      // (Mental 50% + Fisik 25% + Sosial 25%) — falls back to static score if fails
      try {
        const dynamicScore = await calculateZybaScore(user.id);
        zybaScore = dynamicScore;
        condition = scoreToCondition(dynamicScore);
        // Update stored score so it reflects the latest calculation
        if (user.zybaScore !== dynamicScore) {
          accountDb.user.update({
            where: { id: user.id },
            data: { zybaScore: dynamicScore },
          }).catch(() => { }); // fire-and-forget, don't block response
        }
      } catch {
        // Graceful fallback to static stored score
        zybaScore = user.zybaScore ?? latestAssessment?.calculatedScore ?? null;
        if (zybaScore !== null) condition = scoreToCondition(zybaScore);
      }
    }

    const stressLabels: Record<number, string> = {
      1: "Level 1 - Sangat Rendah",
      2: "Level 2 - Rendah",
      3: "Level 3 - Sedang",
      4: "Level 4 - Tinggi",
      5: "Level 5 - Sangat Tinggi",
    };

    const rawStress = user.stressLevel ?? latestAssessment?.stressLevel ?? null;
    const stressLevel = hasAssessment && rawStress !== null ? rawStress : null;
    const stressLabel = stressLevel !== null ? (stressLabels[stressLevel] || `Level ${stressLevel}`) : "Belum Ada Data";

    // Compute streak dynamically from createdAt date
    const dynamicStreak = computeStreak(user.createdAt);

    // Check active subscription for plan status
    const activeSubscription = await accountDb.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    // Auto-expire subscriptions past endDate
    const expiredSubscriptions = await accountDb.subscription.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: { lt: new Date() },
      },
    });

    if (expiredSubscriptions.length > 0) {
      await accountDb.subscription.updateMany({
        where: {
          userId: user.id,
          status: "ACTIVE",
          endDate: { lt: new Date() },
        },
        data: { status: "EXPIRED" },
      });

      // Downgrade user plan if no active subscription
      if (!activeSubscription) {
        await accountDb.user.update({
          where: { id: user.id },
          data: { plan: "FREE" },
        });
      }
    }

    const plan = activeSubscription?.plan === "PLUS" ? "PLUS" : "FREE";

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username || null,
        bio: user.bio || null,
        avatarUrl: resolveAvatar(user.avatarUrl),
        avatarKey: user.avatarUrl || "fox",
        plan,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      },
      stats: {
        zybaScore,
        hasAssessment,
        condition,
        stressLevel,
        stressLabel,
        streak: dynamicStreak,
        assessment: latestAssessment,
      },
    });
  } catch (error) {
    console.error("Fetch user me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio } = body;

    // Validate name if provided
    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio.trim() || null;

    // Validate username if provided
    if (username !== undefined) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (cleanUsername) {
        const existing = await accountDb.user.findFirst({
          where: {
            username: cleanUsername,
            NOT: { id: session.userId },
          },
        });
        if (existing) {
          return NextResponse.json({ error: "Username sudah digunakan orang lain" }, { status: 409 });
        }
        updateData.username = cleanUsername;
      }
    }

    const updatedUser = await accountDb.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username || null,
        bio: updatedUser.bio || null,
        avatarUrl: resolveAvatar(updatedUser.avatarUrl),
      },
    });
  } catch (err: any) {
    console.error("Update user me error:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}

