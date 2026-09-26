import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken, createSessionToken } from "@/lib/auth";
import { userRepository } from "@/backend/auth/userRepository";
import { accountDb } from "@/backend/db/accountClient";

// Kalkulator Skor ZYBA berbasis data riil kuisioner (0 - 100)
function calculateZybaScore(data: {
  mood?: string;
  sleepRating?: number;
  stressRating?: number;
  physicalSymptoms?: string[];
  mentalSymptoms?: string[];
}): { score: number; stressLevel: number; condition: string } {
  let score = 50; // Nilai dasar

  const mood = (data.mood || "").toUpperCase();
  if (mood === "OVERJOYED") score += 20;
  else if (mood === "HAPPY") score += 12;
  else if (mood === "NEUTRAL") score += 0;
  else if (mood === "SAD") score -= 12;
  else if (mood === "DEPRESSED") score -= 22;

  const sleep = Number(data.sleepRating) || 3;
  if (sleep === 5) score += 15;
  else if (sleep === 4) score += 10;
  else if (sleep === 3) score += 2;
  else if (sleep === 2) score -= 8;
  else if (sleep === 1) score -= 16;

  const stress = Number(data.stressRating) || 3;
  if (stress === 1) score += 15;
  else if (stress === 2) score += 8;
  else if (stress === 3) score += 0;
  else if (stress === 4) score -= 10;
  else if (stress === 5) score -= 20;

  const physCount = data.physicalSymptoms?.length || 0;
  if (physCount === 0) score += 5;
  else if (physCount <= 2) score -= 5;
  else score -= Math.min(physCount * 3, 15);

  const mentCount = data.mentalSymptoms?.length || 0;
  if (mentCount === 0) score += 5;
  else if (mentCount <= 2) score -= 6;
  else score -= Math.min(mentCount * 4, 18);

  const finalScore = Math.max(20, Math.min(98, Math.round(score)));

  let condition = "Perlu Perhatian";
  if (finalScore >= 80) condition = "Kondisi Baik";
  else if (finalScore >= 60) condition = "Cukup Baik";

  return { score: finalScore, stressLevel: stress, condition };
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId = "user_demo_alex";
    let sessionData = null;

    if (token) {
      const session = await verifySessionToken(token);
      if (session?.userId) {
        userId = session.userId;
        sessionData = session;
      }
    }

    const body = await req.json();
    const {
      goal,
      gender,
      age,
      weight,
      mood,
      soughtHelp,
      physicalSymptoms,
      sleepRating,
      stressRating,
      medications,
      mentalSymptoms,
      expressionText,
    } = body;

    // Safety: Deteksi risiko bahaya diri dari refleksi bebas (AGENTS.md Bagian 12)
    const isRisk = expressionText ? detectRisk(expressionText) : false;

    // Kalkulasi skor dinamis dari jawaban kuesioner pengguna
    const { score, stressLevel, condition } = calculateZybaScore({
      mood,
      sleepRating,
      stressRating,
      physicalSymptoms,
      mentalSymptoms,
    });

    // Simpan hasil asesmen ke user profile
    await userRepository.saveAssessment(
      userId,
      {
        goal,
        gender,
        age,
        weight,
        mood,
        soughtHelp,
        physicalSymptoms,
        sleepRating,
        stressRating,
        medications,
        mentalSymptoms,
        expressionText,
      },
      score,
      stressLevel
    );

    // ✅ Simpan zybaScore & stressLevel serta tandai onboardingCompleted = true di user record
    const updated = await userRepository.update(userId, {
      zybaScore: score,
      stressLevel,
      onboardingCompleted: true,
    });
    if (!updated) {
      console.error("[/api/assessment] Failed to update onboardingCompleted for user:", userId);
      return NextResponse.json({ error: "Gagal menyimpan status assessment ke database" }, { status: 500 });
    }
    console.log("[/api/assessment] onboardingCompleted & zybaScore set for user:", userId, score);

    // Sinkronkan juga ke daily assessment hari ini agar dashboard langsung konsisten
    const todayDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    try {
      await accountDb.dailyAssessment.upsert({
        where: { userId_date: { userId, date: todayDate } },
        create: {
          userId,
          date: todayDate,
          mood: (mood || "HAPPY").toUpperCase() as any,
          stressLevel,
          sleepRating: sleepRating ? Number(sleepRating) : 3,
          energyTags: ["Asesmen Awal"],
          reflection: expressionText || "Asesmen Awal ZYBA",
          calculatedScore: score,
        },
        update: {
          calculatedScore: score,
          stressLevel,
          mood: (mood || "HAPPY").toUpperCase() as any,
        },
      });
    } catch (e: any) {
      console.warn("[/api/assessment] Daily sync warning:", e.message);
    }

    const response = NextResponse.json({
      success: true,
      zybaScore: score,
      stressLevel,
      condition,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
      message: "Hasil asesmen berhasil dianalisis dan disimpan.",
    });

    // ✅ Re-issue JWT dengan onboardingCompleted = true agar middleware
    //    langsung unlock semua halaman tanpa harus login ulang
    if (sessionData) {
      const newToken = await createSessionToken({
        userId: sessionData.userId,
        email: sessionData.email,
        name: sessionData.name,
        onboardingCompleted: true,
      });
      response.cookies.set("auth-token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (err: any) {
    console.error("Assessment save error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
