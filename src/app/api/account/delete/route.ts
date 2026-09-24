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
    /* =====================================================
       AUTH
    ===================================================== */

    const token =
      req.cookies.get("auth-token")?.value;

    if (!token) {
      console.log("[/api/user/me] No token");

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session =
      await verifySessionToken(token);

    if (!session) {
      console.log(
        "[/api/user/me] Invalid session"
      );

      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    /* =====================================================
       USER
    ===================================================== */

    const user =
      (await userRepository.findById(
        session.userId
      )) ||
      (await userRepository.findByEmail(
        session.email
      ));

    if (!user) {
      console.log(
        "[/api/user/me] User not found:",
        session.userId,
        session.email
      );

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =====================================================
       ASSESSMENT AWAL + DAILY ASSESSMENT

       Assessment:
       /assessment

       Daily:
       /assessment/daily
    ===================================================== */

    const [
      initialAssessment,
      dailyAssessments,
    ] = await Promise.all([
      accountDb.assessment.findUnique({
        where: {
          userId: user.id,
        },
      }),

      accountDb.dailyAssessment.findMany({
        where: {
          userId: user.id,
        },

        orderBy: [
          {
            date: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        take: 31,
      }),
    ]);

    /* =====================================================
       STATUS ASSESSMENT

       Kalau salah satu ada:
       - Assessment awal
       - Daily Assessment
       - zybaScore

       maka user sudah pernah assessment.
    ===================================================== */

    const hasInitialAssessment =
      Boolean(initialAssessment);

    const hasDailyAssessment =
      dailyAssessments.length > 0;

    const hasAssessment =
      hasInitialAssessment ||
      hasDailyAssessment ||
      user.zybaScore !== null;

    /*
     * Sesuai struktur aplikasi:
     *
     * Akun baru:
     *   Assessment awal + Daily
     *
     * Akun lama:
     *   Daily saja
     *
     * Karena schema belum punya field khusus
     * "accountType", presence initialAssessment
     * dipakai sebagai penanda sumber awal.
     */
    const isNewAccount =
      hasInitialAssessment;

    /* =====================================================
       ZYBA SCORE
    ===================================================== */

    let zybaScore: number | null =
      null;

    let condition =
      "Belum Dinilai";

    if (hasAssessment) {
      try {
        /*
         * Perhitungan tetap menggunakan service
         * Zyba Score yang sudah ada.
         */
        const dynamicScore =
          await calculateZybaScore(
            user.id
          );

        zybaScore =
          dynamicScore;

        condition =
          scoreToCondition(
            dynamicScore
          );

        /*
         * Simpan score terbaru ke users.
         */
        if (
          user.zybaScore !==
          dynamicScore
        ) {
          accountDb.user
            .update({
              where: {
                id: user.id,
              },
              data: {
                zybaScore:
                  dynamicScore,
              },
            })
            .catch((error) => {
              console.error(
                "[/api/user/me] Failed to update zybaScore:",
                error
              );
            });
        }
      } catch (error) {
        console.error(
          "[/api/user/me] Failed to calculate Zyba Score:",
          error
        );

        /*
         * Fallback ke score yang tersimpan
         * di User.
         */
        zybaScore =
          user.zybaScore ??
          null;

        if (
          zybaScore !== null
        ) {
          condition =
            scoreToCondition(
              zybaScore
            );
        }
      }
    }

    /* =====================================================
       STRESS LEVEL TERBARU
    ===================================================== */

    const latestDailyAssessment =
      dailyAssessments[0] ??
      null;

    /*
     * Prioritas:
     *
     * 1. Daily Assessment terbaru
     * 2. Assessment awal
     * 3. User.stressLevel
     */
    const rawStress =
      latestDailyAssessment?.stressLevel ??
      initialAssessment?.stressLevel ??
      user.stressLevel ??
      null;

    const stressLevel =
      rawStress !== null
        ? Number(rawStress)
        : null;

    /* =====================================================
       STRESS LABEL
    ===================================================== */

    const stressLabels: Record<
      number,
      string
    > = {
      1: "Level 1 - Sangat Rendah",
      2: "Level 2 - Rendah",
      3: "Level 3 - Sedang",
      4: "Level 4 - Tinggi",
      5: "Level 5 - Sangat Tinggi",
    };

    const stressLabel =
      stressLevel !== null
        ? (
          stressLabels[
          stressLevel
          ] ||
          `Level ${stressLevel}`
        )
        : "Belum Ada Data";

    /* =====================================================
       STREAK
    ===================================================== */

    const dynamicStreak =
      computeStreak(
        user.createdAt
      );

    /* =====================================================
       SUBSCRIPTION
    ===================================================== */

    const activeSubscription =
      await accountDb.subscription.findFirst(
        {
          where: {
            userId: user.id,
            status: "ACTIVE",
            endDate: {
              gte: new Date(),
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        }
      );

    /* =====================================================
       EXPIRED SUBSCRIPTION
    ===================================================== */

    const expiredSubscriptions =
      await accountDb.subscription.findMany(
        {
          where: {
            userId: user.id,
            status: "ACTIVE",
            endDate: {
              lt: new Date(),
            },
          },
        }
      );

    if (
      expiredSubscriptions.length > 0
    ) {
      await accountDb.subscription.updateMany(
        {
          where: {
            userId: user.id,
            status: "ACTIVE",
            endDate: {
              lt: new Date(),
            },
          },

          data: {
            status: "EXPIRED",
          },
        }
      );

      if (!activeSubscription) {
        await accountDb.user.update({
          where: {
            id: user.id,
          },

          data: {
            plan: "FREE",
          },
        });
      }
    }

    const plan =
      activeSubscription?.plan ===
        "PLUS"
        ? "PLUS"
        : "FREE";

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,

        name:
          user.name,

        email:
          user.email,

        username:
          user.username ||
          null,

        bio:
          user.bio ||
          null,

        avatarUrl:
          resolveAvatar(
            user.avatarUrl
          ),

        avatarKey:
          user.avatarUrl ||
          "fox",

        plan,

        onboardingCompleted:
          user.onboardingCompleted,

        createdAt:
          user.createdAt,
      },

      /* =================================================
         ASSESSMENT DATA
      ================================================= */

      isNewAccount,

      initialAssessment,

      dailyAssessments,

      /* =================================================
         STATS
      ================================================= */

      stats: {
        zybaScore,

        hasAssessment,

        condition,

        stressLevel,

        stressLabel,

        streak:
          hasAssessment
            ? dynamicStreak
            : 0,

        /*
         * Tetap dikirim untuk compatibility
         * dengan kode lama.
         */
        assessment:
          initialAssessment,

        /*
         * Tambahan status supaya frontend
         * bisa menentukan sumber data.
         */
        hasInitialAssessment,

        hasDailyAssessment,

        dailyAssessmentCount:
          dailyAssessments.length,

        /*
         * Jangan ubah behaviour Companion
         * yang sekarang.
         */
        conversationCount: 0,
      },
    });
  } catch (error) {
    console.error(
      "Fetch user me error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token =
      req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session =
      await verifySessionToken(token);

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const body =
      await req.json();

    const {
      name,
      username,
      bio,
    } = body;

    /* =====================================================
       VALIDATE NAME
    ===================================================== */

    if (
      name !== undefined &&
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Nama tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (
      name !== undefined
    ) {
      updateData.name =
        name.trim();
    }

    if (
      bio !== undefined
    ) {
      updateData.bio =
        bio.trim() ||
        null;
    }

    /* =====================================================
       USERNAME
    ===================================================== */

    if (
      username !== undefined
    ) {
      const cleanUsername =
        username
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9_]/g,
            ""
          );

      if (cleanUsername) {
        const existing =
          await accountDb.user.findFirst(
            {
              where: {
                username:
                  cleanUsername,

                NOT: {
                  id:
                    session.userId,
                },
              },
            }
          );

        if (existing) {
          return NextResponse.json(
            {
              error:
                "Username sudah digunakan orang lain",
            },
            { status: 409 }
          );
        }

        updateData.username =
          cleanUsername;
      }
    }

    /* =====================================================
       UPDATE USER
    ===================================================== */

    const updatedUser =
      await accountDb.user.update({
        where: {
          id: session.userId,
        },

        data: updateData,
      });

    return NextResponse.json({
      success: true,

      user: {
        id: updatedUser.id,

        name:
          updatedUser.name,

        email:
          updatedUser.email,

        username:
          updatedUser.username ||
          null,

        bio:
          updatedUser.bio ||
          null,

        avatarUrl:
          resolveAvatar(
            updatedUser.avatarUrl
          ),
      },
    });
  } catch (err: any) {
    console.error(
      "Update user me error:",
      err
    );

    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to update profile",
      },
      { status: 500 }
    );
  }
}