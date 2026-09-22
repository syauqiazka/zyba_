"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useCommunity } from "../context/CommunityContext";

const TAG_OPTIONS = ["Sharing", "Mindfulness", "SleepRoutine", "ZybaRocks", "MentalHealth", "SelfCare"];

interface CreatePostModalProps {
  open: boolean;
  newPostContent: string;
  selectedTag: string;
  onContentChange: (content: string) => void;
  onTagChange: (tag: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CreatePostModal({
  open,
  newPostContent,
  selectedTag,
  onContentChange,
  onTagChange,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    if (open) setShowTagDropdown(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="New thread"
      className="fixed bottom-20 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[480px] bg-white rounded-3xl shadow-2xl border border-brown-900/12 p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brown-900/6">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-brown-700/70 hover:text-brown-900 transition-colors"
        >
          Batal
        </button>
        <span className="font-bold text-sm text-brown-900 tracking-tight">
          Postingan Baru
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

      {/* User info + topic */}
      <div className="flex items-start gap-3 pt-1">
        <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0 shadow-2xs">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-brown-900">Pengguna ZYBA</span>
            <span className="text-[11px] text-brown-700/40">›</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream/60 border border-brown-900/10 text-orange-600 px-2 py-0.5 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <span className="text-orange-500 font-bold">#</span>
                <span>{selectedTag}</span>
                <ChevronDown size={9} className="ml-0.5 opacity-60" />
              </button>
              {showTagDropdown && (
                <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-brown-900/10 rounded-lg shadow-lg p-1 w-44 animate-in fade-in zoom-in-95 duration-150">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        onTagChange(tag);
                        setShowTagDropdown(false);
                      }}
                      className={`w-full text-left text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                        selectedTag === tag ? "bg-brown-900 text-white" : "text-brown-700 hover:bg-cream"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={newPostContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Ada cerita apa hari ini?"
            rows={3}
            autoFocus
            className="w-full text-xs text-brown-900 placeholder:text-brown-700/40 resize-none focus:outline-none bg-transparent pt-2 leading-relaxed"
          />
        </div>
      </div>

      {/* Media Icons Row */}
      <div className="flex items-center gap-3.5 text-brown-700/50 pl-12">
        <button type="button" className="hover:text-brown-900 transition-colors" title="Add photo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <button type="button" className="hover:text-brown-900 transition-colors font-mono text-[11px] font-bold border border-current px-1 rounded" title="Add GIF">GIF</button>
        <button type="button" className="hover:text-brown-900 transition-colors" title="Add emoji">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        <button type="button" className="hover:text-brown-900 transition-colors" title="Create poll">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>
        <button type="button" className="hover:text-brown-900 transition-colors" title="Add location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
        <button type="button" className="hover:text-brown-900 transition-colors" title="Voice note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-brown-900/6 flex items-center justify-between">
        <span className="text-[10px] text-brown-700/40">Siapa saja bisa melihat</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-semibold text-brown-700 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!newPostContent.trim()}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
              newPostContent.trim()
                ? "bg-orange-500 text-white hover:bg-brown-900 active:scale-95 shadow-2xs"
                : "bg-brown-900/10 text-brown-900/30 cursor-not-allowed"
            }`}
          >
            Posting
          </button>
        </div>
      </div>
    </div>
  );
}