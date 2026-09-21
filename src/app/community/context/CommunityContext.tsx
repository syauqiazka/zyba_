"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Post } from "../components/PostCard";
import { detectRisk } from "@/lib/crisisDetection";

export type CommunityView =
  | "FOR_YOU"
  | "FOLLOWING"
  | "SEARCH"
  | "MESSAGES"
  | "ACTIVITY"
  | "PROFILE"
  | "INSIGHTS"
  | "SAVED"
  | "LIKED"
  | "GHOST_POSTS"
  | "ARCHIVE";

export interface CommunityNotification {
  id: string;
  user: string;
  avatar: string;
  action: "like" | "reply" | "mention" | "follow";
  time: string;
  targetText?: string;
  read: boolean;
}

export interface CommunityMessage {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export const INITIAL_COMMUNITY_POSTS: Post[] = [
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
  },
  {
    id: "post-4",
    author: "Anonim #241",
    avatar: "👻",
    isVerified: false,
    time: "3 jam lalu",
    tag: "CurhatAnonim",
    content:
      "Kadang rasanya capek berpura-pura baik-baik saja di depan teman-teman kampus. Tapi bersyukur ada ruang aman seperti ini untuk meluapkan isi hati tanpa takut dihakimi.",
    likes: 45,
    commentsCount: 3,
    repostsCount: 2,
    userLiked: false,
    userReposted: false,
  },
];

const INITIAL_NOTIFICATIONS: CommunityNotification[] = [
  {
    id: "notif-1",
    user: "Sarah Jenkins",
    avatar: "SJ",
    action: "like",
    time: "15 mnt lalu",
    targetText: "Latihan pernapasan 4-4-4 emang ngebantu banget.",
    read: false,
  },
  {
    id: "notif-2",
    user: "Dimas Anggara",
    avatar: "DA",
    action: "reply",
    time: "1 jam lalu",
    targetText: "Membalas: 'Setuju banget, kualitas tidur bikin fokus seharian!'",
    read: false,
  },
  {
    id: "notif-3",
    user: "Nadia Putri",
    avatar: "NP",
    action: "follow",
    time: "3 jam lalu",
    read: true,
  },
];

const INITIAL_MESSAGES: CommunityMessage[] = [
  {
    id: "msg-1",
    user: "Sarah Jenkins",
    avatar: "SJ",
    lastMessage: "Halo Alex, terima kasih tips latihannya ya!",
    time: "10:30",
    unreadCount: 1,
  },
  {
    id: "msg-2",
    user: "Dimas Anggara",
    avatar: "DA",
    lastMessage: "Nanti malam kita coba jam tidur teratur bareng yuk.",
    time: "Kemarin",
  },
  {
    id: "msg-3",
    user: "Zyba Mentor Care",
    avatar: "🌿",
    lastMessage: "Halo! Jika butuh pendampingan khusus seputar ujian, kami siap.",
    time: "18 Sep",
  },
];

// URL slug → CommunityView mapping
const SLUG_TO_VIEW: Record<string, CommunityView> = {
  "for-you": "FOR_YOU",
  following: "FOLLOWING",
  search: "SEARCH",
  messages: "MESSAGES",
  activity: "ACTIVITY",
  profile: "PROFILE",
  insights: "INSIGHTS",
  saved: "SAVED",
  liked: "LIKED",
  "ghost-posts": "GHOST_POSTS",
  archive: "ARCHIVE",
};

export const VIEW_TO_SLUG: Record<CommunityView, string> = {
  FOR_YOU: "",
  FOLLOWING: "following",
  SEARCH: "search",
  MESSAGES: "messages",
  ACTIVITY: "activity",
  PROFILE: "profile",
  INSIGHTS: "insights",
  SAVED: "saved",
  LIKED: "liked",
  GHOST_POSTS: "ghost-posts",
  ARCHIVE: "archive",
};

