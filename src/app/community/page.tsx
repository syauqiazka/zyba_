"use client";

import React, { useRef } from "react";
import ComposeBox from "./components/ComposeBox";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import CrisisBanner from "@/app/companion/components/CrisisBanner";
import { useCommunity } from "./context/CommunityContext";
import { Sprout } from "lucide-react";

/**
 * Community Root Page — /community
 * Renders the "For you" feed (default view).
 * All other views are handled by /community/[slug]/page.tsx
 */
export default function CommunityPage() {
  const {
    currentPosts,
    showCrisisNotice,
    setShowCrisisNotice,
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
    currentUserId,
  } = useCommunity();

  const composeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center py-4 px-3 sm:px-6 relative">
      <div className="w-full max-w-[620px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <h1 className="font-bold text-base md:text-lg text-brown-900 tracking-tight">
            For you
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
        <div ref={composeRef} className="mb-3 px-1">
          <div className="bg-white rounded-2xl border border-brown-900/10 p-4 shadow-2xs">
            <ComposeBox
              onAddPost={handleAddPost}
              onRiskDetected={() => setShowCrisisNotice(true)}
            />
          </div>
        </div>

        {/* Post list */}
        <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden mb-12 divide-y divide-brown-900/6">
          {currentPosts.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center mb-3 shadow-xs">
                <Sprout className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-bold text-sm text-brown-900 mb-1">
                Belum ada cerita di sini
              </h3>
              <p className="text-xs text-brown-700/60 max-w-xs leading-relaxed">
                Mulai berbagi cerita atau eksplorasi topik komunitas lainnya!
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
                currentUserId={currentUserId}
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
