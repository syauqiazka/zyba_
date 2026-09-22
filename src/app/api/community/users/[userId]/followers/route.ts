import { NextRequest, NextResponse } from "next/server";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const followers = await communityDb.communityFollow.findMany({
      where: { followingId: params.userId },
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = followers.length > limit;
    const items = hasMore ? followers.slice(0, -1) : followers;

    // Batch fetch user data from Account DB
    const userIds = items.map((f) => f.followerId);
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = items.map((f) => {
      const user = userMap.get(f.followerId);
      return {
        userId: f.followerId,
        name: user?.name || "Pengguna ZYBA",
        username: user?.username || f.followerId,
        avatarUrl: user?.avatarUrl,
        bio: user?.bio,
        followedAt: f.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      followers: result,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch (error: any) {
    console.error("Get followers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get followers" },
      { status: 500 }
    );
  }
}
