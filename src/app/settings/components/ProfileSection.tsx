"use client";

import React, { useRef, useState } from "react";
import { isAvatarUrl, resolveAvatar } from "@/lib/avatarUtils";
import { Camera, Loader2 } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface ProfileSectionProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  plan?: "FREE" | "PLUS";
  avatarKey?: string;
  avatarUrl?: string;
  isLoading?: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onAvatarChange?: (url: string) => void;
}

const PRESET_EMOJIS = [
  { key: "fox", emoji: "🦊" },
  { key: "panda", emoji: "🐼" },
  { key: "lion", emoji: "🦁" },
  { key: "rabbit", emoji: "🐰" },
  { key: "koala", emoji: "🐨" },
  { key: "cat", emoji: "🐱" },
  { key: "leaf", emoji: "🌿" },
  { key: "flower", emoji: "🌸" },
];

export default function ProfileSection({
  name,
  email,
  phone,
  location,
  bio,
  plan = "FREE",
  avatarUrl,
  isLoading = false,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onLocationChange,
  onBioChange,
  onAvatarChange,
}: ProfileSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planBadgeClass =
    plan === "PLUS"
      ? "bg-orange-100 text-orange-500"
      : "bg-cream text-brown-700/60 border border-brown-900/10";

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ZY";

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar (JPG, PNG, WEBP, GIF) yang diizinkan.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Ukuran foto maksimal 8MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.avatarUrl) {
        throw new Error(data.error || "Gagal mengunggah foto profil.");
      }

      onAvatarChange?.(data.avatarUrl);

      // Sync localStorage
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const prev = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          "zyba_user_cache",
          JSON.stringify({ ...prev, avatarUrl: data.avatarUrl })
        );
      } catch {}
    } catch (err: any) {
      setUploadError(err.message || "Gagal upload foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectEmoji = async (key: string) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah avatar.");

      onAvatarChange?.(key);

      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const prev = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          "zyba_user_cache",
          JSON.stringify({ ...prev, avatarUrl: key })
        );
      } catch {}
    } catch (err: any) {
      setUploadError(err.message || "Gagal ubah avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const isImg = isAvatarUrl(avatarUrl);

  return (
    <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6 bg-white">
      <h2 className="font-display text-lg font-bold text-brown-900 border-b border-brown-900/10 pb-3">
        1. Profil Pengguna
      </h2>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileUpload(f);
        }}
      />

      {/* Profile Header & Avatar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream/40 border border-brown-900/8">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <UserAvatar
              src={avatarUrl}
              name={name}
              size="lg"
              className="w-18 h-18 text-2xl shadow-md border-2 border-white"
              showStatus={false}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Ganti foto profil"
              className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera size={18} />
              <span className="text-[10px] font-bold mt-0.5">Ubah</span>
            </button>
          </div>

          <div className="min-w-0">
            {isLoading ? (
              <div className="flex flex-col gap-1.5">
                <div className="w-32 h-3.5 bg-brown-900/10 rounded animate-pulse" />
                <div className="w-44 h-3 bg-brown-900/8 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <span className="text-base font-bold text-brown-900 block truncate">
                  {name || "—"}
                </span>
                <span className="text-xs text-brown-700 block truncate">
                  {email}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${planBadgeClass}`}
                >
                  {plan === "PLUS" ? "⚡ Zyba Plus" : "Free Plan"}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs font-bold bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Camera size={14} />
                <span>Upload Foto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">
          ⚠ {uploadError}
        </div>
      )}

      {/* Preset Avatar Emojis */}
      <div className="flex items-center gap-2 flex-wrap -mt-2">
        <span className="text-xs font-semibold text-brown-700/60 mr-1">
          Atau pilih avatar ZYBA:
        </span>
        {PRESET_EMOJIS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSelectEmoji(item.key)}
            disabled={isUploading}
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-base hover:scale-110 transition-transform cursor-pointer ${
              avatarUrl === item.key || avatarUrl === item.emoji
                ? "border-orange-500 bg-orange-100 ring-2 ring-orange-500/20"
                : "border-brown-900/15 bg-white hover:bg-cream"
            }`}
            title={item.key}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">
            Nama Lengkap:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            readOnly
            title="Email tidak dapat diubah langsung"
            className="w-full mt-1 bg-cream/30 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900/60 font-bold focus:outline-none cursor-not-allowed"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">Nomor HP:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">
            Lokasi / Kota:
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-brown-900">Bio Singkat:</label>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={2}
          maxLength={160}
          placeholder="Ceritakan sedikit tentang dirimu..."
          className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 p-3 text-xs text-brown-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
        />
        <span className="text-[10px] text-brown-700/40">
          {bio.length}/160
        </span>
      </div>
    </div>
  );
}
