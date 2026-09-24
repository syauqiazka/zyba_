import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";
import { formatRelativeTime } from "@/lib/dateUtils";

export interface CommentItem {
  id: string; author: string; avatar: string; time: string; content: string;
}

export interface CommunityPostItem {
  id: string; userId?: string; author: string; avatar: string;
  isVerified: boolean; time: string; tag: string; content: string;
  imageUrl?: string | null; likes: number; commentsCount: number;
  repostsCount: number; userLiked?: boolean; userReposted?: boolean;
  comments: CommentItem[]; createdAt: string;
}

async function handleMentions(content: string, actorId: string, postId: string, commentId?: string) {
  try {
    const matches = content.match(/@([a-zA-Z0-9_]+)/g);
    if (!matches || matches.length === 0) return;
    const usernames = [...new Set(matches.map(m => m.slice(1).toLowerCase()))];
    const users = await accountDb.user.findMany({
      where: {
        username: { in: usernames },
        NOT: { id: actorId }
      },
      select: { id: true, username: true }
    });
    for (const u of users) {
      await communityDb.communityNotification.create({
        data: {
          recipientId: u.id,
          actorId: actorId,
          type: "mention",
          postId: postId,
          commentId: commentId || null,
        }
      });
    }
  } catch (err) {
    console.warn("[handleMentions] warning:", err);
  }
}

