import { NextRequest, NextResponse } from "next/server";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await communityDb.communityPost.findUnique({
      where: { id: params.postId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
        likes: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const author = await accountDb.user.findUnique({
      where: { id: post.userId },
      select: { id: true, name: true, username: true, avatarUrl: true },
    });

    const commentAuthors = await accountDb.user.findMany({
      where: { id: { in: post.comments.map(c => c.userId) } },
      select: { id: true, name: true, username: true, avatarUrl: true },
    });

    const authorMap = new Map(commentAuthors.map(u => [u.id, u]));

    const formattedComments = post.comments.map(c => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      userId: c.userId,
      author: authorMap.get(c.userId)?.name || "Pengguna ZYBA",
      avatar: authorMap.get(c.userId)?.avatarUrl || "fox",
    }));

    return NextResponse.json({
      id: post.id,
      userId: post.userId,
      author: author?.name || "Pengguna ZYBA",
      username: author?.username,
      avatarUrl: author?.avatarUrl,
      content: post.content,
      imageUrl: post.imageUrl,
      audioUrl: post.audioUrl,
      stickerId: post.stickerId,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      comments: formattedComments,
    });
  } catch (error: any) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get post" },
      { status: 500 }
    );
  }
}