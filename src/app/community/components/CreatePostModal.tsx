"use client";

import React, { useRef, useEffect, useState } from "react";

interface CreatePostModalProps {
  open: boolean;
  newPostContent: string;
  selectedTag: string;
  onContentChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Floating "New thread" Card — 100% Threads Layout (Image 2)
 * Features:
 * - Cancel (left) | New thread (center) | Icons (right)
 * - Avatar + username + "> Community or topic"
 * - "What's new?" input
 * - Media row: Image, GIF, Emoji, Poll, Location, Audio
 * - "+ Add to thread"
 * - "Post options" (left) | "Post" button (right)
 */
export default function CreatePostModal({
  open,
  newPostContent,
  selectedTag,
  onContentChange,
  onTagChange,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [threadParts, setThreadParts] = useState<string[]>([]);
  const [postOption, setPostOption] = useState("Anyone can reply");
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-label="New thread"
      className="fixed bottom-20 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[480px] bg-white rounded-3xl shadow-2xl border border-brown-900/12 p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* 1. Header: Cancel (left) — New thread (center) — Draft/Options (right) */}
      <div className="flex items-center justify-between pb-3 border-b border-brown-900/6">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-brown-700/70 hover:text-brown-900 transition-colors"
        >
          Cancel
        </button>

        <span className="font-bold text-sm text-brown-900 tracking-tight">
          New thread
        </span>

        <div className="flex items-center gap-2 text-brown-700/50">
          <button type="button" className="hover:text-brown-900 p-1" title="Drafts">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </button>
          <button type="button" className="hover:text-brown-900 p-1" title="Options">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. User info + Breadcrumb "Community or topic" */}
      <div className="flex items-start gap-3 pt-1">
        <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0">
          U
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-brown-900">harikitte_ikou</span>
            <span className="text-[11px] text-brown-700/40">›</span>
            <select
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="text-[11px] font-semibold text-brown-700 bg-cream/60 rounded-md px-2 py-0.5 border border-brown-900/10 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="Sharing">#Sharing</option>
              <option value="Mindfulness">#Mindfulness</option>
              <option value="SleepRoutine">#SleepRoutine</option>
              <option value="CurhatAnonim">#CurhatAnonim</option>
              <option value="Motivation">#Motivation</option>
            </select>
          </div>

          {/* 3. "What's new?" Textarea */}
          <textarea
            value={newPostContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="What's new?"
            rows={3}
            autoFocus
            className="w-full text-xs text-brown-900 placeholder:text-brown-700/40 resize-none focus:outline-none bg-transparent pt-2 leading-relaxed"
          />

          {/* 4. Media Icons Row (Image 2) */}
          <div className="flex items-center gap-3.5 text-brown-700/50 pt-2">
            {/* Image */}
            <button type="button" className="hover:text-brown-900 transition-colors" title="Add photo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            {/* GIF */}
            <button type="button" className="hover:text-brown-900 transition-colors font-mono text-[11px] font-bold border border-current px-1 rounded" title="Add GIF">
              GIF
            </button>
            {/* Emoji */}
            <button type="button" className="hover:text-brown-900 transition-colors" title="Add emoji">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
            {/* Poll */}
            <button type="button" className="hover:text-brown-900 transition-colors" title="Create poll">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </button>
            {/* Location */}
            <button type="button" className="hover:text-brown-900 transition-colors" title="Add location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
            {/* Audio */}
            <button type="button" className="hover:text-brown-900 transition-colors" title="Voice note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Sub-Action: "+ Add to thread" */}
      <div className="pt-2 pl-12 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setThreadParts([...threadParts, ""])}
          className="text-xs text-brown-700/50 hover:text-brown-900 transition-colors flex items-center gap-1.5"
        >
          <span className="w-4 h-4 rounded-full border border-brown-900/20 flex items-center justify-center text-[10px]">+</span>
          <span>Add to thread</span>
        </button>
      </div>

      {/* 6. Footer: Post options (left) | Post button (right) */}
      <div className="pt-3 border-t border-brown-900/6 flex items-center justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            className="text-xs text-brown-700/60 hover:text-brown-900 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span>{postOption}</span>
          </button>

          {showOptionsDropdown && (
            <div className="absolute bottom-6 left-0 bg-white rounded-xl shadow-lg border border-brown-900/10 p-1.5 w-44 z-20 space-y-1">
              {["Anyone can reply", "Followers only", "Only you can reply"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setPostOption(opt);
                    setShowOptionsDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-cream text-brown-900 font-medium"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!newPostContent.trim()}
          className="rounded-full bg-orange-500 text-white text-xs font-bold px-6 py-2 hover:bg-orange-600 disabled:opacity-30 transition-all shadow-xs active:scale-95"
        >
          Post
        </button>
      </div>
    </div>
  );
}
