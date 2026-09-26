"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommunity } from "../context/CommunityContext";
import { Check } from "lucide-react";
import { useUserStatus, UserStatusConfig } from "@/hooks/useUserStatus";
import { isAvatarUrl, resolveAvatar } from "@/lib/avatarUtils";

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
}

export interface Post {
  id: string;
  userId?: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  time: string;
  content: string;
  imageUrl?: string | null;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  repostsCount?: number;
  userLiked: boolean;
  userReposted?: boolean;
  tag: string;
  comments?: CommentItem[];
  createdAt?: string;
}

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleRepost?: (id: string) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onTagClick?: (tag: string) => void;
  currentUserId?: string | null;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
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
function IconRepost() {
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

// ─── Render hashtags ───────────────────────────────────────────────────────────
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
function AvatarBubble({
  initials,
  size = "md",
  statusConfig,
}: {
  initials: string;
  size?: "sm" | "md";
  statusConfig?: UserStatusConfig;
}) {
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-10 h-10 text-xs";
  const colors = [
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-mood-depressed/20 text-purple-700 border-purple-200",
    "bg-mood-happy/30 text-yellow-700 border-yellow-200",
    "bg-mood-sad/20 text-orange-700 border-orange-200",
  ];
  const charCode = (initials || "Z").charCodeAt(0) + ((initials || "Y").charCodeAt(1) || 0);
  const color = colors[charCode % colors.length];
  // Status dot offset depends on avatar size
  const dotSize = size === "sm" ? "w-2.5 h-2.5 border-[2px]" : "w-3.5 h-3.5 border-[2.5px]";

  const isImg = isAvatarUrl(initials);
  const resolved = resolveAvatar(initials);

  return (
    <div className="relative shrink-0">
      <div className={`${sz} ${isImg ? "bg-cream border-brown-900/10" : color} rounded-full border font-display font-bold flex items-center justify-center shadow-2xs overflow-hidden`}>
        {isImg ? (
          <img
            src={initials}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <span className={isImg ? "text-xs" : ""}>{resolved}</span>
      </div>
      {/* Status Dot — only shown for current user's own posts */}
      {statusConfig && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${dotSize} rounded-full border-white flex items-center justify-center`}
          style={{ backgroundColor: statusConfig.hexColor }}
          title={statusConfig.label}
        >
          {/* DND dash mark */}
          {statusConfig.status === "dnd" && (
            <div className="w-1.5 h-[2px] bg-white rounded-full" />
          )}
          {/* Invisible inner dot */}
          {statusConfig.status === "invisible" && (
            <div className="w-1 h-1 rounded-full bg-white/80" />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dropdown Menu Item ────────────────────────────────────────────────────────
function MenuItem({
  label,
  icon,
  onClick,
  danger = false,
  separator = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}) {
  return (
    <>
      {separator && <div className="h-px bg-brown-900/8 my-1" />}
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors text-left ${
          danger
            ? "text-red-500 hover:bg-red-50"
            : "text-brown-900 hover:bg-cream"
        }`}
      >
        <span>{label}</span>
        <span className={`shrink-0 opacity-70 ${danger ? "text-red-400" : "text-brown-700"}`}>
          {icon}
        </span>
      </button>
    </>
  );
}

// ─── Icon SVGs for menu ────────────────────────────────────────────────────────
const IcLink = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IcBookmark = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const IcEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IcUserX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>;
const IcSlash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
const IcAlertCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IcEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcArchive = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
const IcMessageOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h11"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ─── PostCard ─────────────────────────────────────────────────────────────────
export default function PostCard({ post, onToggleLike, onToggleRepost, onAddComment, onTagClick, currentUserId }: PostCardProps) {
  const myStatus = useUserStatus();
  const router = useRouter();
  const { savedPostIds = [], handleToggleSave = () => {}, handleDeletePost, handleArchivePost } = useCommunity();
  const isSaved = savedPostIds.includes(post.id);

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const isOwner = currentUserId != null && post.userId != null && String(currentUserId) === String(post.userId);

  const handleAuthorClick = () => {
    if (post.userId) router.push(`/community/profile/${post.userId}`);
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onAddComment?.(post.id, commentInput.trim());
    setCommentInput("");
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/community#${post.id}`).catch(() => {});
    }
    setShowShareToast(true);
    setMenuOpen(false);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleShare = () => {
    handleCopyLink();
  };

  return (
    <article className="flex gap-3.5 px-5 py-4 border-b border-brown-900/[0.06] hover:bg-[#faf7f2]/50 transition-colors group last:border-b-0">
      {/* Left: Avatar + thread line */}
      <div className="flex flex-col items-center">
        <button type="button" onClick={handleAuthorClick} className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarBubble
            initials={post.avatar}
            statusConfig={isOwner ? myStatus : undefined}
          />
        </button>
        {showComments && post.comments && post.comments.length > 0 && (
          <div className="w-0.5 flex-1 bg-brown-900/10 mt-2 mb-1 min-h-[20px] rounded-full" />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={handleAuthorClick}
              className="font-display font-bold text-sm text-brown-900 truncate hover:underline cursor-pointer"
            >
              {post.author}
            </button>
            {post.isVerified && (
              <span title="Terverifikasi ZYBA" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-700 border border-green-200 shrink-0">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
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

            {/* Three-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => { setMenuOpen((v) => !v); setConfirmDelete(false); }}
                className="text-brown-700/30 hover:text-brown-900 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-cream"
                title="Opsi lainnya"
              >
                <IconMore />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-white rounded-2xl shadow-xl border border-brown-900/10 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {isOwner ? (
                    /* ── OWNER MENU ─────────────────────────── */
                    <>
                      {confirmDelete ? (
                        <div className="px-3 py-3">
                          <p className="text-xs text-brown-700 mb-3 leading-relaxed">Yakin hapus postingan ini? Tindakan ini tidak bisa dibatalkan.</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(false)}
                              className="flex-1 text-xs font-semibold py-2 rounded-xl border border-brown-900/15 text-brown-700 hover:bg-cream transition-colors"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => { handleDeletePost?.(post.id); setMenuOpen(false); }}
                              className="flex-1 text-xs font-semibold py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <MenuItem label="Hapus" icon={<IcTrash />} onClick={() => setConfirmDelete(true)} danger />
                          <MenuItem label="Edit" icon={<IcEdit />} onClick={() => { setMenuOpen(false); /* TODO: open edit modal */ }} />
                          <MenuItem label="Arsipkan" icon={<IcArchive />} onClick={() => { handleArchivePost?.(post.id); setMenuOpen(false); }} separator />
                          <MenuItem label="Matikan komentar" icon={<IcMessageOff />} onClick={() => setMenuOpen(false)} />
                          <MenuItem label="Salin tautan" icon={<IcLink />} onClick={handleCopyLink} separator />
                        </>
                      )}
                    </>
                  ) : (
                    /* ── VISITOR MENU ───────────────────────── */
                    <>
                      <MenuItem label="Salin tautan" icon={<IcLink />} onClick={handleCopyLink} />
                      <MenuItem label="Simpan" icon={<IcBookmark />} onClick={() => { handleToggleSave(post.id); setMenuOpen(false); }} />
                      <MenuItem label="Tidak tertarik" icon={<IcEyeOff />} onClick={() => setMenuOpen(false)} separator />
                      <MenuItem label="Bisukan" icon={<IcUserX />} onClick={() => setMenuOpen(false)} separator />
                      <MenuItem label="Blokir" icon={<IcSlash />} onClick={() => setMenuOpen(false)} danger />
                      <MenuItem label="Laporkan" icon={<IcAlertCircle />} onClick={() => setMenuOpen(false)} danger />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post body */}
        <p className="text-sm text-brown-900 leading-relaxed mb-3">
          {renderContent(post.content, onTagClick)}
        </p>

        {/* Media */}
        {(post.imageUrl || post.mediaUrl) && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-brown-900/10 bg-black/5 max-h-[480px]">
            <img
              src={post.imageUrl || post.mediaUrl}
              alt="Attachment"
              className="rounded-2xl max-h-[480px] w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open((post.imageUrl || post.mediaUrl)!, "_blank")}
              loading="lazy"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) parent.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-1 -ml-1.5 mt-1">
          {/* Like */}
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all active:scale-90 ${
              post.userLiked ? "text-orange-500" : "text-brown-700/50 hover:text-orange-500 hover:bg-orange-50"
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
              showComments ? "text-brown-900" : "text-brown-700/50 hover:text-brown-900 hover:bg-cream"
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
              post.userReposted ? "text-green-600" : "text-brown-700/50 hover:text-green-600 hover:bg-green-50"
            }`}
            title="Repost"
          >
            <IconRepost />
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

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={() => { if (handleToggleSave) handleToggleSave(post.id); }}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ml-auto ${
              isSaved ? "text-orange-500" : "text-brown-700/40 hover:text-brown-900 hover:bg-cream"
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
            <span>✓</span> Tautan berhasil disalin!
          </div>
        )}

        {/* Inline comment thread */}
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
