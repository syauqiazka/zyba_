import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import {
  userRepository,
  computeStreak,
} from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import { accountDb } from "@/backend/db/accountClient";
import { scoreToCondition } from "@/backend/scoring/zybaScore";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const session =
      await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        {
          error: "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      (await userRepository.findById(
        session.userId
      )) ||
      (await userRepository.findByEmail(
        session.email
      ));

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // AMBIL DAILY ASSESSMENT TERBARU
    // =================================================

    const latestDaily =
      await accountDb.dailyAssessment.findFirst({
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
      });

    // =================================================
    // SCORE
    //
    // PRIORITAS:
    // 1. calculatedScore Daily Assessment terbaru
    // 2. user.zybaScore
    // =================================================

    const dailyScore =
      latestDaily?.calculatedScore;

    const zybaScore =
      dailyScore !== null &&
        dailyScore !== undefined
        ? dailyScore
        : user.zybaScore ??
        null;

    // =================================================
    // CONDITION
    // =================================================

    const condition =
      zybaScore !== null
        ? scoreToCondition(
          zybaScore
        )
        : "Belum Dinilai";

    // =================================================
    // ASSESSMENT STATUS
    // =================================================

    const hasAssessment =
      Boolean(
        latestDaily ||
        zybaScore !== null
      );

    // =================================================
    // STRESS
    // =================================================

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

    const rawStress =
      latestDaily?.stressLevel ??
      user.stressLevel ??
      null;

    const stressLevel =
      rawStress !== null
        ? Number(rawStress)
        : null;

    const stressLabel =
      stressLevel !== null
        ? (
          stressLabels[
          stressLevel
          ] ||
          `Level ${stressLevel}`
        )
        : "Belum Ada Data";

    // =================================================
    // STREAK
    // =================================================

    const dynamicStreak =
      computeStreak(
        user.createdAt
      );

    // =================================================
    // SUBSCRIPTION
    // =================================================

    const activeSubscription =
      await accountDb.subscription.findFirst({
        where: {
          userId: user.id,
          status: "ACTIVE",
          endDate: {
            gte: new Date(),
          },
        },

        orderBy: {
          createdAt:
            "desc",
        },
      });

    // =================================================
    // EXPIRED SUBSCRIPTION
    // =================================================

    const expiredSubscriptions =
      await accountDb.subscription.findMany({
        where: {
          userId: user.id,
          status: "ACTIVE",
          endDate: {
            lt: new Date(),
          },
        },
      });

    if (
      expiredSubscriptions.length >
      0
    ) {
      await accountDb.subscription.updateMany({
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
      });

      if (
        !activeSubscription
      ) {
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

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,

        username:
          user.username ||
          null,

        bio:
          user.bio ||
          null,

        phone:
          user.phone ||
          null,

        location:
          user.location ||
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

      stats: {
        zybaScore,

        hasAssessment,

        condition,

        stressLevel,

        stressLabel,

        streak:
          dynamicStreak,

        // Assessment awal
        assessment:
          await userRepository.getLatestAssessment(
            user.id
          ),

        // Daily terbaru
        latestDailyAssessment:
          latestDaily,
      },
    });
  } catch (error) {
    console.error(
      "Fetch user me error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// PATCH PROFILE
// =====================================================

export async function PATCH(
  req: NextRequest
) {
  try {
    const token =
      req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const session =
      await verifySessionToken(
        token
      );

    if (
      !session ||
      !session.userId
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const {
      name,
      username,
      bio,
      phone,
      location,
      password,
    } = body;

    if (
      name !== undefined &&
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Nama tidak boleh kosong",
        },
        {
          status: 400,
        }
      );
    }

    const updateData: any =
      {};

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

    if (
      phone !== undefined
    ) {
      updateData.phone =
        phone.trim() ||
        null;
    }

    if (
      location !== undefined
    ) {
      updateData.location =
        location.trim() ||
        null;
    }

    if (
      password !== undefined &&
      password.trim()
    ) {
      updateData.passwordHash =
        await bcrypt.hash(
          password.trim(),
          12
        );
    }

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
          await accountDb.user.findFirst({
            where: {
              username:
                cleanUsername,

              NOT: {
                id:
                  session.userId,
              },
            },
          });

        if (existing) {
          return NextResponse.json(
            {
              error:
                "Username sudah digunakan orang lain",
            },
            {
              status: 409,
            }
          );
        }

        updateData.username =
          cleanUsername;
      }
    }

    const updatedUser =
      await accountDb.user.update({
        where: {
          id:
            session.userId,
        },

        data:
          updateData,
      });

    return NextResponse.json({
      success: true,

      user: {
        id:
          updatedUser.id,

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

        phone:
          updatedUser.phone ||
          null,

        location:
          updatedUser.location ||
          null,

        avatarUrl:
          resolveAvatar(
            updatedUser.avatarUrl
          ),
      },
    });
  } catch (error: any) {
    console.error(
      "Update user me error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}

export const PUT = PATCH;