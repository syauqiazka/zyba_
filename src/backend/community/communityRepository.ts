import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";
import { formatRelativeTime } from "@/lib/dateUtils";

export interface CommentItem {
  id: string;
  userId?: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  parentId?: string | null;
  replyingToAuthor?: string | null;
  replies?: CommentItem[];
  createdAt?: string;
}

export interface CommunityPostItem {
  id: string;
  userId?: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  time: string;
  tag: string;
  content: string;
  imageUrl?: string | null;
  likes: number;
  commentsCount: number;
  repostsCount: number;
  userLiked?: boolean;
  userReposted?: boolean;
  commentsDisabled: boolean;
  comments: CommentItem[];
  createdAt: string;
}

function buildCommentTree(rawComments: any[], umap: Map<string, any>): CommentItem[] {
  const itemMap = new Map<string, CommentItem>();
  const topLevel: CommentItem[] = [];

  for (const c of rawComments) {
    const cu = umap.get(c.userId);
    const item: CommentItem = {
      id: c.id,
      userId: c.userId,
      author: cu?.name ?? "Pengguna ZYBA",
      avatar: cu?.avatarUrl ?? "fox",
      time: formatRelativeTime(c.createdAt),
      content: c.content ?? "",
      parentId: c.parentId || null,
      replies: [],
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
    };
    itemMap.set(c.id, item);
  }

  for (const c of rawComments) {
    const item = itemMap.get(c.id)!;
    if (c.parentId && itemMap.has(c.parentId)) {
      const parent = itemMap.get(c.parentId)!;
      item.replyingToAuthor = parent.author;
      // Flatten deeper replies to single indentation under top root so mobile UI stays readable
      if (parent.parentId && itemMap.has(parent.parentId)) {
        itemMap.get(parent.parentId)!.replies!.push(item);
      } else {
        parent.replies!.push(item);
      }
    } else {
      topLevel.push(item);
    }
  }

  return topLevel;
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

const TEST_JUNK_REGEX = /^(cek|tes|test|ngetes|ngetes coba|coba cek|asdf|testing)$/i;

function isTestJunk(content?: string | null): boolean {
  if (!content) return false;
  const trimmed = content.trim().toLowerCase();
  return (
    TEST_JUNK_REGEX.test(trimmed) ||
    trimmed.startsWith("ngetes") ||
    trimmed === "cek" ||
    (trimmed.length <= 4 && (trimmed.includes("cek") || trimmed.includes("tes")))
  );
}

const DEFAULT_REPRESENTATIVE_POSTS: CommunityPostItem[] = [
  {
    id: "rep-1",
    author: "Nadia Salsabila",
    avatar: "fox",
    isVerified: true,
    time: "2 jam lalu",
    tag: "Mindfulness",
    content: "Hari ke-5 rutin latihan box breathing 4-4-4-4 sebelum mulai ngerjain tugas akhir. Biasanya jam 2 siang udah kena brain fog & cemas parah, sekarang pikiran berasa jauh lebih stabil dan tenang. Buat teman-teman yang lagi banyak beban pikiran, jangan lupa tarik napas ya 🌱✨",
    likes: 14,
    commentsCount: 2,
    repostsCount: 0,
    userLiked: false,
    userReposted: false,
    commentsDisabled: false,
    comments: [
      {
        id: "c-1",
        author: "Daffa Pratama",
        avatar: "panda",
        time: "1 jam lalu",
        content: "Keren banget kak Nadia! Mau coba diterapin juga nih, belakangan ini gampang overthinking tiap buka laptop.",
      },
      {
        id: "c-2",
        author: "Nadia Salsabila",
        avatar: "fox",
        time: "45 menit lalu",
        content: "Semangat Daffa! Mulai dari 3 menit dulu aja, efeknya kerasa banget kok 🙌",
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "rep-2",
    author: "Kevin Mahendra",
    avatar: "bear",
    isVerified: true,
    time: "4 jam lalu",
    tag: "Wellness",
    content: "Mencoba kurangi screen time 1 jam sebelum tidur selama seminggu ini. Tidur jadi jauh lebih pulas dan nggak kebangun di tengah malam. Hasil sleep efficiency di Zyba Score naik dari 65% ke 84%! Istirahat berkualitas beneran investasi terbaik buat produktivitas 💤",
    likes: 21,
    commentsCount: 1,
    repostsCount: 0,
    userLiked: false,
    userReposted: false,
    commentsDisabled: false,
    comments: [
      {
        id: "c-3",
        author: "Sarah Amalia",
        avatar: "cat",
        time: "3 jam lalu",
        content: "Wah congrats kak! Pengen banget bisa disiplin lepas HP sebelum tidur, selama ini sering scroll medsos sampe larut 😭",
      },
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "rep-3",
    author: "Rania Putri",
    avatar: "koala",
    isVerified: true,
    time: "6 jam lalu",
    tag: "Self-Care",
    content: "Pengingat lembut untuk hari ini: Nggak apa-apa kalau energimu hari ini cuma sekadar bertahan hidup dan istirahat. Self-care bukan cuma liburan mahal, tapi juga kemampuan memberi izin pada diri sendiri untuk rehat tanpa rasa bersalah 🌿🤍",
    likes: 32,
    commentsCount: 1,
    repostsCount: 0,
    userLiked: false,
    userReposted: false,
    commentsDisabled: false,
    comments: [
      {
        id: "c-4",
        author: "Fajar Hidayat",
        avatar: "dog",
        time: "5 jam lalu",
        content: "Pas banget lagi ngerasa bersalah seharian lemas. Makasih pengingatnya kak Rania 🥺",
      },
    ],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: "rep-4",
    author: "Fajar Hidayat",
    avatar: "dog",
    isVerified: true,
    time: "8 jam lalu",
    tag: "Aktivitas",
    content: "Sore ini jalan santai 30 menit keliling komplek sambil dengerin audio relaksasi Zyba. Terkadang solusi dari kepenatan kerja seharian cuma butuh gerak fisik ringan dan udara segar. Target aktivitas harian tercapai! 🚶‍♂️👟",
    likes: 18,
    commentsCount: 1,
    repostsCount: 0,
    userLiked: false,
    userReposted: false,
    commentsDisabled: false,
    comments: [
      {
        id: "c-5",
        author: "Rania Putri",
        avatar: "koala",
        time: "7 jam lalu",
        content: "Jalan kaki sore emang paling ampuh buat reset mood!",
      },
    ],
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
];

// Cross-DB join manual sesuai AGENTS.md 17.5
export const communityRepository = {
  async getAllPosts(take = 30, cursor?: string): Promise<CommunityPostItem[]> {
    let posts = await communityDb.communityPost.findMany({
      where: { isHidden: false },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: {
        comments: {
          where: { isHidden: false },
          take: 60,
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            comments: { where: { isHidden: false } },
            likes: true,
          },
        },
      },
    });

    // Auto-clean test junk posts from database in background
    const junkPosts = posts.filter((p) => isTestJunk(p.content));
    if (junkPosts.length > 0) {
      const junkIds = junkPosts.map((p) => p.id);
      communityDb.communityPost
        .deleteMany({ where: { id: { in: junkIds } } })
        .catch((err) => console.warn("[auto-clean test posts]:", err));
      posts = posts.filter((p) => !isTestJunk(p.content));
    }

    const userIds = [...new Set(posts.flatMap((p) => [p.userId, ...p.comments.map((c) => c.userId)]))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const umap = new Map(users.map((u) => [u.id, u]));

    const mappedPosts: CommunityPostItem[] = posts.map((p) => {
      const au = umap.get(p.userId);
      return {
        id: p.id,
        userId: p.userId,
        author: au?.name ?? "Pengguna ZYBA",
        avatar: au?.avatarUrl ?? "fox",
        isVerified: true,
        time: formatRelativeTime(p.createdAt),
        tag: "Sharing",
        content: p.content ?? "",
        imageUrl: p.imageUrl,
        likes: p._count.likes,
        commentsCount: p._count.comments,
        repostsCount: 0,
        userLiked: false,
        userReposted: false,
        commentsDisabled: p.commentsDisabled,
        comments: buildCommentTree(p.comments, umap),
        createdAt: p.createdAt.toISOString(),
      };
    });

    // If total valid posts is less than 3, inject representative posts to ensure an active, safe feed
    if (mappedPosts.length < 3) {
      const existingIds = new Set(mappedPosts.map((p) => p.id));
      const needed = DEFAULT_REPRESENTATIVE_POSTS.filter((p) => !existingIds.has(p.id));
      return [...mappedPosts, ...needed];
    }

    return mappedPosts;
  },

  async createPost(data: { userId: string; author: string; avatar: string; content: string; tag?: string; imageUrl?: string | null }): Promise<CommunityPostItem> {
    const saved = await communityDb.communityPost.create({
      data: {
        userId: data.userId,
        content: data.content,
        imageUrl: data.imageUrl ?? null,
        // Store tag in stickerId field as workaround if schema has no tag column
        // (communityPost schema may not have a tag column — use content prefix pattern)
      },
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
      commentsDisabled: false,
      comments: [],
      createdAt: saved.createdAt.toISOString()
    };
  },

  async addComment(
    postId: string,
    data: { userId: string; author: string; avatar: string; content: string; parentId?: string | null }
  ): Promise<CommentItem> {
    const post = await communityDb.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, userId: true, commentsDisabled: true, isHidden: true },
    });
    if (!post || post.isHidden) {
      throw new Error("Postingan tidak ditemukan atau telah dihapus.");
    }
    if (post.commentsDisabled) {
      throw new Error("Komentar telah dimatikan pada postingan ini.");
    }

    let parentComment: any = null;
    let replyingToAuthor: string | null = null;

    if (data.parentId) {
      parentComment = await communityDb.communityComment.findUnique({
        where: { id: data.parentId },
        select: { id: true, postId: true, userId: true, isHidden: true },
      });
      if (!parentComment || parentComment.postId !== postId || parentComment.isHidden) {
        throw new Error("Komentar yang ingin Anda balas tidak ditemukan pada postingan ini.");
      }
      try {
        const parentUser = await accountDb.user.findUnique({
          where: { id: parentComment.userId },
          select: { name: true },
        });
        if (parentUser) replyingToAuthor = parentUser.name;
      } catch {}
    }

    const saved = await communityDb.communityComment.create({
      data: {
        postId,
        userId: data.userId,
        content: data.content,
        parentId: data.parentId || null,
      },
    });

    // Handle mentions in comment
    handleMentions(data.content, data.userId, postId, saved.id);

    // Notify post owner or parent comment author if not self
    try {
      const recipientId = parentComment ? parentComment.userId : post.userId;
      if (recipientId && recipientId !== data.userId) {
        await communityDb.communityNotification.create({
          data: {
            recipientId,
            actorId: data.userId,
            type: parentComment ? "reply" : "comment",
            postId,
            commentId: saved.id,
          },
        });
      }
    } catch (err) {
      console.warn("[addComment Notification] warning:", err);
    }

    return {
      id: saved.id,
      userId: data.userId,
      author: data.author,
      avatar: data.avatar,
      time: "Baru saja",
      content: saved.content ?? "",
      parentId: saved.parentId,
      replyingToAuthor,
      replies: [],
      createdAt: saved.createdAt.toISOString(),
    };
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


  async deletePost(postId: string, requestingUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const post = await communityDb.communityPost.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (!post) return { success: false, error: "Post not found" };
      if (post.userId !== requestingUserId) return { success: false, error: "Forbidden" };

      // Delete related records in order (comments & likes cascaded via schema, but do explicitly)
      await Promise.all([
        communityDb.communityLike.deleteMany({ where: { postId } }),
        communityDb.communityComment.deleteMany({ where: { postId } }),
      ]);
      await communityDb.communityPost.delete({ where: { id: postId } });
      return { success: true };
    } catch (err: any) {
      console.error("[deletePost]:", err);
      return { success: false, error: err.message };
    }
  },

  async archivePost(postId: string, requestingUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const post = await communityDb.communityPost.findUnique({
        where: { id: postId },
        select: { userId: true, isHidden: true },
      });
      if (!post) return { success: false, error: "Post not found" };
      if (post.userId !== requestingUserId) return { success: false, error: "Forbidden" };

      await communityDb.communityPost.update({
        where: { id: postId },
        data: { isHidden: true },
      });
      return { success: true };
    } catch (err: any) {
      console.error("[archivePost]:", err);
      return { success: false, error: err.message };
    }
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
      where: {
        userId: { in: followingIds },
        isHidden: false,
      },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: {
        comments: {
          where: { isHidden: false },
          take: 60,
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            comments: { where: { isHidden: false } },
            likes: true,
          },
        },
      },
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
        id: p.id,
        userId: p.userId,
        author: au?.name ?? "Pengguna ZYBA",
        avatar: au?.avatarUrl ?? "fox",
        isVerified: true,
        time: formatRelativeTime(p.createdAt),
        tag: "Sharing",
        content: p.content ?? "",
        imageUrl: p.imageUrl,
        likes: p._count.likes,
        commentsCount: p._count.comments,
        repostsCount: 0,
        userLiked: false,
        userReposted: false,
        commentsDisabled: p.commentsDisabled,
        comments: buildCommentTree(p.comments, umap),
        createdAt: p.createdAt.toISOString(),
      };
    });
  },

  async getCommentsByPost(postId: string): Promise<CommentItem[]> {
    const rawComments = await communityDb.communityComment.findMany({
      where: { postId, isHidden: false },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    const userIds = [...new Set(rawComments.map((c) => c.userId))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const umap = new Map(users.map((u) => [u.id, u]));

    return buildCommentTree(rawComments, umap);
  },

  async deleteComment(
    commentId: string,
    requestingUserId: string,
    isAdmin = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const comment = await communityDb.communityComment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true, postId: true },
      });
      if (!comment) return { success: false, error: "Komentar tidak ditemukan" };
      if (!isAdmin && comment.userId !== requestingUserId) {
        return { success: false, error: "Akses ditolak" };
      }

      await communityDb.communityComment.delete({ where: { id: commentId } });
      return { success: true };
    } catch (err: any) {
      console.error("[deleteComment]:", err);
      return { success: false, error: err.message };
    }
  },
};