"use client";

import React from "react";
import { useCommunity } from "../context/CommunityContext";
import PostCard from "./PostCard";

export default function CommunitySearchView() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    handleTagFilter,
    currentPosts,
    handleToggleLike,
    handleToggleRepost,
    handleAddComment,
  } = useCommunity();

  const TRENDING_TOPICS = [
    { tag: "Mindfulness", postsCount: "1.2k posts" },
    { tag: "SleepRoutine", postsCount: "840 posts" },
    { tag: "Sharing", postsCount: "2.4k posts" },
    { tag: "CurhatAnonim", postsCount: "620 posts" },
    { tag: "Overthinking", postsCount: "950 posts" },
  ];

  const SUGGESTED_CREATORS = [
    { name: "Sarah Jenkins", handle: "@sarahj", avatar: "SJ", bio: "Breathing enthusiast & mindfulness explorer" },
    { name: "Dimas Anggara", handle: "@dimas_a", avatar: "DA", bio: "Sleep hygiene advocate · Gen Z Wellness" },
    { name: "Nadia Putri", handle: "@nadiap", avatar: "NP", bio: "Mental health peer supporter" },
  ];

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-5 animate-in fade-in duration-200">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-700/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, creators, or conversations..."
          autoFocus
          className="w-full bg-white rounded-2xl pl-11 pr-10 py-3 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/40 border border-brown-900/10 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-700/40 hover:text-brown-900 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Trending Topics */}
      {!searchQuery && (
        <div className="bg-white rounded-2xl border border-brown-900/8 p-4 shadow-2xs">
          <h3 className="font-bold text-xs text-brown-900 mb-3 uppercase tracking-wider">
            Trending in Zyba Community
          </h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TOPICS.map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => handleTagFilter(t.tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  selectedTag === t.tag
                    ? "bg-brown-900 text-white border-brown-900 shadow-2xs"
                    : "bg-[#FAF7F2] text-brown-900 border-brown-900/8 hover:border-orange-500"
                }`}
              >
                <span>#{t.tag}</span>
                <span className="text-[10px] opacity-60">{t.postsCount}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Follows */}
      {!searchQuery && (
        <div className="bg-white rounded-2xl border border-brown-900/8 p-4 shadow-2xs">
          <h3 className="font-bold text-xs text-brown-900 mb-3 uppercase tracking-wider">
            Suggested Creators
          </h3>
          <div className="space-y-3">
            {SUGGESTED_CREATORS.map((c) => (
              <div key={c.handle} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0">
                    {c.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brown-900 truncate">{c.name}</p>
                    <p className="text-[11px] text-brown-700/60 truncate">{c.handle} · {c.bio}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengikuti ${c.name}`)}
                  className="rounded-full bg-brown-900 text-white text-xs font-bold px-4 py-1.5 hover:bg-orange-500 transition-colors shrink-0 shadow-2xs"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results / Posts */}
      <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-brown-900/5 text-xs font-bold text-brown-700">
          {searchQuery ? `Hasil Pencarian untuk "${searchQuery}"` : "Semua Cerita Terkini"}
        </div>
        {currentPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-brown-700/50">
            Tidak ditemukan cerita yang sesuai pencarian.
          </div>
        ) : (
          currentPosts.map((post) => (
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
