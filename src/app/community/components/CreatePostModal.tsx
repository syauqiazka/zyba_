"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Image as ImageIcon, Loader2 } from "lucide-react";
import { isAvatarUrl, resolveAvatar } from "@/lib/avatarUtils";
import UserAvatar from "@/components/ui/UserAvatar";

const TAG_OPTIONS = ["Sharing", "Mindfulness", "SleepRoutine", "ZybaRocks", "MentalHealth", "SelfCare"];

interface CreatePostModalProps {
  open: boolean;
  newPostContent: string;
  selectedTag: string;
  onContentChange: (content: string) => void;
  onTagChange: (tag: string) => void;
  onClose: () => void;
  onSubmit: (imageUrl?: string | null) => Promise<void> | void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; avatarUrl?: string | null } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setShowTagDropdown(false);
      setUploadError(null);
      // Fetch user profile info for modal header
      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => {
          if (data?.user) {
            setUserProfile({
              name: data.user.name || "Pengguna ZYBA",
              avatarUrl: data.user.avatarUrl,
            });
          }
        })
        .catch(() => {});
    } else {
      setSelectedFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar (JPG, PNG, WEBP, GIF) yang didukung.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran foto maksimal 10MB.");
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    const hasContent = Boolean(newPostContent && newPostContent.trim());
    if (!hasContent && !selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    let uploadedUrl: string | null = null;
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || "Gagal mengunggah foto.");
        }
        uploadedUrl = uploadData.url;
      }

      await onSubmit(uploadedUrl);
      setSelectedFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setUploadError(err.message || "Gagal mempublikasikan postingan.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  const canSubmit = (newPostContent.trim().length > 0 || selectedFile !== null) && !isUploading;
  const authorAvatar = userProfile?.avatarUrl;
  const isImgAvatar = isAvatarUrl(authorAvatar);

  return (
    <div
      role="dialog"
      aria-label="New thread"
      className="fixed bottom-20 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[500px] bg-white rounded-3xl shadow-2xl border border-brown-900/12 p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brown-900/6">
        <button
          type="button"
          onClick={onClose}
          disabled={isUploading}
          className="text-xs font-semibold text-brown-700/70 hover:text-brown-900 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <span className="font-bold text-sm text-brown-900 tracking-tight">
          Postingan Baru
        </span>
        <div className="flex items-center gap-2 text-brown-700/50">
          <span className="text-[11px] font-medium text-brown-700/60">
            {selectedFile ? "Foto terpilih" : "Publik"}
          </span>
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl flex items-center justify-between">
          <span>⚠ {uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-800 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* User info + topic */}
      <div className="flex items-start gap-3 pt-1">
        <UserAvatar
          src={authorAvatar}
          name={userProfile?.name}
          size="md"
          showStatus={false}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-brown-900">
              {userProfile?.name || "Pengguna ZYBA"}
            </span>
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
            placeholder="Ada cerita apa hari ini? Tulis curhat atau bagikan foto..."
            rows={selectedFile ? 2 : 4}
            autoFocus
            className="w-full text-xs text-brown-900 placeholder:text-brown-700/40 resize-none focus:outline-none bg-transparent pt-2 leading-relaxed"
          />

          {/* Image Preview Box */}
          {imagePreview && (
            <div className="relative mt-2 rounded-2xl overflow-hidden border border-brown-900/10 bg-cream/30 group max-h-56">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
              <button
                type="button"
                onClick={handleRemoveImage}
                title="Hapus foto"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-brown-900/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-md cursor-pointer"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 bg-brown-900/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(0)} KB)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Icons Row */}
      <div className="flex items-center gap-2 text-brown-700/60 pl-13 pt-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            selectedFile
              ? "bg-orange-50 border-orange-200 text-orange-600 font-bold"
              : "border-brown-900/10 hover:bg-cream hover:text-brown-900"
          }`}
          title="Unggah Foto"
        >
          <ImageIcon size={15} className={selectedFile ? "text-orange-500" : ""} />
          <span>{selectedFile ? "Ganti Foto" : "Foto"}</span>
        </button>

        <span className="text-[11px] text-brown-700/40">
          Format: PNG, JPG, WEBP, GIF (maks. 10MB)
        </span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-brown-900/6 flex items-center justify-between">
        <span className="text-[10px] text-brown-700/40">
          Privasi: Semua anggota Zyba Community
        </span>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-full px-4 py-2 text-xs font-semibold text-brown-700 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              canSubmit
                ? "bg-orange-500 text-white hover:bg-brown-900 active:scale-95 shadow-2xs cursor-pointer"
                : "bg-brown-900/10 text-brown-900/30 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <span>Posting</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}