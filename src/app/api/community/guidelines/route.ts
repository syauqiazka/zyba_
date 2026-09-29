import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { userRepository } from "@/backend/auth/userRepository";
import { accountDb } from "@/backend/db/accountClient";

const COMMUNITY_GUIDELINES_VERSION = "1.0";

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session?.userId) {
    return null;
  }

  // Pastikan user tersedia di database utama
  const migrated = await userRepository.ensureUserExistsInNeon(
    session.userId,
    session.email,
    session.name || undefined
  );

  return {
    session,
    userId: migrated?.neonId ?? session.userId,
  };
}

/**
 * GET
 * Mengecek apakah user sudah menyetujui Community Guidelines
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await accountDb.user.findUnique({
      where: {
        id: auth.userId,
      },
      select: {
        communityGuidelinesAcceptedAt: true,
        communityGuidelinesVersion: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const accepted =
      user.communityGuidelinesVersion ===
      COMMUNITY_GUIDELINES_VERSION;

    return NextResponse.json({
      accepted,
      version: user.communityGuidelinesVersion,
      acceptedAt: user.communityGuidelinesAcceptedAt,
      currentVersion: COMMUNITY_GUIDELINES_VERSION,
    });
  } catch (error) {
    console.error(
      "Community Guidelines GET error:",
      error
    );

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Menyimpan persetujuan Community Guidelines
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const acceptedAt = new Date();

    const updatedUser = await accountDb.user.update({
      where: {
        id: auth.userId,
      },
      data: {
        communityGuidelinesAcceptedAt: acceptedAt,
        communityGuidelinesVersion:
          COMMUNITY_GUIDELINES_VERSION,
      },
      select: {
        communityGuidelinesAcceptedAt: true,
        communityGuidelinesVersion: true,
      },
    });

    return NextResponse.json({
      success: true,
      accepted: true,
      acceptedAt:
        updatedUser.communityGuidelinesAcceptedAt,
      version:
        updatedUser.communityGuidelinesVersion,
    });
  } catch (error) {
    console.error(
      "Community Guidelines POST error:",
      error
    );

    return NextResponse.json(
      { error: "Gagal menyimpan persetujuan." },
      { status: 500 }
    );
  }
}