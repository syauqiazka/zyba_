"use client";

import { useState } from "react";
import { detectRisk } from "@/lib/crisisDetection";

interface ComposeBoxProps {
  onAddPost: (content: string, tag: string, mediaUrl?: string) => void;
  onRiskDetected?: () => void;
  currentUserInitials?: string;
}

const TAG_OPTIONS = ["Sharing", "Mindfulness", "SleepRoutine", "ZybaRocks", "MentalHealth", "SelfCare"];

export default function ComposeBox({ onAddPost, onRiskDetected, currentUserInitials = "AL" }: ComposeBoxProps) {
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Sharing");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const QUICK_EMOJIS = ["🌿", "☕", "✨", "🌙", "🧡", "💪", "🌻", "🧘‍♂️"];

  const handlePost = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (detectRisk(trimmed) && onRiskDetected) onRiskDetected();
    onAddPost(trimmed, selectedTag);
    setContent("");
    setShowTagPicker(false);
    setShowEmojiPicker(false);
    setIsFocused(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const hasContent = content.trim().length > 0;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isFocused || hasContent
          ? "bg-[#faf7f2] border-brown-900/20 shadow-xs"
          : "bg-[#faf7f2]/70 border-brown-900/10 hover:border-brown-900/20"
      }`}
    >
      {/* Privacy notice banner */}
      <div className="flex items-center justify-between text-[11px] text-brown-700/70 px-4 pt-3 pb-2 border-b border-brown-900/6">
        <span className="flex items-center gap-1.5 font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Terlihat oleh seluruh komunitas
        </span>
        <span className="text-[10px] text-orange-600 font-medium hidden sm:inline">
          Curhat privat? Gunakan <span className="font-bold underline cursor-pointer">Zyba Companion →</span>
        </span>
      </div>

      {/* Main compose area */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Current user avatar */}
        <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 text-orange-600 font-display font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
          {currentUserInitials}
        </div>

        {/* Textarea */}
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Ada cerita apa hari ini? Bagikan ceritamu dengan hangat..."
            rows={isFocused || hasContent ? 3 : 2}
            className="w-full text-sm text-brown-900 placeholder:text-brown-700/40 resize-none bg-transparent focus:outline-none leading-relaxed transition-all"
          />

          {/* Tag pill */}
          <div className="flex items-center gap-2 mt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowTagPicker(!showTagPicker);
                  setShowEmojiPicker(false);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-brown-900/10 text-orange-600 px-3 py-1 rounded-pill hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-2xs"
              >
                <span className="text-orange-500 font-bold">#</span>
                <span>{selectedTag}</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-0.5 opacity-60">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {showTagPicker && (
                <div className="absolute top-full left-0 mt-1.5 z-30 bg-white border border-brown-900/10 rounded-2xl shadow-xl p-2.5 flex flex-wrap gap-1.5 w-64 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-full text-[10px] font-bold text-brown-700/60 uppercase tracking-wider px-1 pb-1">
                    Pilih Topik Cerita
                  </div>
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTag(tag);
                        setShowTagPicker(false);
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill transition-all ${
                        selectedTag === tag
                          ? "bg-brown-900 text-white shadow-2xs"
                          : "bg-cream text-brown-700 hover:bg-orange-100 hover:text-orange-600"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action row */}
      <div className="flex items-center justify-between px-4 pb-3 pt-2 border-t border-brown-900/6 relative">
        <div className="flex items-center gap-1 pl-12 relative">
          {/* Emoji Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowTagPicker(false);
              }}
              className="p-1.5 rounded-lg text-brown-700/60 hover:text-brown-900 hover:bg-white transition-colors flex items-center gap-1 text-xs"
              title="Sisipkan emoji"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <span className="text-[11px] font-medium hidden sm:inline">Emoji</span>
            </button>

            {/* Quick Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-30 bg-white border border-brown-900/10 rounded-2xl shadow-xl p-2 flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="w-8 h-8 rounded-xl hover:bg-cream text-base flex items-center justify-center transition-transform active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!hasContent}
          className={`rounded-pill px-6 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
            hasContent
              ? "bg-orange-500 text-white hover:bg-brown-900 active:scale-95 shadow-xs"
              : "bg-brown-900/10 text-brown-900/30 cursor-not-allowed"
          }`}
        >
          <span>Posting</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
