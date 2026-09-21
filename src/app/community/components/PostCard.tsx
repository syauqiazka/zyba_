"use client";

import { useState } from "react";
import { useCommunity } from "../context/CommunityContext";

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
}

export interface Post {
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
  comments?: CommentItem[];
}

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleRepost?: (id: string) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onTagClick?: (tag: string) => void;
}

// SVG icon atoms — lightweight, pixel-perfect
function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconComment() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconRepost({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  );
}

const renderContent = (text: string, onTagClick?: (tag: string) => void) =>
  text.split(/(#[a-zA-Z0-9_]+)/g).map((part, i) =>
    part.startsWith("#") ? (
      <button
        key={i}
        type="button"
        onClick={() => onTagClick?.(part.slice(1))}
        className="text-orange-500 font-semibold hover:underline inline cursor-pointer"
      >
        {part}
      </button>
    ) : (
      part
    )
  );

function AvatarBubble({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-10 h-10 text-xs";
  // deterministic pastel from initials
  const colors = [
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-mood-depressed/20 text-purple-700 border-purple-200",
    "bg-mood-happy/30 text-yellow-700 border-yellow-200",
    "bg-mood-sad/20 text-orange-700 border-orange-200",
  ];
  const color = colors[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length];
  return (
    <div className={`${sz} ${color} rounded-full border font-display font-bold flex items-center justify-center shrink-0 shadow-2xs`}>
      {initials}
    </div>
  );
}

export default function PostCard({ post, onToggleLike, onToggleRepost, onAddComment, onTagClick }: PostCardProps) {
  const { savedPostIds = [], handleToggleSave = () => {} } = useCommunity();
  const isSaved = savedPostIds.includes(post.id);
  const onToggleSave = handleToggleSave;

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onAddComment?.(post.id, commentInput.trim());
    setCommentInput("");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/community#${post.id}`).catch(() => {});
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  return (
    <article className="flex gap-3.5 px-5 py-4 border-b border-brown-900/[0.06] hover:bg-[#faf7f2]/50 transition-colors group last:border-b-0">
      {/* Left column: Avatar + vertical thread line */}
      <div className="flex flex-col items-center">
        <AvatarBubble initials={post.avatar} />
        {/* Thread line — only when comments expand */}
        {showComments && post.comments && post.comments.length > 0 && (
          <div className="w-0.5 flex-1 bg-brown-900/10 mt-2 mb-1 min-h-[20px] rounded-full" />
        )}
      </div>

      {/* Right column: Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-display font-bold text-sm text-brown-900 truncate">{post.author}</span>
            {post.isVerified && (
              <span
                title="Terverifikasi ZYBA"
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-700 text-[9px] font-extrabold border border-green-200 shrink-0"
              >✓</span>
            )}
            <span className="text-xs text-brown-700/50 font-normal shrink-0">· {post.time}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Topic tag */}
            <button
              type="button"
              onClick={() => onTagClick?.(post.tag)}
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-pill bg-cream text-brown-700 border border-brown-900/10 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 transition-colors leading-none"
            >
              #{post.tag.toLowerCase()}
            </button>
            <button
              type="button"
              className="text-brown-700/30 hover:text-brown-900 transition-colors opacity-0 group-hover:opacity-100 p-1"
              title="Opsi lainnya"
            >
              <IconMore />
            </button>
          </div>
        </div>

        {/* Post body */}
        <p className="text-sm text-brown-900 leading-relaxed mb-3">
          {renderContent(post.content, onTagClick)}
        </p>

        {/* Media */}
        {post.mediaUrl && (
          <div className="mb-3">
            <img
              src={post.mediaUrl}
              alt="Media"
              className="rounded-2xl max-h-72 w-full object-cover border border-brown-900/8"
            />
          </div>
        )}

        {/* Action row — Threads-style: icon only, counts small */}
        <div className="flex items-center gap-1 -ml-1.5 mt-1">
          {/* Like */}
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all active:scale-90 ${
              post.userLiked
                ? "text-orange-500"
                : "text-brown-700/50 hover:text-orange-500 hover:bg-orange-50"
            }`}
            title="Suka"
          >
            <IconHeart filled={post.userLiked} />
            <span className="text-[11px] font-semibold min-w-[12px]">{post.likes}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ${
              showComments
                ? "text-brown-900"
                : "text-brown-700/50 hover:text-brown-900 hover:bg-cream"
            }`}
            title="Balas"
          >
            <IconComment />
            <span className="text-[11px] font-semibold min-w-[12px]">{post.commentsCount}</span>
          </button>

          {/* Repost */}
          <button
            type="button"
            onClick={() => onToggleRepost?.(post.id)}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ${
              post.userReposted
                ? "text-green-600"
                : "text-brown-700/50 hover:text-green-600 hover:bg-green-50"
            }`}
            title="Repost"
          >
            <IconRepost active={post.userReposted} />
            <span className="text-[11px] font-semibold min-w-[12px]">{post.repostsCount ?? 0}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 px-1.5 py-1 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-cream transition-all"
            title="Bagikan"
          >
            <IconShare />
          </button>

          {/* Bookmark / Save (Threads style) */}
          <button
            type="button"
            onClick={() => {
              if (onToggleSave) onToggleSave(post.id);
            }}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ml-auto ${
              isSaved
                ? "text-orange-500"
                : "text-brown-700/40 hover:text-brown-900 hover:bg-cream"
            }`}
            title={isSaved ? "Hapus dari Tersimpan" : "Simpan Thread"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Share toast */}
        {showShareToast && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] bg-green-100 text-green-700 px-3 py-1 rounded-pill font-semibold">
            ✓ Tautan berhasil disalin!
          </div>
        )}

        {/* Inline comment thread (Threads-style) */}
        {showComments && (
          <div className="mt-3 flex flex-col gap-0">
            {post.comments && post.comments.length > 0 && (
              <div className="flex flex-col gap-3 pb-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 items-start">
                    <AvatarBubble initials={c.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-[12px] text-brown-900">{c.author}</span>
                        <span className="text-[10px] text-brown-700/50">· {c.time}</span>
                      </div>
                      <p className="text-xs text-brown-900 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            <div className="flex items-center gap-2 pt-2 border-t border-brown-900/8">
              <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0">
                AL
              </div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                placeholder="Tulis balasan yang suportif..."
                className="flex-1 bg-cream/60 rounded-pill border border-brown-900/8 px-4 py-2 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleSendComment}
                disabled={!commentInput.trim()}
                className="rounded-pill bg-brown-900 text-white text-xs font-semibold px-4 py-2 hover:bg-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Kirim
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
