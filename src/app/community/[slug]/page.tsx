"use client";

import React from "react";
import { useRef } from "react";
import { useCommunity } from "../context/CommunityContext";
import CommunitySearchView from "../components/CommunitySearchView";
import CommunityMessagesView from "../components/CommunityMessagesView";
import CommunityActivityView from "../components/CommunityActivityView";
import CommunityProfileView from "../components/CommunityProfileView";
import CommunityInsightsView from "../components/CommunityInsightsView";
import ComposeBox from "../components/ComposeBox";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import CrisisBanner from "@/app/companion/components/CrisisBanner";
import { Sprout } from "lucide-react";

/**
 * Community Sub-Route Page — /community/[slug]
 *
 * Renders the appropriate view based on the URL slug.
 * currentView is derived from the pathname in CommunityContext.
 */
export default function CommunitySlugPage() {
  const {
    currentView,
    currentPosts,
    showCrisisNotice,
    setShowCrisisNotice,
    searchQuery,
    selectedTag,
    handleTagFilter,
    isPostModalOpen,
    setIsPostModalOpen,
    newPostContent,
    setNewPostContent,
    handleAddPost,
    handleToggleLike,
    handleToggleRepost,
    handleAddComment,
  } = useCommunity();

  const composeRef = useRef<HTMLDivElement>(null);

  // Sub-view router
  if (currentView === "SEARCH") {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <CommunitySearchView />
      </div>
    );
  }

  if (currentView === "MESSAGES") {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <CommunityMessagesView />
      </div>
    );
  }

  if (currentView === "ACTIVITY") {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <CommunityActivityView />
      </div>
    );
  }

  if (currentView === "PROFILE") {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <CommunityProfileView />
        <CreatePostModal
          open={isPostModalOpen}
          newPostContent={newPostContent}
          selectedTag={selectedTag}
          onContentChange={setNewPostContent}
          onTagChange={handleTagFilter}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={async () => {
            await handleAddPost(newPostContent, selectedTag);
            setNewPostContent("");
            setIsPostModalOpen(false);
          }}
        />
      </div>
    );
  }

  if (currentView === "INSIGHTS") {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <CommunityInsightsView />
      </div>
    );
  }

  // Feed Titles for feed-based views
  const VIEW_TITLES: Record<string, string> = {
    FOR_YOU: "For you",
    FOLLOWING: "Following",
    SAVED: "Saved threads",
    LIKED: "Liked threads",
    GHOST_POSTS: "Ghost posts (Curhat Anonim)",
    ARCHIVE: "Archive",
  };

  const currentTitle = VIEW_TITLES[currentView] || "For you";

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center py-4 px-3 sm:px-6 relative">
      <div className="w-full max-w-[620px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <h1 className="font-bold text-base md:text-lg text-brown-900 tracking-tight">
            {currentTitle}
          </h1>
          <button
            type="button"
            className="text-brown-700/40 hover:text-brown-900 p-1.5 rounded-lg transition-colors"
            title="Opsi feed"
            aria-label="Opsi feed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        {/* Crisis Banner */}
        {showCrisisNotice && (
          <div className="mb-3 px-2">
            <CrisisBanner onClose={() => setShowCrisisNotice(false)} />
          </div>
        )}

        {/* Inline Compose Box */}
        {currentView === "FOR_YOU" && (
          <div ref={composeRef} className="mb-3 px-1">
            <div className="bg-white rounded-2xl border border-brown-900/10 p-4 shadow-2xs">
              <ComposeBox
                onAddPost={handleAddPost}
                onRiskDetected={() => setShowCrisisNotice(true)}
              />
            </div>
          </div>
        )}

        {/* Post list */}
        <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden mb-12 divide-y divide-brown-900/6">
          {currentPosts.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center mb-3 shadow-xs">
                <Sprout className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-bold text-sm text-brown-900 mb-1">
                {currentView === "FOLLOWING"
                  ? "Belum ada postingan"
                  : currentView === "SAVED"
                  ? "Belum ada thread yang disimpan"
                  : currentView === "LIKED"
                  ? "Belum ada thread yang disukai"
                  : currentView === "GHOST_POSTS"
                  ? "Belum ada curhatan anonim"
                  : "Belum ada cerita di sini"}
              </h3>
              <p className="text-xs text-brown-700/60 max-w-xs leading-relaxed">
                {currentView === "FOLLOWING"
                  ? "Belum mengikuti siapa pun. Temukan orang untuk diikuti di halaman Cari."
                  : currentView === "SAVED"
                  ? "Tekan ikon bookmark pada cerita mana saja untuk menyimpannya di sini."
                  : currentView === "LIKED"
                  ? "Cerita yang kamu sukai akan otomatis terkumpul di feed ini."
                  : "Mulai berbagi cerita atau eksplorasi topik komunitas lainnya!"}
              </p>
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

      {/* Floating + Button */}
      <button
        type="button"
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-500 text-white shadow-xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40"
        title="Tulis thread baru"
        aria-label="Tulis thread baru"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        open={isPostModalOpen}
        newPostContent={newPostContent}
        selectedTag={selectedTag}
        onContentChange={setNewPostContent}
        onTagChange={handleTagFilter}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={async () => {
          await handleAddPost(newPostContent, selectedTag);
          setNewPostContent("");
          setIsPostModalOpen(false);
        }}
      />
    </div>
  );
}
