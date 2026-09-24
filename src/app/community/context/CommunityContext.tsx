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
  action: "like" | "reply" | "mention" | "follow" | "dm";
  time: string;
  targetText?: string;
  read: boolean;
  actorId?: string;
  recipientId?: string;
  postId?: string;
  commentId?: string;
  conversationId?: string;
}

export interface CommunityMessage {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export const INITIAL_COMMUNITY_POSTS: Post[] = [];

const INITIAL_NOTIFICATIONS: CommunityNotification[] = [];

const INITIAL_MESSAGES: CommunityMessage[] = [];

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
  currentUserId: string | null;
  handleDeletePost: (postId: string) => Promise<void>;
  handleArchivePost: (postId: string) => Promise<void>;
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
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [showCrisisNotice, setShowCrisisNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((d) => { if (d?.id) setCurrentUserId(String(d.id)); })
      .catch(() => {});
  }, []);

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

  // Load following feed when switching to FOLLOWING view
  useEffect(() => {
    async function loadFollowingFeed() {
      if (currentView !== "FOLLOWING") return;
      
      try {
        const res = await fetch("/api/community/feed/following");
        if (res.ok) {
          const data = await res.json();
          if (data.posts) {
            setFollowingPosts(data.posts);
          }
        } else if (res.status === 401) {
          console.warn("Following feed: not authenticated");
          setFollowingPosts([]);
        }
      } catch (err) {
        console.warn("Failed to fetch following feed:", err);
        setFollowingPosts([]);
      }
    }
    loadFollowingFeed();
  }, [currentView]);

  // Load real notifications from API
  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/community/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch notifications:", err);
      }
    }
    loadNotifications();
  }, [currentView]);

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
    basePosts = followingPosts;
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

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/${postId}`, { method: "DELETE" });
      if (res.ok) {
        const updater = (prev: Post[]) => prev.filter((p) => p.id !== postId);
        setPosts(updater);
        setFollowingPosts(updater);
      }
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  const handleArchivePost = async (postId: string) => {
    try {
      await fetch(`/api/community/${postId}/archive`, { method: "POST" });
      // Optimistic: remove from main feed (still visible in /archive)
      const updater = (prev: Post[]) => prev.filter((p) => p.id !== postId);
      setPosts(updater);
      setFollowingPosts(updater);
    } catch (err) {
      console.error("Archive post error:", err);
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
        currentUserId,
        handleDeletePost,
        handleArchivePost,
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
