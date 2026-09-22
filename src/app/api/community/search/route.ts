import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { communityDb } from "@/backend/db/communityClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, people, posts
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!query.trim()) {
      return NextResponse.json({ people: [], posts: [] });
    }

    const results: { people?: any[]; posts?: any[] } = {};

    // Search people
    if (type === "all" || type === "people") {
      const users = await accountDb.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
      });

      results.people = users.map(u => ({
        userId: u.id,
        name: u.name,
        username: u.username || u.id,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
      }));
    }

    // Search posts
    if (type === "all" || type === "posts") {
      const posts = await communityDb.communityPost.findMany({
        where: { content: { contains: query, mode: "insensitive" } },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { likes: true, comments: { take: 3 } },
      });

      const userIds = [...new Set(posts.map(p => p.userId))];
      const users = await accountDb.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, avatarUrl: true },
      });
      const userMap = new Map(users.map(u => [u.id, u]));

      results.posts = posts.map(p => {
        const author = userMap.get(p.userId);
        return {
          id: p.id,
          userId: p.userId,
          author: author?.name || "Pengguna ZYBA",
          avatar: author?.avatarUrl || "fox",
          content: p.content || "",
          imageUrl: p.imageUrl,
          likes: p.likes.length,
          commentsCount: p.comments.length,
          createdAt: p.createdAt.toISOString(),
        };
      });
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
