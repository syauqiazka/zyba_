"use client";

import React, { useState, useRef, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
  maxTags?: number;
  className?: string;
}

/**
 * TagInput — chip/tag input seperti email multi-recipient.
 * Tekan Enter / Tab / koma untuk konfirmasi chip baru.
 * Klik × di chip untuk hapus.
 */
export default function TagInput({
  tags,
  onChange,
  placeholder = "Ketik lalu tekan Enter...",
  hint,
  maxTags = 20,
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.includes(value) || tags.length >= maxTags) return;
    onChange([...tags, value]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Hapus chip terakhir saat input kosong + backspace
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Container chip + input */}
      <div
        className="min-h-[52px] w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] px-3 py-2.5 flex flex-wrap gap-2 items-center cursor-text transition-all focus-within:border-orange-500/60 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Chips */}
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-orange-200 max-w-[200px] sm:max-w-none"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-200 hover:text-orange-700 transition-colors"
              aria-label={`Hapus ${tag}`}
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 2l6 6M8 2l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </span>
        ))}

        {/* Input */}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : "Tambah lagi..."}
            className="flex-1 min-w-[140px] bg-transparent text-xs text-brown-900 font-medium placeholder:text-brown-700/35 outline-none border-none"
          />
        )}
      </div>

      {/* Hint */}
      {hint && (
        <span className="text-[10px] text-brown-700/60">{hint}</span>
      )}
    </div>
  );
}
