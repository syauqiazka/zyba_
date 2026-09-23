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
    const includeHidden = searchParams.get("includeHidden") === "true";

    // Base where: always filter by userId; only include hidden posts when explicitly requested
    const where: any = { userId: params.userId };
    if (!includeHidden) {
      where.isHidden = false;
    }

    const posts = await communityDb.communityPost.findMany({
      where,
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: { comments: { take: 5, orderBy: { createdAt: "asc" } }, likes: true },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    // Batch fetch user data
    const userIds = [...new Set(items.flatMap(p => [p.userId, ...p.comments.map(c => c.userId)]))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const result = items.map(p => {
      const author = userMap.get(p.userId);
      return {
        id: p.id,
        userId: p.userId,
        author: author?.name || "Pengguna ZYBA",
        avatar: author?.avatarUrl || "fox",
        isVerified: true,
        time: "Baru saja",
        tag: "Sharing",
        content: p.content || "",
        imageUrl: p.imageUrl,
        isHidden: p.isHidden,
        likes: p.likes.length,
        commentsCount: p.comments.length,
        repostsCount: 0,
        userLiked: false,
        userReposted: false,
        comments: p.comments.map(c => {
          const commenter = userMap.get(c.userId);
          return {
            id: c.id,
            author: commenter?.name || "Pengguna ZYBA",
            avatar: commenter?.avatarUrl || "fox",
            time: "Baru saja",
            content: c.content || "",
          };
        }),
      };
    });

    return NextResponse.json({
      posts: result,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch (error: any) {
    console.error("Get user posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get posts" },
      { status: 500 }
    );
  }
}
