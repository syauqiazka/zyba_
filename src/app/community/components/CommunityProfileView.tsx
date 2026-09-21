"use client";

import React, { useState } from "react";
import { useCommunity } from "../context/CommunityContext";
import PostCard from "./PostCard";

export default function CommunityProfileView() {
  const {
    posts,
    savedPostIds,
    handleToggleLike,
    handleToggleRepost,
    handleAddComment,
    handleTagFilter,
    setIsPostModalOpen,
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<"THREADS" | "REPLIES" | "REPOSTS" | "SAVED">("THREADS");

  const myPosts = posts.filter((p) => p.author === "Alex Rivera" || p.id === "post-1");
  const mySaved = posts.filter((p) => savedPostIds.includes(p.id));

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4 animate-in fade-in duration-200">
      {/* Profile Header (Exact Threads Profile layout) */}
      <div className="bg-white rounded-3xl border border-brown-900/10 p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="font-bold text-xl text-brown-900">Alex Rivera</h1>
            <p className="text-xs text-brown-700/60 flex items-center gap-1.5 mt-0.5">
              <span>harikitte_ikou</span>
              <span className="text-[10px] bg-cream px-2 py-0.5 rounded-full font-bold text-brown-900">
                threads.net
              </span>
            </p>
          </div>

          <div className="w-16 h-16 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            A
          </div>
        </div>

        <p className="text-xs text-brown-900 leading-relaxed max-w-md mb-4">
          Menjelajahi kebiasaan mindfulness & program kebugaran mental di ZYBA. Bersama saling menguatkan, satu langkah kecil setiap hari. 🌱✨
        </p>

        <div className="flex items-center justify-between text-xs text-brown-700/60 border-t border-brown-900/6 pt-3">
          <div className="flex items-center gap-4">
            <span><strong>248</strong> pengikut</span>
            <span><strong>192</strong> mengikuti</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="rounded-full bg-brown-900 text-white font-bold px-4 py-1.5 hover:bg-orange-500 transition-colors shadow-2xs"
          >
            + Thread Baru
          </button>
        </div>
      </div>

      {/* Profile Tabs: Threads, Replies, Reposts, Saved */}
      <div className="flex border-b border-brown-900/10 text-xs font-bold">
        {(["THREADS", "REPLIES", "REPOSTS", "SAVED"] as const).map((tab) => (
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
              />
            ))
          )
        ) : (
          myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={handleToggleLike}
              onToggleRepost={handleToggleRepost}
              onAddComment={handleAddComment}
              onTagClick={handleTagFilter}
            />
          ))
        )}
      </div>
    </div>
  );
}
