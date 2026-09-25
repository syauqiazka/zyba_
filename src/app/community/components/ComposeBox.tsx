"use client";

import { useState, useRef } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import { Image as ImageIcon, Loader2, X } from "lucide-react";

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

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed && !selectedFile) return;
    if (trimmed && detectRisk(trimmed) && onRiskDetected) onRiskDetected();

    setIsUploading(true);
    setUploadError(null);

    let uploadedUrl: string | undefined;
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

      onAddPost(trimmed, selectedTag, uploadedUrl);
      setContent("");
      setShowTagPicker(false);
      setIsFocused(false);
      handleRemoveImage();
    } catch (err: any) {
      setUploadError(err.message || "Gagal mempublikasikan postingan.");
    } finally {
      setIsUploading(false);
    }
  };

  const hasContent = content.trim().length > 0 || selectedFile !== null;
  const canPost = hasContent && !isUploading;

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

      {/* Upload error */}
      {uploadError && (
        <div className="mx-4 mt-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl flex items-center justify-between">
          <span>⚠ {uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-800 ml-2">✕</button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main compose area */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Current user avatar */}
        <div className="w-10 h-10 rounded-full bg-brown-900 border border-brown-900/20 text-white font-display font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
          {currentUserInitials}
        </div>

        {/* Textarea + image preview */}
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={selectedFile ? "Tambahkan keterangan foto..." : "Ada cerita apa hari ini? Bagikan ceritamu dengan hangat..."}
            rows={isFocused || hasContent ? 3 : 2}
            className="w-full text-sm text-brown-900 placeholder:text-brown-700/40 resize-none bg-transparent focus:outline-none leading-relaxed transition-all"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative mt-2 rounded-2xl overflow-hidden border border-brown-900/10 bg-cream/30 group max-h-48">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-40 object-cover"
              />
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

          {/* Tag pill */}
          <div className="flex items-center gap-2 mt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowTagPicker(!showTagPicker);
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
          {/* Photo upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              selectedFile
                ? "bg-orange-50 border-orange-200 text-orange-600 font-bold"
                : "border-brown-900/10 text-brown-700/60 hover:bg-white hover:text-brown-900"
            }`}
            title="Unggah Foto"
          >
            <ImageIcon size={14} className={selectedFile ? "text-orange-500" : ""} />
            <span className="hidden sm:inline">{selectedFile ? "Ganti Foto" : "Foto"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!canPost}
          className={`rounded-pill px-6 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
            canPost
              ? "bg-orange-500 text-white hover:bg-brown-900 active:scale-95 shadow-xs cursor-pointer"
              : "bg-brown-900/10 text-brown-900/30 cursor-not-allowed"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <span>Posting</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
