"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCommunity } from "../context/CommunityContext";
import { Check, X } from "lucide-react";
import { useUserStatus, UserStatusConfig } from "@/hooks/useUserStatus";
import UserAvatar from "@/components/ui/UserAvatar";
import ReportModal from "./ReportModal";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  userId?: string;
  parentId?: string | null;
  replyingToAuthor?: string | null;
  replies?: CommentItem[];
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
  commentsDisabled?: boolean;
}

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleRepost?: (id: string) => void;
  onAddComment?: (postId: string, commentText: string, parentId?: string | null) => void;
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
function IconComment({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={disabled ? 0.35 : 1}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      {disabled && <line x1="3" y1="3" x2="21" y2="21" strokeWidth="1.5" />}
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
function IconReply() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

// ─── Render hashtags ────────────────────────────────────────────────────────
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
  return (
    <UserAvatar
      src={initials}
      name={initials}
      size={size}
      showStatus={Boolean(statusConfig)}
      statusConfig={statusConfig as any}
    />
  );
}

// ─── Dropdown Menu Item ─────────────────────────────────────────────────────
function MenuItem({
  label,
  sublabel,
  icon,
  onClick,
  danger = false,
  separator = false,
  active = false,
}: {
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
  active?: boolean;
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
            : active
            ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
            : "text-brown-900 hover:bg-cream"
        }`}
      >
        <div className="flex flex-col min-w-0">
          <span className="truncate">{label}</span>
          {sublabel && <span className="text-[10px] text-brown-700/60 font-normal">{sublabel}</span>}
        </div>
        <span className={`shrink-0 opacity-70 ${danger ? "text-red-400" : active ? "text-orange-500" : "text-brown-700"}`}>
          {icon}
        </span>
      </button>
    </>
  );
}

// ─── Icon SVGs for menu ────────────────────────────────────────────────────
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
const IcMessage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

// ─── Confirm Dialog ────────────────────────────────────────────────────────
function ConfirmPanel({
  message,
  confirmLabel,
  confirmClass,
  onCancel,
  onConfirm,
}: {
  message: React.ReactNode;
  confirmLabel: string;
  confirmClass: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="px-3 py-3">
      <p className="text-xs text-brown-700 mb-3 leading-relaxed">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-xs font-semibold py-2 rounded-xl border border-brown-900/15 text-brown-700 hover:bg-cream transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-colors ${confirmClass}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────
function EditModal({
  post,
  onClose,
  onSave,
}: {
  post: Post;
  onClose: () => void;
  onSave: (newContent: string) => Promise<void>;
}) {
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, []);

  const handleSave = async () => {
    if (!content.trim() || content.trim() === post.content.trim()) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await onSave(content.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10">
          <h2 className="font-display font-bold text-sm text-brown-900">Edit Postingan</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={4}
            className="w-full resize-none bg-cream/50 rounded-xl border border-brown-900/10 px-4 py-3 text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all leading-relaxed"
            placeholder="Apa yang ingin kamu ceritakan?"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] text-brown-700/40">{content.length}/1000</span>
            <span className="text-[11px] text-brown-700/40 italic">Postingan yang diedit tidak menghapus interaksi</span>
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-brown-900/15 text-sm font-semibold text-brown-700 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
            ) : (
              "Simpan perubahan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single Comment Row ───────────────────────────────────────────────────────
function CommentRow({
  comment,
  currentUserId,
  postId,
  onReply,
  onDelete,
  onReport,
  depth = 0,
}: {
  comment: CommentItem;
  currentUserId?: string | null;
  postId: string;
  onReply: (c: CommentItem) => void;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string, authorName: string) => void;
  depth?: number;
}) {
  const isOwn = currentUserId && comment.userId && String(currentUserId) === String(comment.userId);

  return (
    <div className={depth > 0 ? "ml-7 sm:ml-9 pl-3 sm:pl-4 border-l-2 border-orange-200/60" : ""}>
      <div className="flex gap-2 items-start py-1.5">
        <div className="shrink-0 mt-0.5">
          <AvatarBubble initials={comment.avatar} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Author + meta */}
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            {comment.replyingToAuthor && depth > 0 && (
              <span className="text-[10px] text-orange-500 font-semibold flex items-center gap-0.5 shrink-0">
                <IconReply />
                @{comment.replyingToAuthor}
              </span>
            )}
            <span className="font-bold text-[12px] text-brown-900 truncate">{comment.author}</span>
            <span className="text-[10px] text-brown-700/50 shrink-0">· {comment.time}</span>
          </div>

          {/* Content */}
          <p className="text-xs text-brown-900 leading-relaxed break-words">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1.5">
            {depth === 0 && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="text-[11px] font-semibold text-brown-700/50 hover:text-orange-500 transition-colors flex items-center gap-1"
              >
                <IconReply />
                Balas
              </button>
            )}
            {!isOwn && (
              <button
                type="button"
                onClick={() => onReport(comment.id, comment.author)}
                className="text-[11px] font-semibold text-brown-700/40 hover:text-red-500 transition-colors"
              >
                Laporkan
              </button>
            )}
            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="text-[11px] font-semibold text-brown-700/40 hover:text-red-500 transition-colors"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies (1 level only) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-0.5 mb-1">
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              postId={postId}
              onReply={onReply}
              onDelete={onDelete}
              onReport={onReport}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
export default function PostCard({ post, onToggleLike, onToggleRepost, onAddComment, onTagClick, currentUserId }: PostCardProps) {
  const myStatus = useUserStatus();
  const router = useRouter();
  const {
    savedPostIds = [],
    handleToggleSave = () => {},
    handleDeletePost,
    handleArchivePost,
    handleHidePost,
    handleMuteUser,
    handleBlockUser,
    showToast,
    setShowCrisisNotice,
    handleToggleComments,
    handleEditPost,
    currentUserAvatar,
  } = useCommunity();
  const isSaved = savedPostIds.includes(post.id);

  // Comment section state
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsScrollRef = useRef<HTMLDivElement>(null);

  // Report for comment
  const [reportCommentTarget, setReportCommentTarget] = useState<{ id: string; author: string } | null>(null);

  // Post-level state
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmMute, setConfirmMute] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(post.commentsDisabled ?? false);
  const [localContent, setLocalContent] = useState(post.content);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync external prop changes
  useEffect(() => { setCommentsDisabled(post.commentsDisabled ?? false); }, [post.commentsDisabled]);
  useEffect(() => { setLocalContent(post.content); }, [post.content]);

  // Load comments from API when expanded
  const loadComments = useCallback(async () => {
    if (!post.id) return;
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const res = await fetch(`/api/community/comments?postId=${post.id}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.comments) {
        setCommentsList(data.comments);
      } else {
        // Fallback to post.comments if API unavailable
        setCommentsList(post.comments || []);
      }
    } catch {
      setCommentsList(post.comments || []);
      setCommentsError("Gagal memuat komentar.");
    } finally {
      setCommentsLoading(false);
    }
  }, [post.id, post.comments]);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, loadComments]);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setConfirmDelete(false);
    setConfirmMute(false);
    setConfirmBlock(false);
  };

  const isOwner = currentUserId != null && post.userId != null && String(currentUserId) === String(post.userId);

  const handleAuthorClick = () => {
    if (post.userId) router.push(`/community/profile/${post.userId}`);
  };

  const handleSendComment = async () => {
    if (!commentInput.trim() || commentSubmitting || commentsDisabled) return;
    setCommentSubmitting(true);
    const parentId = replyingTo?.id || null;
    const text = commentInput.trim();
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: text, parentId }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        // Inject into local list without full reload
        if (parentId) {
          // Add to replies of parent
          setCommentsList((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies || []), data.comment] }
                : c
            )
          );
        } else {
          setCommentsList((prev) => [...prev, data.comment]);
        }
        if (data.isRisk) setShowCrisisNotice?.(true);
        // Also call parent handler to bump count in context
        onAddComment?.(post.id, text, parentId);
      } else {
        showToast?.(data.error || "Gagal mengirim komentar.", "error");
      }
    } catch {
      showToast?.("Gagal mengirim komentar.", "error");
    } finally {
      setCommentSubmitting(false);
      setCommentInput("");
      setReplyingTo(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/community/comments?commentId=${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setCommentsList((prev) => {
          // Remove from top-level
          const withoutTop = prev.filter((c) => c.id !== commentId);
          // Remove from nested replies
          return withoutTop.map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r.id !== commentId),
          }));
        });
        showToast?.("Komentar dihapus.");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast?.(data.error || "Gagal menghapus komentar.", "error");
      }
    } catch {
      showToast?.("Gagal menghapus komentar.", "error");
    }
  };

  const startReply = (comment: CommentItem) => {
    setReplyingTo({ id: comment.id, author: comment.author });
    commentInputRef.current?.focus();
    // Scroll input into view
    setTimeout(() => commentInputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentInput("");
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast?.("✓ Tautan berhasil disalin ke clipboard!");
    } catch {
      showToast?.("Gagal menyalin tautan", "error");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => showToast?.("✓ Tautan berhasil disalin ke clipboard!"))
        .catch(() => fallbackCopyText(url));
    } else {
      fallbackCopyText(url);
    }
    closeMenu();
  };

  const handleToggleCommentLocal = async () => {
    const next = !commentsDisabled;
    setCommentsDisabled(next);
    closeMenu();
    try {
      await handleToggleComments?.(post.id, next);
      showToast?.(next ? "✓ Komentar dimatikan untuk postingan ini" : "✓ Komentar diaktifkan kembali");
    } catch {
      setCommentsDisabled(!next);
      showToast?.("Gagal mengubah pengaturan komentar", "error");
    }
  };

  const handleEditSave = async (newContent: string) => {
    const old = localContent;
    setLocalContent(newContent);
    try {
      await handleEditPost?.(post.id, newContent);
      showToast?.("✓ Postingan berhasil diperbarui");
    } catch {
      setLocalContent(old);
      showToast?.("Gagal memperbarui postingan", "error");
    }
  };

  const totalCommentCount = commentsList.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <>
      <article
        id={`post-${post.id}`}
        className="flex gap-3 sm:gap-3.5 px-3 sm:px-5 py-4 border-b border-brown-900/[0.06] hover:bg-[#faf7f2]/50 transition-colors group last:border-b-0"
      >
        {/* Left: Avatar + thread line */}
        <div className="flex flex-col items-center shrink-0">
          <button type="button" onClick={handleAuthorClick} className="cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarBubble
              initials={post.avatar}
              statusConfig={isOwner ? myStatus : undefined}
            />
          </button>
          {showComments && commentsList.length > 0 && (
            <div className="w-0.5 flex-1 bg-brown-900/10 mt-2 mb-1 min-h-[20px] rounded-full" />
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <button
                type="button"
                onClick={handleAuthorClick}
                className="font-display font-bold text-sm text-brown-900 hover:underline cursor-pointer truncate max-w-[140px] sm:max-w-none"
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

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Topic tag */}
              <button
                type="button"
                onClick={() => onTagClick?.(post.tag)}
                className="hidden sm:block text-[10px] font-semibold px-2.5 py-0.5 rounded-pill bg-cream text-brown-700 border border-brown-900/10 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 transition-colors leading-none"
              >
                #{post.tag.toLowerCase()}
              </button>

              {/* Three-dot menu */}
              <div className="relative z-40" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((v) => !v);
                    setConfirmDelete(false);
                    setConfirmMute(false);
                    setConfirmBlock(false);
                  }}
                  className="min-w-9 min-h-9 flex items-center justify-center text-brown-700/60 hover:text-brown-900 transition-colors p-1.5 rounded-lg hover:bg-cream touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  title="Opsi lainnya"
                  aria-label="Opsi lainnya"
                  aria-expanded={menuOpen}
                >
                  <IconMore />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 z-[80] w-56 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-brown-900/10 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                    role="menu"
                  >
                    {isOwner ? (
                      <>
                        {confirmDelete ? (
                          <ConfirmPanel
                            message="Yakin hapus postingan ini? Tindakan ini tidak bisa dibatalkan."
                            confirmLabel="Hapus"
                            confirmClass="bg-red-500 text-white hover:bg-red-600"
                            onCancel={() => setConfirmDelete(false)}
                            onConfirm={() => { handleDeletePost?.(post.id); closeMenu(); }}
                          />
                        ) : (
                          <>
                            <MenuItem label="Hapus" icon={<IcTrash />} onClick={() => setConfirmDelete(true)} danger />
                            <MenuItem
                              label="Edit"
                              icon={<IcEdit />}
                              onClick={() => { closeMenu(); setEditOpen(true); }}
                            />
                            <MenuItem
                              label="Arsipkan"
                              sublabel="Disembunyikan dari feed"
                              icon={<IcArchive />}
                              onClick={() => { handleArchivePost?.(post.id); closeMenu(); }}
                              separator
                            />
                            <MenuItem
                              label={commentsDisabled ? "Aktifkan komentar" : "Matikan komentar"}
                              sublabel={commentsDisabled ? "Komentar sedang dimatikan" : "Hanya kamu yang bisa balas"}
                              icon={commentsDisabled ? <IcMessage /> : <IcMessageOff />}
                              onClick={handleToggleCommentLocal}
                              active={commentsDisabled}
                            />
                            <MenuItem label="Salin tautan" icon={<IcLink />} onClick={handleCopyLink} separator />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {confirmMute ? (
                          <ConfirmPanel
                            message={<>Bisukan <strong>@{post.author}</strong>? Postingan dari akun ini tidak akan muncul lagi di feed Anda.</>}
                            confirmLabel="Bisukan"
                            confirmClass="bg-brown-900 text-white hover:bg-brown-800"
                            onCancel={() => setConfirmMute(false)}
                            onConfirm={() => { handleMuteUser?.(post.userId || post.author, post.author); closeMenu(); }}
                          />
                        ) : confirmBlock ? (
                          <ConfirmPanel
                            message={<>Blokir <strong>@{post.author}</strong>? Akun ini tidak dapat melihat profil Anda dan postingannya akan disembunyikan.</>}
                            confirmLabel="Blokir"
                            confirmClass="bg-red-500 text-white hover:bg-red-600"
                            onCancel={() => setConfirmBlock(false)}
                            onConfirm={() => { handleBlockUser?.(post.userId || post.author, post.author); closeMenu(); }}
                          />
                        ) : (
                          <>
                            <MenuItem label="Salin tautan" icon={<IcLink />} onClick={handleCopyLink} />
                            <MenuItem
                              label={isSaved ? "Hapus dari Tersimpan" : "Simpan"}
                              icon={<IcBookmark />}
                              active={isSaved}
                              onClick={() => { handleToggleSave(post.id); closeMenu(); showToast?.(isSaved ? "Postingan dihapus dari Tersimpan" : "✓ Postingan disimpan"); }}
                            />
                            <MenuItem
                              label="Tidak tertarik"
                              sublabel="Sembunyikan dari feed"
                              icon={<IcEyeOff />}
                              onClick={() => { handleHidePost?.(post.id); closeMenu(); }}
                              separator
                            />
                            <MenuItem
                              label="Bisukan"
                              sublabel={`@${post.author}`}
                              icon={<IcUserX />}
                              onClick={() => setConfirmMute(true)}
                              separator
                            />
                            <MenuItem
                              label="Blokir"
                              sublabel={`@${post.author}`}
                              icon={<IcSlash />}
                              onClick={() => setConfirmBlock(true)}
                              danger
                            />
                            <MenuItem
                              label="Laporkan"
                              icon={<IcAlertCircle />}
                              onClick={() => { closeMenu(); setReportModalOpen(true); }}
                              danger
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile tag */}
          <div className="sm:hidden mb-1.5">
            <button
              type="button"
              onClick={() => onTagClick?.(post.tag)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-cream text-brown-700 border border-brown-900/10 hover:bg-orange-100 hover:text-orange-600 transition-colors leading-none"
            >
              #{post.tag.toLowerCase()}
            </button>
          </div>

          {/* Post body */}
          <p className="text-sm text-brown-900 leading-relaxed mb-3 break-words">
            {renderContent(localContent, onTagClick)}
          </p>

          {/* Media */}
          {(post.imageUrl || post.mediaUrl) && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-brown-900/10 bg-black/5">
              <img
                src={post.imageUrl || post.mediaUrl}
                alt="Attachment"
                className="w-full max-h-[400px] sm:max-h-[480px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open((post.imageUrl || post.mediaUrl)!, "_blank")}
                loading="lazy"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Comments disabled notice */}
          {commentsDisabled && (
            <div className="mb-2 flex items-center gap-1.5 text-[11px] text-brown-700/50 font-medium">
              <IcMessageOff />
              <span>Komentar dimatikan</span>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-0.5 sm:gap-1 -ml-1.5 mt-1">
            {/* Like */}
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all active:scale-90 ${
                post.userLiked ? "text-orange-500" : "text-brown-700/50 hover:text-orange-500 hover:bg-orange-50"
              }`}
              title="Suka"
              aria-label={`Suka — ${post.likes}`}
              aria-pressed={post.userLiked}
            >
              <IconHeart filled={post.userLiked} />
              <span className="text-[11px] font-semibold min-w-[12px]">{post.likes}</span>
            </button>

            {/* Comment */}
            <button
              type="button"
              onClick={() => !commentsDisabled && setShowComments(!showComments)}
              disabled={commentsDisabled}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ${
                commentsDisabled
                  ? "text-brown-700/25 cursor-not-allowed"
                  : showComments
                  ? "text-brown-900"
                  : "text-brown-700/50 hover:text-brown-900 hover:bg-cream"
              }`}
              title={commentsDisabled ? "Komentar dimatikan" : "Balas"}
              aria-label={`Komentar — ${post.commentsCount}`}
              aria-disabled={commentsDisabled}
            >
              <IconComment disabled={commentsDisabled} />
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
              aria-label={`Repost — ${post.repostsCount ?? 0}`}
              aria-pressed={post.userReposted}
            >
              <IconRepost />
              <span className="text-[11px] font-semibold min-w-[12px]">{post.repostsCount ?? 0}</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-1.5 py-1 rounded-xl text-brown-700/50 hover:text-brown-900 hover:bg-cream transition-all"
              title="Bagikan"
              aria-label="Bagikan"
            >
              <IconShare />
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => {
                handleToggleSave(post.id);
                showToast?.(isSaved ? "Postingan dihapus dari Tersimpan" : "✓ Postingan disimpan");
              }}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-xl transition-all ml-auto ${
                isSaved ? "text-orange-500" : "text-brown-700/40 hover:text-brown-900 hover:bg-cream"
              }`}
              title={isSaved ? "Hapus dari Tersimpan" : "Simpan Thread"}
              aria-label={isSaved ? "Hapus dari Tersimpan" : "Simpan Thread"}
              aria-pressed={isSaved}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          {/* ── Inline comment thread ─────────────────────────────────── */}
          {showComments && !commentsDisabled && (
            <div className="mt-3">
              {/* Scrollable comment list */}
              <div
                ref={commentsScrollRef}
                className="max-h-[380px] sm:max-h-[440px] overflow-y-auto overscroll-contain pr-1 scroll-smooth"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {commentsLoading && (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span className="ml-2 text-xs text-brown-700/50">Memuat komentar...</span>
                  </div>
                )}

                {!commentsLoading && commentsError && (
                  <div className="flex items-center gap-2 py-3 px-1">
                    <span className="text-xs text-red-500">{commentsError}</span>
                    <button
                      type="button"
                      onClick={loadComments}
                      className="text-xs font-semibold text-orange-500 hover:underline"
                    >
                      Coba lagi
                    </button>
                  </div>
                )}

                {!commentsLoading && !commentsError && commentsList.length === 0 && (
                  <div className="py-5 text-center">
                    <p className="text-xs text-brown-700/50">Belum ada komentar. Jadilah yang pertama!</p>
                  </div>
                )}

                {!commentsLoading && commentsList.length > 0 && (
                  <div className="flex flex-col pb-2">
                    {commentsList.map((c) => (
                      <CommentRow
                        key={c.id}
                        comment={c}
                        currentUserId={currentUserId}
                        postId={post.id}
                        onReply={startReply}
                        onDelete={handleDeleteComment}
                        onReport={(commentId, authorName) =>
                          setReportCommentTarget({ id: commentId, author: authorName })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="pt-2.5 border-t border-brown-900/8">
                {/* Reply-to indicator */}
                {replyingTo && (
                  <div className="flex items-center gap-1.5 mb-1.5 px-1">
                    <span className="text-[11px] text-orange-500 font-semibold flex items-center gap-1">
                      <IconReply />
                      Membalas @{replyingTo.author}
                    </span>
                    <button
                      type="button"
                      onClick={cancelReply}
                      className="ml-auto text-[10px] text-brown-700/50 hover:text-brown-900 flex items-center gap-0.5 transition-colors"
                      aria-label="Batalkan balasan"
                    >
                      <X size={10} />
                      Batal
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Current user mini-avatar */}
                  <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0 overflow-hidden">
                    {currentUserAvatar ? (
                      <span>{currentUserAvatar}</span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    )}
                  </div>

                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                      if (e.key === "Escape") cancelReply();
                    }}
                    placeholder={replyingTo ? `Balas @${replyingTo.author}...` : "Tulis balasan yang suportif..."}
                    maxLength={500}
                    className="flex-1 bg-cream/60 rounded-pill border border-brown-900/8 px-4 py-2 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all min-w-0"
                  />
                  <button
                    type="button"
                    onClick={handleSendComment}
                    disabled={!commentInput.trim() || commentSubmitting}
                    className="rounded-pill bg-brown-900 text-white text-xs font-semibold px-3 sm:px-4 py-2 hover:bg-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 flex items-center gap-1"
                  >
                    {commentSubmitting ? (
                      <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                    ) : "Kirim"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Edit Modal */}
      {editOpen && (
        <EditModal
          post={{ ...post, content: localContent }}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
        />
      )}

      {/* Post Report Modal */}
      <ReportModal
        open={reportModalOpen}
        postId={post.id}
        authorName={post.author}
        targetType="POST"
        onClose={() => setReportModalOpen(false)}
        onReportSuccess={(isCrisis, hidePostChoice) => {
          if (hidePostChoice) handleHidePost?.(post.id);
          if (isCrisis) setShowCrisisNotice?.(true);
          showToast?.("✓ Laporan Anda telah diterima dan akan ditinjau tim ZYBA.");
        }}
      />

      {/* Comment Report Modal */}
      <ReportModal
        open={Boolean(reportCommentTarget)}
        postId={post.id}
        commentId={reportCommentTarget?.id}
        authorName={reportCommentTarget?.author || ""}
        targetType="COMMENT"
        onClose={() => setReportCommentTarget(null)}
        onReportSuccess={(isCrisis) => {
          if (isCrisis) setShowCrisisNotice?.(true);
          showToast?.("✓ Komentar dilaporkan dan akan ditinjau tim ZYBA.");
        }}
      />
    </>
  );
}
