"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, UserPlus } from "lucide-react";
import { useCommunity } from "../context/CommunityContext";
import PostCard from "./PostCard";

export default function CommunityProfileView() {
  const router = useRouter();
  const {
    posts,
    savedPostIds,
    handleToggleLike,
    handleToggleRepost,
    handleAddComment,
    handleTagFilter,
    setIsPostModalOpen,
    currentUserId,
  } = useCommunity();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Pengguna ZYBA");
  const [userUsername, setUserUsername] = useState("");
  const [userBio, setUserBio] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"THREADS" | "REPLIES" | "SAVED">("THREADS");

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          setUserId(data.user.id);
          setUserName(data.user.name || "Pengguna ZYBA");
          setUserUsername(data.user.username || "");
          setUserBio(data.user.bio || "");
        }
      } catch {}
    }
    loadMe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function loadCounts() {
      try {
        const [fRes, fgRes] = await Promise.all([
          fetch(`/api/community/users/${userId}/followers`),
          fetch(`/api/community/users/${userId}/following`),
        ]);
        if (fRes.ok) {
          const fData = await fRes.json();
          setFollowerCount(fData.followers?.length ?? 0);
        }
        if (fgRes.ok) {
          const fgData = await fgRes.json();
          setFollowingCount(fgData.following?.length ?? 0);
        }
      } catch {}
    }
    loadCounts();
  }, [userId]);

  const myPosts = userId
    ? posts.filter((p) => {
        const authorId = (p as any).userId;
        return authorId === userId;
      })
    : [];
  const mySaved = posts.filter((p) => savedPostIds.includes(p.id));

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-brown-900/10 p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="font-bold text-xl text-brown-900">{userName}</h1>
            {userUsername && (
              <p className="text-xs text-brown-700/60 mt-0.5">@{userUsername}</p>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-2xl text-orange-600 shadow-md shrink-0">
            {initials}
          </div>
        </div>

        {userBio && (
          <p className="text-xs text-brown-900 leading-relaxed max-w-md mb-4">
            {userBio}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-brown-700/60 border-t border-brown-900/6 pt-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => userId && router.push(`/community/profile/${userId}/followers`)}
              className="hover:text-brown-900 transition-colors"
            >
              <strong className="text-brown-900">{followerCount}</strong> pengikut
            </button>
            <button
              type="button"
              onClick={() => userId && router.push(`/community/profile/${userId}/following`)}
              className="hover:text-brown-900 transition-colors"
            >
              <strong className="text-brown-900">{followingCount}</strong> mengikuti
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="rounded-full bg-brown-900 text-white font-bold px-4 py-1.5 hover:bg-orange-500 transition-colors shadow-2xs"
            >
              + Thread Baru
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brown-900/10 text-xs font-bold">
        {(["THREADS", "REPLIES", "SAVED"] as const).map((tab) => (
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
        {activeTab === "SAVED" ? (
          mySaved.length === 0 ? (
            <div className="py-12 text-center text-xs text-brown-700/50">
              Belum ada thread yang disimpan.
            </div>
          ) : (
            mySaved.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onToggleRepost={handleToggleRepost}
                onAddComment={handleAddComment}
                onTagClick={handleTagFilter}
                currentUserId={currentUserId}
              />
            ))
          )
        ) : activeTab === "THREADS" ? (
          myPosts.length === 0 ? (
            <div className="py-12 text-center text-xs text-brown-700/50">
              Belum ada postingan.
            </div>
          ) : (
            myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onToggleRepost={handleToggleRepost}
                onAddComment={handleAddComment}
                onTagClick={handleTagFilter}
                currentUserId={currentUserId}
              />
            ))
          )
        ) : (
          <div className="py-12 text-center text-xs text-brown-700/50">
            Replies coming soon.
          </div>
        )}
      </div>
    </div>
  );
}