"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Pencil, X, EyeOff, Eye, Camera, Loader2 } from "lucide-react";
import { useCommunity } from "../../context/CommunityContext";
import PostCard from "../../components/PostCard";
import { isAvatarUrl, resolveAvatar } from "@/lib/avatarUtils";
import UserAvatar from "@/components/ui/UserAvatar";
import AvatarCropModal from "@/components/ui/AvatarCropModal";

interface ProfileData {
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isFollower: boolean;
  isSelf: boolean;
}

interface Post {
  id: string;
  userId?: string;
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
  comments?: any[];
  isHidden?: boolean;
}

// ── Edit Profile Modal ──────────────────────────────────────────
function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: ProfileData;
  onClose: () => void;
  onSaved: (updated: { name: string; username: string | null; bio: string | null; avatarUrl?: string | null }) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Avatar Crop & Cooldown state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cooldownInfo, setCooldownInfo] = useState<{
    canChange: boolean;
    remainingText: string | null;
    cooldownDays: number;
  } | null>(null);

  const checkCooldown = useCallback(async () => {
    try {
      const res = await fetch("/api/user/avatar");
      if (res.ok) {
        const data = await res.json();
        setCooldownInfo(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkCooldown();
  }, [checkCooldown]);

  const handleAvatarClick = () => {
    if (cooldownInfo && !cooldownInfo.canChange) {
      setError(
        `Foto profil sedang cooldown. Kamu baru bisa mengganti foto profil lagi dalam ${cooldownInfo.remainingText}.`
      );
      return;
    }
    avatarInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar (JPG, PNG, WEBP, GIF) yang diizinkan.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Ukuran foto maksimal 8MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleUploadCropped = async (file: File) => {
    setUploadingAvatar(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok || !d.avatarUrl) {
        throw new Error(d.error || "Gagal mengunggah foto profil.");
      }

      setAvatarUrl(d.avatarUrl);
      await checkCooldown();

      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const prev = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          "zyba_user_cache",
          JSON.stringify({ ...prev, avatarUrl: d.avatarUrl })
        );
      } catch {}
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah foto profil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/profile/${profile.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, ...(avatarUrl ? { avatarUrl } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan perubahan");
        return;
      }
      onSaved({
        name: data.user.name,
        username: data.user.username,
        bio: data.user.bio,
        avatarUrl: data.user.avatarUrl || avatarUrl,
      });
      onClose();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  // Prevent scroll behind modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown-900/30 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-cream rounded-3xl shadow-2xl border border-brown-900/10 p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-brown-900">Edit Profil</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brown-900/8 text-brown-700/60 hover:text-brown-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelected}
          />
          <div className="relative group shrink-0">
            <UserAvatar
              src={avatarUrl}
              name={name}
              size="lg"
              className="w-18 h-18 text-2xl shadow-md border-2 border-orange-300"
              showStatus={false}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              title={
                cooldownInfo && !cooldownInfo.canChange
                  ? `Cooldown: ${cooldownInfo.remainingText}`
                  : "Ubah foto profil"
              }
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Pencil size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer disabled:opacity-50"
          >
            {uploadingAvatar ? "Mengunggah foto..." : "Ubah Foto Profil"}
          </button>
        </div>

        {/* Cooldown active info banner */}
        {cooldownInfo && !cooldownInfo.canChange && (
          <div className="mb-4 bg-amber-50 border border-amber-200/90 text-amber-900 text-xs px-3.5 py-2.5 rounded-2xl flex items-start gap-2">
            <span className="text-sm leading-none mt-0.5">⏳</span>
            <div className="leading-relaxed">
              <span className="font-bold">Cooldown Aktif:</span> Ganti foto profil lagi dalam{" "}
              <span className="font-bold underline">{cooldownInfo.remainingText}</span> (aturan {cooldownInfo.cooldownDays} hari sekali).
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brown-700 mb-1.5">
              Nama Tampilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Nama kamu"
              className="w-full rounded-xl border border-brown-900/15 bg-white px-4 py-2.5 text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/25 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brown-700 mb-1.5">
              Username (@ handle)
            </label>
            <div className="flex items-center rounded-xl border border-brown-900/15 bg-white px-4 py-2.5 gap-1 focus-within:ring-2 focus-within:ring-orange-500/25 transition-all">
              <span className="text-sm text-brown-700/50 font-medium select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                maxLength={30}
                placeholder="username"
                className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-brown-700/50 mt-1">Hanya huruf kecil, angka, dan underscore.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brown-700 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Ceritakan sedikit tentang dirimu..."
              className="w-full rounded-xl border border-brown-900/15 bg-white px-4 py-2.5 text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/25 transition-all resize-none"
            />
            <p className="text-[10px] text-brown-700/50 mt-0.5 text-right">{bio.length}/160</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-brown-900/15 bg-white text-brown-900 text-sm font-semibold py-2.5 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 rounded-xl bg-brown-900 text-white text-sm font-semibold py-2.5 hover:bg-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Interactive Avatar Crop, Rotate & Cooldown Confirmation Modal */}
      <AvatarCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropModalOpen(false)}
        onConfirm={handleUploadCropped}
        isUploading={uploadingAvatar}
      />
    </div>
  );
}

// ── Main ProfilePage ─────────────────────────────────────────────
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { handleToggleLike, handleToggleRepost, handleAddComment, handleTagFilter, currentUserId } = useCommunity();

  const userId = params.userId as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"POSTS" | "HIDDEN">("POSTS");
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hidingPostId, setHidingPostId] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const userRes = await fetch("/api/user/profile/" + userId);
      if (!userRes.ok) {
        console.error("Failed to load user");
        return;
      }

      const userData = await userRes.json();

      const followRes = await fetch("/api/community/follows/" + userId);
      const followData = followRes.ok
        ? await followRes.json()
        : { isFollowing: false, isFollower: false, isSelf: false };

      const postsRes = await fetch("/api/community/users/" + userId + "/posts?includeHidden=true");
      const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };

      setProfile({
        userId: userData.user.id,
        name: userData.user.name,
        username: userData.user.username || userData.user.id,
        avatarUrl: userData.user.avatarUrl,
        bio: userData.user.bio,
        followerCount: userData.followerCount || 0,
        followingCount: userData.followingCount || 0,
        postCount: userData.postCount || 0,
        isFollowing: followData.isFollowing,
        isFollower: followData.isFollower,
        isSelf: followData.isSelf,
      });

      setPosts(postsData.posts || []);
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId, loadProfile]);

  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);
    try {
      const method = profile.isFollowing ? "DELETE" : "POST";
      const res = await fetch("/api/community/follows/" + userId, {
        method,
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.isFollowing,
                followerCount: prev.followerCount + (data.isFollowing ? 1 : -1),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleToggleVisibility = async (postId: string) => {
    if (hidingPostId) return;
    setHidingPostId(postId);
    try {
      const res = await fetch(`/api/community/posts/${postId}/visibility`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isHidden: data.isHidden } : p))
        );
      }
    } catch (err) {
      console.error("Visibility toggle error:", err);
    } finally {
      setHidingPostId(null);
    }
  };

  const handleMessage = () => {
    router.push("/community/messages?userId=" + userId);
  };

  if (loading) {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto flex items-center justify-center">
        <div className="text-sm text-brown-700/60">Memuat profil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto flex items-center justify-center">
        <div className="text-sm text-brown-700/60">Profil tidak ditemukan</div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const visiblePosts = posts.filter((p) => !p.isHidden);
  const hiddenPosts = posts.filter((p) => p.isHidden);

  const tabs = profile.isSelf
    ? (["POSTS", "HIDDEN"] as const)
    : (["POSTS"] as const);

  return (
    <>
      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={({ name, username, bio, avatarUrl }) => {
            setProfile((prev) => prev ? { ...prev, name, username, bio, ...(avatarUrl !== undefined ? { avatarUrl } : {}) } : prev);
          }}
        />
      )}

      <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center py-4 px-3 sm:px-6">
        <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-3xl border border-brown-900/10 p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h1 className="font-display font-bold text-xl text-brown-900">{profile.name}</h1>
                <p className="text-xs text-brown-700/60 mt-0.5">@{profile.username}</p>
              </div>

              <UserAvatar
                src={profile.avatarUrl}
                name={profile.name}
                size="lg"
                className="w-16 h-16 shadow-md border border-orange-200 shrink-0 text-2xl"
                showStatus={false}
              />
            </div>

            {profile.bio && (
              <p className="text-xs text-brown-900 leading-relaxed max-w-md mb-4">
                {profile.bio}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-brown-700/60 border-t border-brown-900/6 pt-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/community/profile/" + userId + "/followers")}
                  className="hover:text-brown-900 transition-colors"
                >
                  <strong className="text-brown-900">{profile.followerCount}</strong> pengikut
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/community/profile/" + userId + "/following")}
                  className="hover:text-brown-900 transition-colors"
                >
                  <strong className="text-brown-900">{profile.followingCount}</strong> mengikuti
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!profile.isSelf && (
                  <>
                    <button
                      type="button"
                      onClick={handleMessage}
                      className="rounded-full bg-cream border border-brown-900/10 text-brown-900 font-bold px-3 py-1.5 hover:bg-brown-900/5 transition-colors shadow-2xs flex items-center gap-1.5"
                      title="Kirim Pesan"
                    >
                      <MessageCircle size={14} />
                      <span>Pesan</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={
                        "rounded-full font-bold px-4 py-1.5 transition-colors shadow-2xs " +
                        (profile.isFollowing
                          ? "bg-cream border border-brown-900/10 text-brown-900 hover:bg-brown-900/5"
                          : "bg-brown-900 text-white hover:bg-orange-500")
                      }
                    >
                      {followLoading ? "..." : profile.isFollowing ? "Mengikuti" : "Ikuti"}
                    </button>
                  </>
                )}
                {profile.isSelf && (
                  <button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    className="rounded-full bg-brown-900 text-white font-bold px-4 py-1.5 hover:bg-orange-500 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Pencil size={13} />
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-brown-900/10 text-xs font-bold">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as "POSTS" | "HIDDEN")}
                className={
                  "flex-1 pb-3 text-center transition-all border-b-2 -mb-[1px] flex items-center justify-center gap-1.5 " +
                  (activeTab === tab
                    ? "border-brown-900 text-brown-900 font-extrabold"
                    : "border-transparent text-brown-700/50 hover:text-brown-900")
                }
              >
                {tab === "HIDDEN" && <EyeOff size={12} />}
                {tab === "POSTS" ? "Postingan" : "Tersembunyi"}
                {tab === "HIDDEN" && hiddenPosts.length > 0 && (
                  <span className="ml-1 bg-brown-900/10 text-brown-700 rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                    {hiddenPosts.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Post list */}
          <div className="bg-white rounded-2xl border border-brown-900/10 shadow-xs overflow-hidden">
            {activeTab === "POSTS" && visiblePosts.length === 0 && (
              <div className="py-12 text-center text-xs text-brown-700/50">
                Belum ada postingan.
              </div>
            )}
            {activeTab === "POSTS" &&
              visiblePosts.map((post) => (
                <div key={post.id} className="relative group/postrow">
                  <PostCard
                    post={post}
                    onToggleLike={handleToggleLike}
                    onToggleRepost={handleToggleRepost}
                    onAddComment={handleAddComment}
                    onTagClick={handleTagFilter}
                    currentUserId={currentUserId}
                  />
                  {profile.isSelf && (
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(post.id)}
                      disabled={hidingPostId === post.id}
                      title="Sembunyikan postingan"
                      className="absolute top-3 right-12 opacity-0 group-hover/postrow:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-brown-700/50 hover:text-brown-900 px-2 py-1 rounded-lg hover:bg-cream"
                    >
                      <EyeOff size={12} />
                      {hidingPostId === post.id ? "..." : "Sembunyikan"}
                    </button>
                  )}
                </div>
              ))}

            {activeTab === "HIDDEN" && hiddenPosts.length === 0 && (
              <div className="py-12 text-center text-xs text-brown-700/50">
                Tidak ada postingan tersembunyi.
              </div>
            )}
            {activeTab === "HIDDEN" &&
              hiddenPosts.map((post) => (
                <div key={post.id} className="relative group/postrow opacity-70">
                  {/* Hidden badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-brown-900/8 text-brown-700 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    <EyeOff size={9} />
                    Tersembunyi
                  </div>
                  <PostCard
                    post={post}
                    onToggleLike={handleToggleLike}
                    onToggleRepost={handleToggleRepost}
                    onAddComment={handleAddComment}
                    onTagClick={handleTagFilter}
                    currentUserId={currentUserId}
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(post.id)}
                    disabled={hidingPostId === post.id}
                    title="Tampilkan kembali"
                    className="absolute top-3 right-12 flex items-center gap-1 text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Eye size={12} />
                    {hidingPostId === post.id ? "..." : "Tampilkan"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
