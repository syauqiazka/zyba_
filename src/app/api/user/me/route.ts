import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { userRepository, computeStreak } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import { accountDb } from "@/backend/db/accountClient";

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
      zybaScore = user.zybaScore ?? latestAssessment?.calculatedScore ?? null;
      if (zybaScore !== null) {
        if (zybaScore >= 80) condition = "Kondisi Baik";
        else if (zybaScore >= 60) condition = "Cukup Baik";
        else condition = "Perlu Perhatian";
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
