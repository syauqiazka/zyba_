import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
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
  comments: CommentItem[];
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "community_posts.json");

const SEED_POSTS: CommunityPostItem[] = [
  {
    id: "post-1",
    author: "Sarah Jenkins",
    avatar: "SJ",
    isVerified: true,
    time: "2 jam lalu",
    tag: "Mindfulness",
    content:
      "Baru saja menyelesaikan 7 hari streak breathing exercise di Zyba! Rasanya beban pikiran jauh lebih ringan menghadapi pekan ujian. Tetap semangat semuanya! 🌿✨ #zybarocks #mindfulness",
    likes: 34,
    commentsCount: 2,
    repostsCount: 5,
    userLiked: false,
    userReposted: false,
    comments: [
      {
        id: "c-1",
        author: "Alex Rivera",
        avatar: "AL",
        time: "1 jam lalu",
        content: "Keren banget Sarah! Konsistensi breathing 4-4-4 emang ngebantu banget.",
      },
      {
        id: "c-2",
        author: "Dimas Anggara",
        avatar: "DA",
        time: "45 mnt lalu",
        content: "Selamat streak 7 harinya! Semangat ujiannya ya.",
      },
    ],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "post-2",
    author: "Dimas Anggara",
    avatar: "DA",
    isVerified: false,
    time: "5 jam lalu",
    tag: "SleepRoutine",
    content:
      "Dulu sering begadang sampai subuh karena overthinking. Setelah ikuti rekomendasi sleep hygiene di ZYBA, akhirnya bisa tidur teratur jam 11 malam. Small wins count! 🌙 #gratefulness #zybacare",
    likes: 58,
    commentsCount: 1,
    repostsCount: 3,
    userLiked: true,
    userReposted: false,
    comments: [
      {
        id: "c-3",
        author: "Nadia Putri",
        avatar: "NP",
        time: "3 jam lalu",
        content: "Bener banget, mematikan layar 30 menit sebelum tidur pengaruhnya besar!",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "post-3",
    author: "Rizky Pratama",
    avatar: "RP",
    isVerified: true,
    time: "Kemarin",
    tag: "Sharing",
    content:
      "Belajar untuk tidak terlalu keras pada diri sendiri hari ini. Setiap proses butuh waktu, dan istirahat bukan berarti menyerah. Hope you all have a peaceful day! ☕🌱 #selfcare #zybarocks",
    likes: 82,
    commentsCount: 0,
    repostsCount: 12,
    userLiked: false,
    userReposted: false,
    comments: [],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(SEED_POSTS, null, 2), { encoding: "utf8" });
  }
}

function readPosts(): CommunityPostItem[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(POSTS_FILE, { encoding: "utf8" });
    return JSON.parse(raw);
  } catch {
    return SEED_POSTS;
  }
}

function writePosts(posts: CommunityPostItem[]): void {
  ensureFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), { encoding: "utf8" });
}

export const communityRepository = {
  async getAllPosts(): Promise<CommunityPostItem[]> {
    // Try Prisma first
    try {
      const dbPosts = await prisma.communityPost.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, avatarUrl: true } },
          comments: {
            take: 10,
            orderBy: { createdAt: "asc" },
            include: { user: { select: { name: true, avatarUrl: true } } },
          },
          likes: true,
        },
      });

      if (dbPosts && dbPosts.length > 0) {
        return dbPosts.map((p) => ({
          id: p.id,
          userId: p.userId,
          author: p.user.name,
          avatar: p.user.avatarUrl || "🦊",
          isVerified: true,
          time: "Baru saja",
          tag: "Sharing",
          content: p.content,
          imageUrl: p.imageUrl,
          likes: p.likes.length,
          commentsCount: p.comments.length,
          repostsCount: 0,
          userLiked: false,
          userReposted: false,
          comments: p.comments.map((c) => ({
            id: c.id,
            author: c.user.name,
            avatar: c.user.avatarUrl || "🦊",
            time: "Baru saja",
            content: c.content,
          })),
          createdAt: p.createdAt.toISOString(),
        }));
      }
    } catch {
      // Prisma fallback to local JSON
    }

    return readPosts();
  },

  async createPost(data: {
    userId: string;
    author: string;
    avatar: string;
    content: string;
    tag?: string;
    imageUrl?: string | null;
  }): Promise<CommunityPostItem> {
    const newPost: CommunityPostItem = {
      id: `post-${Date.now()}`,
      userId: data.userId,
      author: data.author,
      avatar: data.avatar,
      isVerified: true,
      time: "Baru saja",
      tag: data.tag || "Sharing",
      content: data.content,
      imageUrl: data.imageUrl || null,
      likes: 0,
      commentsCount: 0,
      repostsCount: 0,
      userLiked: false,
      userReposted: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    // Try Prisma
    try {
      await prisma.communityPost.create({
        data: {
          userId: data.userId,
          content: data.content,
          imageUrl: data.imageUrl || null,
        },
      });
    } catch {
      // Fallback
    }

    const posts = readPosts();
    posts.unshift(newPost);
    writePosts(posts);
    return newPost;
  },

  async addComment(
    postId: string,
    data: {
      author: string;
      avatar: string;
      content: string;
    }
  ): Promise<CommentItem> {
    const comment: CommentItem = {
      id: `c-${Date.now()}`,
      author: data.author,
      avatar: data.avatar,
      time: "Baru saja",
      content: data.content,
    };

    const posts = readPosts();
    const target = posts.find((p) => p.id === postId);
    if (target) {
      target.comments = target.comments || [];
      target.comments.push(comment);
      target.commentsCount = target.comments.length;
      writePosts(posts);
    }
    return comment;
  },

  async toggleLike(postId: string): Promise<boolean> {
    const posts = readPosts();
    const target = posts.find((p) => p.id === postId);
    if (target) {
      target.userLiked = !target.userLiked;
      target.likes = target.userLiked ? target.likes + 1 : Math.max(0, target.likes - 1);
      writePosts(posts);
      return target.userLiked;
    }
    return false;
  },
};
