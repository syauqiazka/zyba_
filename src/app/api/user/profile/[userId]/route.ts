import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { communityRepository } from "@/backend/community/communityRepository";
import { communityDb } from "@/backend/db/communityClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Fetch user from Account DB
    const user = await accountDb.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch counts from Community DB
    const [followerCount, followingCount, postCount] = await Promise.all([
      communityRepository.getFollowerCount(userId),
      communityRepository.getFollowingCount(userId),
      communityDb.communityPost.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      user,
      followerCount,
      followingCount,
      postCount,
    });
  } catch (error: any) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
