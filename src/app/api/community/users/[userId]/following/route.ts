import { NextRequest, NextResponse } from "next/server";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const following = await communityDb.communityFollow.findMany({
      where: { followerId: params.userId },
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = following.length > limit;
    const items = hasMore ? following.slice(0, -1) : following;

    // Batch fetch user data from Account DB
    const userIds = items.map((f) => f.followingId);
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = items.map((f) => {
      const user = userMap.get(f.followingId);
      return {
        userId: f.followingId,
        name: user?.name || "Pengguna ZYBA",
        username: user?.username || f.followingId,
        avatarUrl: user?.avatarUrl,
        bio: user?.bio,
        followedAt: f.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      following: result,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch (error: any) {
    console.error("Get following error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get following" },
      { status: 500 }
    );
  }
}
