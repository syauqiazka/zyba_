"use client";

import React from "react";

export const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", bg: "#A99BE0", text: "text-white" },
  { value: "SAD", label: "Sad", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", bg: "#6B5645", text: "text-white" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

interface QuickCheckInFormProps {
  selectedMood: typeof MOODS[number];
  setSelectedMood: (mood: typeof MOODS[number]) => void;
  stressRating: number;
  setStressRating: (rating: number) => void;
  note: string;
  setNote: (note: string) => void;
  onSave: () => void;
  savedSuccess: boolean;
  isSaving: boolean;
  hasCheckedInToday?: boolean;
  todayEntry?: any;
}

export default function QuickCheckInForm({
  selectedMood,
  setSelectedMood,
  stressRating,
  setStressRating,
  note,
  setNote,
  onSave,
  savedSuccess,
  isSaving,
  hasCheckedInToday,
  todayEntry,
}: QuickCheckInFormProps) {
  return (
    <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-white flex flex-col gap-6">
      {/* Banner status jika sudah check-in hari ini */}
      {hasCheckedInToday && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-500/30 flex items-start gap-3">
          <span className="text-2xl shrink-0">✅</span>
          <div>
            <h3 className="font-display text-sm font-bold text-green-800">
              Kamu sudah melakukan Mood Check-In hari ini!
            </h3>
            <p className="text-xs text-green-700 mt-0.5">
              Check-in hanya dapat dilakukan 1 kali per hari untuk menjaga konsistensi tracking. Sampai jumpa besok!
            </p>
            {todayEntry?.note && (
              <p className="text-xs text-brown-700 bg-white/70 p-2.5 rounded-xl border border-green-500/20 mt-2 italic">
                &ldquo;{todayEntry.note}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {/* 1. Mood Picker */}
      <div>
        <h2 className="font-display text-lg font-bold text-brown-900 mb-1">
          Bagaimana perasaanmu sekarang?
        </h2>
        <p className="text-xs text-brown-700 mb-4">
          {hasCheckedInToday
            ? "Mood hari ini telah tercatat. Kamu dapat melihat riwayatnya di kalender samping."
            : "Pilih 1 dari 5 skala emosi untuk mencatat kondisimu hari ini."}
        </p>
        <div className="grid grid-cols-5 gap-3">
          {MOODS.map((m) => {
            const isSelected = selectedMood.value === m.value;
            return (
              <button
                key={m.value}
                type="button"
                disabled={hasCheckedInToday}
                onClick={() => setSelectedMood(m)}
                style={{ backgroundColor: isSelected ? m.bg : undefined }}
                className={`rounded-2xl py-5 flex flex-col items-center gap-2.5 border-2 transition-all duration-200 ${
                  hasCheckedInToday ? "cursor-default" : "cursor-pointer"
                } ${
                  isSelected
                    ? `${m.text} border-brown-900 shadow-lg scale-105 font-bold`
                    : "bg-cream/70 border-transparent text-brown-900 hover:border-orange-500/40 hover:bg-orange-500/5"
                } ${hasCheckedInToday && !isSelected ? "opacity-40" : ""}`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-[11px] font-semibold">{m.label}</span>
                {isSelected && <span className="text-white/90 text-[9px] font-bold tracking-wider">✓ DIPILIH</span>}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-brown-900/10" />

      {/* 2. Tingkat Stres (opsional) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-brown-900">
            Tingkat Stres{" "}
            <span className="text-xs font-normal text-brown-700">(Opsional)</span>
          </h2>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-orange-500">
            Level {stressRating}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={stressRating}
          onChange={(e) => setStressRating(Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer h-2 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-brown-700 font-bold mt-1">
          <span>1 - Tenang</span>
          <span>3 - Sedang</span>
          <span>5 - Kewalahan</span>
        </div>
      </div>

      <hr className="border-brown-900/10" />

      {/* 3. Catatan singkat (opsional) */}
      <div>
        <h2 className="font-display text-base font-bold text-brown-900 mb-1">
          Catatan Singkat{" "}
          <span className="text-xs font-normal text-brown-700">(Opsional)</span>
        </h2>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={hasCheckedInToday}
          maxLength={280}
          placeholder={hasCheckedInToday ? "Check-in hari ini sudah selesai." : "Ada yang ingin kamu catat? (maks. 280 karakter)"}
          className="w-full rounded-2xl border border-brown-900/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30 disabled:opacity-60"
        />
        <p className="text-[10px] text-brown-700/60 text-right mt-1">{note.length}/280</p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-1">
        {savedSuccess ? (
          <span className="text-sm font-bold text-green-500 flex items-center gap-1.5">
            <span>✓</span> Mood berhasil dicatat!
          </span>
        ) : (
          <span className="text-xs text-brown-700">
            {hasCheckedInToday ? "Satu check-in per hari untuk akurasi data." : "Setiap check-in tersimpan dengan timestamp nyata."}
          </span>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || hasCheckedInToday}
          className={`font-bold text-sm px-7 py-3 rounded-full transition-colors shadow-md ${
            hasCheckedInToday
              ? "bg-brown-900/30 text-brown-900/60 cursor-not-allowed"
              : "bg-brown-900 hover:bg-orange-500 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {hasCheckedInToday ? "Sudah Check-In Hari Ini ✓" : isSaving ? "Menyimpan..." : "Check-in →"}
        </button>
      </div>
    </div>
  );
}