// Cross-DB join manual sesuai AGENTS.md 17.5
export const communityRepository = {
  async getAllPosts(take = 30, cursor?: string): Promise<CommunityPostItem[]> {
    const posts = await communityDb.communityPost.findMany({
      where: { isHidden: false },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: { comments: { take: 10, orderBy: { createdAt: "asc" } }, likes: true },
    });

    const userIds = [...new Set(posts.flatMap(p => [p.userId, ...p.comments.map(c => c.userId)]))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const umap = new Map(users.map(u => [u.id, u]));

    return posts.map(p => {
      const au = umap.get(p.userId);
      return {
        id: p.id, userId: p.userId,
        author: au?.name ?? "Pengguna ZYBA",
        avatar: au?.avatarUrl ?? "fox",
        isVerified: true,
        time: formatRelativeTime(p.createdAt),
        tag: "Sharing",
        content: p.content ?? "",
        imageUrl: p.imageUrl,
        likes: p.likes.length, commentsCount: p.comments.length,
        repostsCount: 0, userLiked: false, userReposted: false,
        comments: p.comments.map(c => {
          const cu = umap.get(c.userId);
          return {
            id: c.id,
            author: cu?.name ?? "Pengguna ZYBA",
            avatar: cu?.avatarUrl ?? "fox",
            time: formatRelativeTime(c.createdAt),
            content: c.content ?? ""
          };
        }),
        createdAt: p.createdAt.toISOString(),
      };
    });
  },

  async createPost(data: { userId: string; author: string; avatar: string; content: string; tag?: string; imageUrl?: string | null }): Promise<CommunityPostItem> {
    const saved = await communityDb.communityPost.create({
      data: { userId: data.userId, content: data.content, imageUrl: data.imageUrl ?? null },
    });

    // Handle mentions in post
    handleMentions(data.content, data.userId, saved.id);

    return {
      id: saved.id,
      userId: saved.userId,
      author: data.author,
      avatar: data.avatar,
      isVerified: true,
      time: "Baru saja",
      tag: data.tag ?? "Sharing",
      content: saved.content ?? "",
      imageUrl: saved.imageUrl,
      likes: 0,
      commentsCount: 0,
      repostsCount: 0,
      userLiked: false,
      userReposted: false,
      comments: [],
      createdAt: saved.createdAt.toISOString()
    };
  },

  async addComment(postId: string, data: { userId: string; author: string; avatar: string; content: string }): Promise<CommentItem> {
    const saved = await communityDb.communityComment.create({
      data: { postId, userId: data.userId, content: data.content }
    });

    // Handle mentions in comment
    handleMentions(data.content, data.userId, postId, saved.id);

    // Notify post owner if not self
    try {
      const post = await communityDb.communityPost.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (post && post.userId !== data.userId) {
        await communityDb.communityNotification.create({
          data: {
            recipientId: post.userId,
            actorId: data.userId,
            type: "reply",
            postId,
            commentId: saved.id,
          },
        });
      }
    } catch (err) {
      console.warn("[addComment Notification] warning:", err);
    }

    return { id: saved.id, author: data.author, avatar: data.avatar, time: "Baru saja", content: saved.content ?? "" };
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const existing = await communityDb.communityLike.findUnique({ where: { postId_userId: { postId, userId } } });
    if (existing) {
      await communityDb.communityLike.delete({ where: { id: existing.id } });
      return false;
    }
    await communityDb.communityLike.create({ data: { postId, userId } });

    // Notify post owner on like
    try {
      const post = await communityDb.communityPost.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (post && post.userId !== userId) {
        await communityDb.communityNotification.create({
          data: {
            recipientId: post.userId,
            actorId: userId,
            type: "like",
            postId,
          },
        });
      }
    } catch (err) {
      console.warn("[toggleLike Notification] warning:", err);
    }

    return true;
  },


  async getFollowingIds(userId: string): Promise<string[]> {
    const following = await communityDb.communityFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return following.map((f) => f.followingId);
  },

  async getFollowState(viewerId: string, targetId: string): Promise<{ isFollowing: boolean; isFollower: boolean; isSelf: boolean }> {
    if (viewerId === targetId) {
      return { isFollowing: false, isFollower: false, isSelf: true };
    }
    const [isFollowing, isFollower] = await Promise.all([
      communityDb.communityFollow.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
      }),
      communityDb.communityFollow.findUnique({
        where: { followerId_followingId: { followerId: targetId, followingId: viewerId } },
      }),
    ]);
    return { isFollowing: !!isFollowing, isFollower: !!isFollower, isSelf: false };
  },

  async getFollowerCount(userId: string): Promise<number> {
    return await communityDb.communityFollow.count({ where: { followingId: userId } });
  },

  async getFollowingCount(userId: string): Promise<number> {
    return await communityDb.communityFollow.count({ where: { followerId: userId } });
  },

  async getFollowingPosts(userId: string, take = 30, cursor?: string): Promise<CommunityPostItem[]> {
    // Get following IDs first
    const followingIds = await this.getFollowingIds(userId);
    
    if (followingIds.length === 0) {
      return [];
    }

    const posts = await communityDb.communityPost.findMany({
      where: { userId: { in: followingIds }, isHidden: false },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: { comments: { take: 10, orderBy: { createdAt: "asc" } }, likes: true },
    });

    const userIds = [...new Set(posts.flatMap(p => [p.userId, ...p.comments.map(c => c.userId)]))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const umap = new Map(users.map(u => [u.id, u]));

    return posts.map(p => {
      const au = umap.get(p.userId);
      return {
        id: p.id, userId: p.userId,
        author: au?.name ?? "Pengguna ZYBA",
        avatar: au?.avatarUrl ?? "fox",
        isVerified: true,
        time: formatRelativeTime(p.createdAt),
        tag: "Sharing",
        content: p.content ?? "",
        imageUrl: p.imageUrl,
        likes: p.likes.length, commentsCount: p.comments.length,
        repostsCount: 0, userLiked: false, userReposted: false,
        comments: p.comments.map(c => {
          const cu = umap.get(c.userId);
          return {
            id: c.id,
            author: cu?.name ?? "Pengguna ZYBA",
            avatar: cu?.avatarUrl ?? "fox",
            time: formatRelativeTime(c.createdAt),
            content: c.content ?? ""
          };
        }),
        createdAt: p.createdAt.toISOString(),
      };
    });
  },
};
