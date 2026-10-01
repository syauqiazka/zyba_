"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
  handleToggleSave: (id: string) => Promise<void>;
  hiddenPostIds: string[];
  handleHidePost: (postId: string) => void;
  mutedUserIds: string[];
  handleMuteUser: (userId: string, authorName?: string) => void;
  handleUnmuteUser: (userId: string) => void;
  blockedUserIds: string[];
  handleBlockUser: (userId: string, authorName?: string) => Promise<void>;
  handleUnblockUser: (userId: string) => void;
  showToast: (message: string, type?: "info" | "success" | "error") => void;
  notifications: CommunityNotification[];
  messages: CommunityMessage[];
  showCrisisNotice: boolean;
  setShowCrisisNotice: (show: boolean) => void;
  handleAddPost: (content: string, tag: string, imageUrl?: string | null) => Promise<void>;
  handleToggleLike: (id: string) => Promise<void>;
  handleToggleRepost: (id: string) => void;
  handleAddComment: (postId: string, commentText: string) => Promise<void>;
  currentUserId: string | null;
  currentUserName: string | null;
  currentUserAvatar: string | null;
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
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);
  const [mutedUserIds, setMutedUserIds] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ id: number; message: string; type?: "info" | "success" | "error" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "info" | "success" | "error" = "success") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    const id = Date.now();
    setToast({ id, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const [notifications, setNotifications] = useState<CommunityNotification[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [showCrisisNotice, setShowCrisisNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);

  // Hydrate local caches instantly (0ms)
  useEffect(() => {
    try {
      const cachedSaved = localStorage.getItem("zyba_saved_posts");
      if (cachedSaved) setSavedPostIds(JSON.parse(cachedSaved));

      const cachedHidden = localStorage.getItem("zyba_hidden_posts");
      if (cachedHidden) setHiddenPostIds(JSON.parse(cachedHidden));

      const cachedMuted = localStorage.getItem("zyba_muted_users");
      if (cachedMuted) setMutedUserIds(JSON.parse(cachedMuted));

      const cachedBlocked = localStorage.getItem("zyba_blocked_users");
      if (cachedBlocked) setBlockedUserIds(JSON.parse(cachedBlocked));
    } catch {}

    // Background fetch saved bookmarks from API
    fetch("/api/community/bookmarks")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.bookmarks) {
          const ids = data.bookmarks.map((b: any) => b.postId);
          setSavedPostIds(ids);
          try {
            localStorage.setItem("zyba_saved_posts", JSON.stringify(ids));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // First try from localStorage cache (instant hydration)
    try {
      const cached = localStorage.getItem("zyba_user_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.name) {
          setCurrentUserName(parsed.name);
          setCurrentUserAvatar(parsed.avatarUrl || null);
        }
      }
    } catch {}

    fetch("/api/user/me")
      .then((r) => r.json())
      .then((d) => {
        // API returns { user: { id, name, avatarUrl, ... }, stats: {...} }
        if (d?.user?.id) {
          setCurrentUserId(String(d.user.id));
          setCurrentUserName(d.user.name || null);
          setCurrentUserAvatar(d.user.avatarUrl || null);
        }
      })
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

  const handleToggleSave = async (id: string) => {
    const isCurrentlySaved = savedPostIds.includes(id);
    const nextSaved = isCurrentlySaved
      ? savedPostIds.filter((item) => item !== id)
      : [...savedPostIds, id];

    // Optimistic update
    setSavedPostIds(nextSaved);
    try {
      localStorage.setItem("zyba_saved_posts", JSON.stringify(nextSaved));
    } catch {}

    showToast(
      isCurrentlySaved
        ? "Postingan dihapus dari Tersimpan"
        : "✓ Postingan disimpan ke Tersimpan"
    );

    try {
      if (isCurrentlySaved) {
        await fetch(`/api/community/bookmarks?postId=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/community/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: id }),
        });
      }
    } catch (err) {
      console.warn("Bookmark sync error:", err);
      // Rollback on failure
      setSavedPostIds(savedPostIds);
      try {
        localStorage.setItem("zyba_saved_posts", JSON.stringify(savedPostIds));
      } catch {}
      showToast("Gagal memperbarui status simpan", "error");
    }
  };

  const handleHidePost = (postId: string) => {
    setHiddenPostIds((prev) => {
      if (prev.includes(postId)) return prev;
      const next = [...prev, postId];
      try {
        localStorage.setItem("zyba_hidden_posts", JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast("✓ Postingan disembunyikan dari feed Anda");
  };

  const handleMuteUser = (userId: string, authorName?: string) => {
    setMutedUserIds((prev) => {
      const identifiers = [userId];
      if (authorName && authorName !== userId) identifiers.push(authorName);
      const next = Array.from(new Set([...prev, ...identifiers]));
      try {
        localStorage.setItem("zyba_muted_users", JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`✓ @${authorName || userId} telah dibisukan`);
  };

  const handleUnmuteUser = (userId: string) => {
    setMutedUserIds((prev) => {
      const next = prev.filter((id) => id !== userId);
      try {
        localStorage.setItem("zyba_muted_users", JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Bisukan dibatalkan`);
  };

  const handleBlockUser = async (userId: string, authorName?: string) => {
    setBlockedUserIds((prev) => {
      const identifiers = [userId];
      if (authorName && authorName !== userId) identifiers.push(authorName);
      const next = Array.from(new Set([...prev, ...identifiers]));
      try {
        localStorage.setItem("zyba_blocked_users", JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`✓ @${authorName || userId} berhasil diblokir`);

    // Unfollow in background if valid target
    if (userId && !userId.includes(" ")) {
      try {
        await fetch(`/api/community/follows/${encodeURIComponent(userId)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Unfollow on block error:", err);
      }
    }
  };

  const handleUnblockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      const next = prev.filter((id) => id !== userId);
      try {
        localStorage.setItem("zyba_blocked_users", JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Blokir dibuka`);
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
    // 1. Exclude hidden posts
    if (hiddenPostIds.includes(p.id)) return false;

    // 2. Exclude muted authors
    if (p.userId && mutedUserIds.includes(p.userId)) return false;
    if (mutedUserIds.includes(p.author)) return false;

    // 3. Exclude blocked authors
    if (p.userId && blockedUserIds.includes(p.userId)) return false;
    if (blockedUserIds.includes(p.author)) return false;

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

  const handleAddPost = async (content: string, tag: string, imageUrl?: string | null) => {
    const isRisk = content ? detectRisk(content) : false;
    if (isRisk) {
      setShowCrisisNotice(true);
    }

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tag, imageUrl: imageUrl || null }),
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
        hiddenPostIds,
        handleHidePost,
        mutedUserIds,
        handleMuteUser,
        handleUnmuteUser,
        blockedUserIds,
        handleBlockUser,
        handleUnblockUser,
        showToast,
        notifications,
        messages,
        showCrisisNotice,
        setShowCrisisNotice,
        handleAddPost,
        handleToggleLike,
        handleToggleRepost,
        handleAddComment,
        currentUserId,
        currentUserName,
        currentUserAvatar,
        handleDeletePost,
        handleArchivePost,
      }}
    >
      {children}

      {/* Global floating toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-brown-900 text-white shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none"
        >
          {toast.type === "error" ? (
            <span className="text-red-400 font-bold">✕</span>
          ) : (
            <span className="text-green-400 font-bold">✓</span>
          )}
          <span>{toast.message}</span>
        </div>
      )}
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
