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
      include: { comments: { take: 10, orderBy: { createdAt: "asc" } }, likes: true },
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
        likes: p.likes.length,
        commentsCount: p.comments.length,
        repostsCount: 0,
        userLiked: false,
        userReposted: false,
        comments: p.comments.map((c) => {
          const cu = umap.get(c.userId);
          return {
            id: c.id,
            author: cu?.name ?? "Pengguna ZYBA",
            avatar: cu?.avatarUrl ?? "fox",
            time: formatRelativeTime(c.createdAt),
            content: c.content ?? "",
          };
        }),
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
