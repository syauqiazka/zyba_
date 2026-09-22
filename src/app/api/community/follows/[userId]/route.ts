import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityDb } from "@/backend/db/communityClient";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followerId = session.userId;
    const followingId = params.userId;

    // Reject self-follow
    if (followerId === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existing = await communityDb.communityFollow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      return NextResponse.json({ isFollowing: true });
    }

    // Create follow relationship
    await communityDb.communityFollow.create({
      data: { followerId, followingId },
    });

    // Create notification
    await communityDb.communityNotification.create({
      data: {
        recipientId: followingId,
        actorId: followerId,
        type: "follow",
      },
    });

    return NextResponse.json({ isFollowing: true });
  } catch (error: any) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to follow" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followerId = session.userId;
    const followingId = params.userId;

    await communityDb.communityFollow.deleteMany({
      where: { followerId, followingId },
    });

    return NextResponse.json({ isFollowing: false });
  } catch (error: any) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unfollow" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const viewerId = session.userId;
    const targetId = params.userId;

    const isFollowing = await communityDb.communityFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: targetId,
        },
      },
    });

    const isFollower = await communityDb.communityFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: targetId,
          followingId: viewerId,
        },
      },
    });

    return NextResponse.json({
      isFollowing: !!isFollowing,
      isFollower: !!isFollower,
      isSelf: viewerId === targetId,
    });
  } catch (error: any) {
    console.error("Follow status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get follow status" },
      { status: 500 }
    );
  }
}