interface CommunityContextType {
  currentView: CommunityView;
  setCurrentView: (view: CommunityView) => void;
  activeTab: "FOR_YOU" | "FOLLOWING";
  setActiveTab: (tab: "FOR_YOU" | "FOLLOWING") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  handleTagFilter: (tag: string) => void;
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  newPostContent: string;
  setNewPostContent: (c: string) => void;
  posts: Post[];
  followingPosts: Post[];
  currentPosts: Post[];
  savedPostIds: string[];
  handleToggleSave: (id: string) => void;
  notifications: CommunityNotification[];
  messages: CommunityMessage[];
  showCrisisNotice: boolean;
  setShowCrisisNotice: (show: boolean) => void;
  handleAddPost: (content: string, tag: string) => Promise<void>;
  handleToggleLike: (id: string) => Promise<void>;
  handleToggleRepost: (id: string) => void;
  handleAddComment: (postId: string, commentText: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive currentView from URL pathname
  const currentView: CommunityView = (() => {
    const parts = pathname.split("/").filter(Boolean);
    // e.g. ["community", "messages"] or ["community"]
    const slug = parts[1] || "";
    return SLUG_TO_VIEW[slug] || "FOR_YOU";
  })();

  const setCurrentView = useCallback(
    (view: CommunityView) => {
      const slug = VIEW_TO_SLUG[view];
      router.push(slug ? `/community/${slug}` : "/community");
    },
    [router]
  );

  const [activeTab, setActiveTab] = useState<"FOR_YOU" | "FOLLOWING">("FOR_YOU");
  const [posts, setPosts] = useState<Post[]>(INITIAL_COMMUNITY_POSTS);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(["post-1"]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [showCrisisNotice, setShowCrisisNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/community");
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch community posts:", err);
      }
    }
    loadPosts();
  }, []);

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery("");
    setCurrentView("FOR_YOU");
  };

  const handleToggleSave = (id: string) => {
    setSavedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Determine which posts to show based on currentView
  let basePosts = posts;
  if (currentView === "FOLLOWING") {
    basePosts = followingPosts.length > 0 ? followingPosts : posts.filter((p) => p.author !== "Sarah Jenkins");
  } else if (currentView === "SAVED") {
    basePosts = posts.filter((p) => savedPostIds.includes(p.id));
  } else if (currentView === "LIKED") {
    basePosts = posts.filter((p) => p.userLiked);
  } else if (currentView === "GHOST_POSTS") {
    basePosts = posts.filter((p) => p.author.includes("Anonim") || p.tag === "CurhatAnonim");
  } else if (currentView === "ARCHIVE") {
    basePosts = posts.filter((p) => p.time.includes("Kemarin") || p.time.includes("Sep"));
  }

  const currentPosts = basePosts.filter((p) => {
    const matchesTag =
      selectedTag === "Semua" ||
      (p.tag && p.tag.toLowerCase() === selectedTag.toLowerCase()) ||
      p.content.toLowerCase().includes(`#${selectedTag.toLowerCase()}`);

    const matchesSearch = searchQuery.trim()
      ? p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesTag && matchesSearch;
  });

  const handleToggleLike = async (id: string) => {
    const updater = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            userLiked: !p.userLiked,
            likes: p.userLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
          };
        }
        return p;
      });

    setPosts(updater);
    setFollowingPosts(updater);

    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "LIKE", postId: id }),
      });
    } catch (err) {
      console.warn("Like API error:", err);
    }
  };

  const handleToggleRepost = (id: string) => {
    const updater = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id === id) {
          const isReposted = !p.userReposted;
          return {
            ...p,
            userReposted: isReposted,
            repostsCount: (p.repostsCount ?? 0) + (isReposted ? 1 : -1),
          };
        }
        return p;
      });

    setPosts(updater);
    setFollowingPosts(updater);
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    const isRisk = detectRisk(commentText);
    if (isRisk) {
      setShowCrisisNotice(true);
    }

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "COMMENT", postId, content: commentText }),
      });
      const data = await res.json();
      if (data.comment) {
        const updater = (prev: Post[]) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                commentsCount: p.commentsCount + 1,
                comments: [...(p.comments || []), data.comment],
              };
            }
            return p;
          });
        setPosts(updater);
        setFollowingPosts(updater);
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const handleAddPost = async (content: string, tag: string) => {
    const isRisk = detectRisk(content);
    if (isRisk) {
      setShowCrisisNotice(true);
    }

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tag }),
      });
      const data = await res.json();
      if (data.post) {
        setPosts((prev) => [data.post, ...prev]);
        if (currentView === "FOLLOWING") {
          setFollowingPosts((prev) => [data.post, ...prev]);
        }
      }
      if (data.isRisk) {
        setShowCrisisNotice(true);
      }
    } catch (err) {
      console.error("API Community post sync error:", err);
    }
  };

  return (
    <CommunityContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        handleTagFilter,
        isPostModalOpen,
        setIsPostModalOpen,
        newPostContent,
        setNewPostContent,
        posts,
        followingPosts,
        currentPosts,
        savedPostIds,
        handleToggleSave,
        notifications,
        messages,
        showCrisisNotice,
        setShowCrisisNotice,
        handleAddPost,
        handleToggleLike,
        handleToggleRepost,
        handleAddComment,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
