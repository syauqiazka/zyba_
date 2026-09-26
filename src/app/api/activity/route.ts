import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { checkAndUnlock } from "@/lib/achievements/engine";

function getJakartaDateStr(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session?.userId) {
      return { userId: session.userId, email: session.email, name: session.name };
    }
  }

  // Fallback to first user for dev/demo
  const user = await accountDb.user.findFirst({
    select: { id: true, email: true, name: true },
  });

  return user ? { userId: user.id, email: user.email, name: user.name } : null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayDate = getJakartaDateStr();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Fetch related wellness data from DB
    const [dailyAssessment, onboardingAssessment, latestMood, todayActivities] = await Promise.all([
      accountDb.dailyAssessment.findUnique({
        where: { userId_date: { userId: user.userId, date: todayDate } },
      }),
      accountDb.assessment.findUnique({
        where: { userId: user.userId },
      }),
      accountDb.moodEntry.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      }),
      accountDb.activityLog.findMany({
        where: {
          userId: user.userId,
          createdAt: { gte: todayStart },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Resolved metrics
    const resolvedMood = dailyAssessment?.mood || latestMood?.mood || onboardingAssessment?.initialMood || "NEUTRAL";
    const resolvedSleep = dailyAssessment?.sleepRating ?? onboardingAssessment?.sleepQualityRating ?? 3;
    const resolvedStress = dailyAssessment?.stressLevel ?? latestMood?.stressLevel ?? onboardingAssessment?.stressLevel ?? 3;

    // Sleep formatted
    const sleepHoursMap: Record<number, string> = {
      1: "4.5h",
      2: "5.5h",
      3: "6.8h",
      4: "7.5h",
      5: "8.2h",
    };
    const sleepHours = sleepHoursMap[resolvedSleep] || "6.5h";

    // Mood label
    const moodMap: Record<string, string> = {
      OVERJOYED: "Sangat Baik",
      HAPPY: "Senang",
      NEUTRAL: "Cukup",
      SAD: "Kurang Baik",
      DEPRESSED: "Perlu Support",
    };
    const moodLabel = moodMap[resolvedMood] || "Cukup";

    // Focus / Stress label
    let focusLabel = "Sedang";
    if (resolvedStress <= 2) focusLabel = "Fokus Baik";
    else if (resolvedStress >= 4) focusLabel = "Perlu Rehat";

    // Overall energy and badge
    let energyTitle = "Energi Sedang";
    let badgeText = "Kondisi Seimbang";
    let badgeColor: "green" | "orange" | "amber" = "green";
    let insight = "Kondisimu cukup stabil hari ini. Awali dengan peregangan ringan dan selesaikan target aktivitas secara bertahap.";

    if (resolvedStress >= 4 || resolvedSleep <= 2 || resolvedMood === "DEPRESSED" || resolvedMood === "SAD") {
      energyTitle = "Energi Rendah";
      badgeText = "Recovery Perlu Dijaga";
      badgeColor = "orange";
      insight = "Tingkat energimu sedang butuh jeda. Prioritaskan latihan pernapasan Zyba Hours dan jalan santai ringan sebelum beban berat.";
    } else if (resolvedStress <= 2 && (resolvedMood === "HAPPY" || resolvedMood === "OVERJOYED") && resolvedSleep >= 3) {
      energyTitle = "Energi Prima";
      badgeText = "Kondisi Prima";
      badgeColor = "green";
      insight = "Stamina fisik dan mentalmu sedang sangat optimal! Manfaatkan momentum ini untuk latihan fisik atau jalan cepat hari ini.";
    }

    // Points earned today from activities
    const totalPointsEarned = todayActivities
      .filter((a) => a.completed)
      .reduce((sum, a) => {
        let pts = 40;
        if (a.type === "WALKING") pts = 50;
        if (a.type === "RUNNING") pts = 80;
        if (a.type === "WORKOUT") pts = 60;
        if (a.type === "BREATHING") pts = 30;
        return sum + pts;
      }, 0);

    return NextResponse.json({
      success: true,
      condition: {
        energyTitle,
        badgeText,
        badgeColor,
        sleepHours,
        moodLabel,
        focusLabel,
        insight,
        hasCheckedInToday: Boolean(dailyAssessment || (latestMood && new Date(latestMood.createdAt).toDateString() === new Date().toDateString())),
        stressLevel: resolvedStress,
        sleepRating: resolvedSleep,
      },
      todayActivities,
      totalPointsEarned,
      completedCount: todayActivities.filter((a) => a.completed).length,
    });
  } catch (error: any) {
    console.error("[Activity API GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, durationMin, distanceMeter, targetMin, completed = true, title } = body;

    // Optional crisis text detection if title is custom
    if (title && typeof title === "string") {
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
    }

    // Validate type
    const validTypes = ["WALKING", "RUNNING", "WORKOUT", "BREATHING", "SLEEP"];
    const resolvedType = validTypes.includes(type) ? type : "WALKING";

    // Save to ActivityLog in database
    const activity = await accountDb.activityLog.create({
      data: {
        userId: user.userId,
        type: resolvedType,
        durationMin: durationMin ? Number(durationMin) : 10,
        distanceMeter: distanceMeter ? Number(distanceMeter) : null,
        targetMin: targetMin ? Number(targetMin) : null,
        completed: Boolean(completed),
      },
    });

    // Check achievement for activity completion
    let unlockedAchievements: string[] = [];
    if (completed) {
      try {
        const totalCompleted = await accountDb.activityLog.count({
          where: { userId: user.userId, completed: true },
        });
        unlockedAchievements = await checkAndUnlock(user.userId, {
          type: "activity_complete",
          activityCount: totalCompleted,
        });
      } catch (err) {
        console.warn("[Activity Achievement] Check error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      activity,
      unlockedAchievements,
    });
  } catch (error: any) {
    console.error("[Activity API POST] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menyimpan aktivitas." },
      { status: 500 }
    );
  }
}
