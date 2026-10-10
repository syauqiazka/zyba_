import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { userRepository, computeStreak } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import { accountDb } from "@/backend/db/accountClient";
import { scoreToCondition } from "@/backend/scoring/zybaScore";
import bcrypt from "bcryptjs";
import {
  getUserMeCache,
  setUserMeCache,
  invalidateUserMeCache,
} from "@/lib/server/userMeCache";
import { invalidateUserPlanCache } from "@/backend/billing/entitlements";
// =====================================================
// FAST IN-MEMORY CACHE (TTL 6s)
// Mengeliminasi 20+ query redundan saat banyak komponen
// memanggil /api/user/me bersamaan pada load halaman.
// =====================================================


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Cek cache terlebih dahulu
    const cached = getUserMeCache(session.userId);

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        },
      });
    }

    // Pastikan user ada di DB atau auto-restore dari session jika DB baru di-switch/reset
const user = await userRepository.resolveUserForSession(
  session.userId,
  session.email,
  session.name || undefined
);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // =================================================
    // PARALEL QUERY OPTIMIZATION
    // Menjalankan semua data pendukung secara paralel
    // =================================================
    // Wrap in try-catch: local-fallback users (user_TIMESTAMP_xxx) don't exist in Neon,
    // so these queries will throw. We must not crash — return nulls/empty arrays instead.
    const [latestDaily, activeSubscription, expiredSubscription, initialAssessment] =
  await Promise.all([
    accountDb.dailyAssessment.findFirst({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }).catch(() => null),

    accountDb.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => null),

    accountDb.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: { lt: new Date() },
      },
      select: {
        id: true,
      },
    }).catch(() => null),

    userRepository.getLatestAssessment(user.id),
  ]);

    // =================================================
    // SCORE & CONDITION
    // =================================================
    const dailyScore = latestDaily?.calculatedScore;
    const dailyTime = latestDaily?.createdAt ? new Date(latestDaily.createdAt).getTime() : 0;
    const initialTime = initialAssessment?.createdAt ? new Date(initialAssessment.createdAt).getTime() : 0;

    let zybaScore = user.zybaScore ?? null;

    if (latestDaily && dailyTime > initialTime && dailyScore !== null && dailyScore !== undefined) {
      zybaScore = dailyScore;
    } else if (user.zybaScore !== null && user.zybaScore !== undefined) {
      zybaScore = user.zybaScore;
    } else if (dailyScore !== null && dailyScore !== undefined) {
      zybaScore = dailyScore;
    }

    const condition =
      zybaScore !== null ? scoreToCondition(zybaScore) : "Belum Dinilai";

    const hasAssessment = Boolean(latestDaily || initialAssessment || zybaScore !== null);

    // =================================================
    // STRESS
    // =================================================
    const stressLabels: Record<number, string> = {
      1: "Level 1 - Sangat Rendah",
      2: "Level 2 - Rendah",
      3: "Level 3 - Sedang",
      4: "Level 4 - Tinggi",
      5: "Level 5 - Sangat Tinggi",
    };

    const rawStress =
      latestDaily && dailyTime > initialTime && latestDaily.stressLevel !== null
        ? latestDaily.stressLevel
        : user.stressLevel ?? latestDaily?.stressLevel ?? null;
    const stressLevel = rawStress !== null ? Number(rawStress) : null;
    const stressLabel =
      stressLevel !== null
        ? stressLabels[stressLevel] || `Level ${stressLevel}`
        : "Belum Ada Data";

    const dynamicStreak = computeStreak(user.createdAt);

    // =================================================
    // SUBSCRIPTION STATUS
    // =================================================
if (expiredSubscription) {      // Background async update, tidak perlu memblokir response
      accountDb.subscription
        .updateMany({
          where: {
            userId: user.id,
            status: "ACTIVE",
            endDate: { lt: new Date() },
          },
          data: { status: "EXPIRED" },
        })
        .catch((e) => console.error("Update expired sub error:", e));

      if (!activeSubscription) {
        accountDb.user
          .update({
            where: { id: user.id },
            data: { plan: "FREE" },
          })
          .then(() => {
            invalidateUserPlanCache(user.id);
            invalidateUserMeCache(user.id);
          })
          .catch((e) =>
            console.error("Update user plan error:", e)
          );
      }
    }

    const plan = activeSubscription?.plan === "PLUS" ? "PLUS" : "FREE";

    const responseData = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        avatarUrl: user.avatarUrl,
        // Plan berasal dari subscription ACTIVE yang tervalidasi di DB.
        // Jangan gunakan nilai client/localStorage sebagai sumber kebenaran.
        plan,
        role: user.role || "USER",
        isAdmin: user.role === "ADMIN" || (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map(e => e.trim()).includes(user.email.toLowerCase()),
        isSuspended: Boolean(user.isSuspended),
        suspendedUntil: user.suspendedUntil || null,
        isBanned: Boolean(user.isBanned),
        banReason: (user as any).banReason || null,
        warningCount: user.warningCount || 0,
        onboardingCompleted: user.onboardingCompleted,

        // Terms & Agreement
        termsAcceptedAt: user.termsAcceptedAt,
        termsVersion: user.termsVersion,

        createdAt: user.createdAt,
      },
      stats: {
        zybaScore,
        hasAssessment,
        condition,
        stressLevel,
        stressLabel,
        streak: dynamicStreak,
        assessment: initialAssessment,
        latestDailyAssessment: latestDaily,
        premiumUntil: activeSubscription?.endDate ?? null,
      },
      subscription: activeSubscription
        ? {
            id: activeSubscription.id,
            plan: activeSubscription.plan,
            status: activeSubscription.status,
            startDate: activeSubscription.startDate,
            endDate: activeSubscription.endDate,
          }
        : null,
    };

    // Simpan ke fast cache
setUserMeCache(
  session.userId,
  responseData
);

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Fetch user me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =====================================================
// PATCH PROFILE
// =====================================================
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
    const { name, username, bio, phone, location, password, avatarUrl } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    // Auto-migrate local-fallback users to DB before any DB write
    const migrated = await userRepository.ensureUserExistsInNeon(
      session.userId,
      session.email,
      session.name || undefined
    );
    const neonUserId = migrated?.neonId ?? session.userId;

    const updateData: any = {};

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim() || null;
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim() || null;
    }

    if (location !== undefined) {
      updateData.location = location.trim() || null;
    }

    if (password !== undefined && password.trim()) {
      updateData.passwordHash = await bcrypt.hash(password.trim(), 12);
    }

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
          return NextResponse.json(
            { error: "Username sudah digunakan oleh akun lain." },
            { status: 409 }
          );
        }

        updateData.username = cleanUsername;
      }
    }

    const updatedUser = await accountDb.user.update({
      where: { id: neonUserId },
      data: updateData,
    });

    // Invalidate cache for both old and new IDs
invalidateUserMeCache(session.userId);
    if (neonUserId !== session.userId) invalidateUserMeCache(neonUserId);;


    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        location: updatedUser.location,
        avatarUrl: updatedUser.avatarUrl || "🦊",
      },
    });
  } catch (error: any) {
    console.error("Update user me error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;