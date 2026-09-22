"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "../../components/PostCard";
import { useCommunity } from "../../context/CommunityContext";
import { MessageCircle } from "lucide-react";

interface ProfileData {
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isFollower: boolean;
  isSelf: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  time: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  repostsCount?: number;
  userLiked: boolean;
  userReposted?: boolean;
  tag: string;
  comments?: any[];
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { handleToggleLike, handleToggleRepost, handleAddComment, handleTagFilter } = useCommunity();
  
  const userId = params.userId as string;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"POSTS" | "REPLIES">("POSTS");
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        
        const [userRes, followRes, postsRes] = await Promise.all([
          fetch(`/api/user/profile/${userId}`),
          fetch(`/api/community/follows/${userId}`),
          fetch(`/api/community/users/${userId}/posts`),
        ]);

        if (!userRes.ok) {
          console.error("Failed to load user profile");
          return;
        }

        const userData = await userRes.json();
        const followData = followRes.ok ? await followRes.json() : { isFollowing: false, isFollower: false, isSelf: false };
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };

        setProfile({
          userId: userData.user.id,
          name: userData.user.name,
          username: userData.user.username || userData.user.id,
          avatarUrl: userData.user.avatarUrl,
          bio: userData.user.bio,
          followerCount: userData.followerCount || 0,
          followingCount: userData.followingCount || 0,
          postCount: userData.postCount || 0,
          isFollowing: followData.isFollowing,
          isFollower: followData.isFollower,
          isSelf: followData.isSelf,
        });

        setPosts(postsData.posts || []);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;

    setFollowLoading(true);
    try {
      const method = profile.isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/community/follows/${userId}`, { method });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? {
          ...prev,
          isFollowing: data.isFollowing,
          followerCount: prev.followerCount + (data.isFollowing ? 1 : -1),
        } : null);
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    router.push(`/community/messages?userId=${userId}`);
  };

  if (loading) {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto flex items-center justify-center">
        <div className="text-sm text-brown-700/60">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto flex items-center justify-center">
        <div className="text-sm text-brown-700/60">Profile not found</div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center py-4 px-3 sm:px-6">
      <div className="w-full max-w-[620px] space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-brown-900/10 p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h1 className="font-bold text-xl text-brown-900">{profile.name}</h1>
              <p className="text-xs text-brown-700/60 mt-0.5">
                @{profile.username}
              </p>
            </div>

            <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {initials}
            </div>
          </div>

          {profile.bio && (
            <p className="text-xs text-brown-900 leading-relaxed max-w-md mb-4">
              {profile.bio}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-brown-700/60 border-t border-brown-900/6 pt-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push(`/community/profile/${userId}/followers`)}
                className="hover:text-brown-900 transition-colors"
              >
                <strong className="text-brown-900">{profile.followerCount}</strong> pengikut
              </button>
              <button
                type="button"
                onClick={() => router.push(`/community/profile/${userId}/following`)}
                className="hover:text-brown-900 transition-colors"
              >
                <strong className="text-brown-900">{profile.followingCount}</strong> mengikuti
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!profile.isSelf && (
                <>
                  <button
                    type="button"
                    onClick={handleMessage}
                    className="rounded-full bg-cream border border-brown-900/10 text-brown-900 font-bold px-3 py-1.5 hover:bg-brown-900/5 transition-colors shadow-2xs flex items-center gap-1.5"
                    title="Message"
                  >
                    <MessageCircle size={14} />
                    <span>Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`rounded-full font-bold px-4 py-1.5 transition-colors shadow-2xs ${
                      profile.isFollowing
                        ? "bg-cream border border-brown-900/10 text-brown-900 hover:bg-brown-900/5"
                        : "bg-brown-900 text-white hover:bg-orange-500"
                    }`}
                  >
                    {followLoading ? "..." : profile.isFollowing ? "Following" : "Follow"}
                  </button>
                </>
              )}
              {profile.isSelf && (
                <button
                  type="button"
                  onClick={() => router.push("/settings/profile")}
                  className="rounded-full bg-brown-900 text-white font-bold px-4 py-1.5 hover:bg-orange-500 transition-colors shadow-2xs"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-brown-900/10 text-xs font-bold">
          {(["POSTS", "REPLIES"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-center transition-all border-b-2 -mb-[1px] ${
                activeTab === tab
                  ? "border-brown-900 text-brown-900 font-extrabold"
                  : "border-transparent text-brown-700/50 hover:text-brown-900"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden">
          {activeTab === "POSTS" && posts.length === 0 && (
            <div className="py-12 text-center text-xs text-brown-700/50">
              Belum ada postingan.
            </div>
          )}
          {activeTab === "POSTS" &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onToggleRepost={handleToggleRepost}
                onAddComment={handleAddComment}
                onTagClick={handleTagFilter}
              />
            ))}
          {activeTab === "REPLIES" && (
            <div className="py-12 text-center text-xs text-brown-700/50">
              Replies coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
