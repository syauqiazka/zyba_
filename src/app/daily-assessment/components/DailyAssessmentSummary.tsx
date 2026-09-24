"use client";

import React from "react";
import { DailyRecord, MOODS, SLEEP_OPTIONS } from "./DailyAssessmentForm";

interface SummaryProps {
  record: DailyRecord;
  onEdit: () => void;
}

const MOOD_MAP: Record<string, { emoji: string; label: string; bg: string }> = {
  DEPRESSED: { emoji: "😞", label: "Depressed", bg: "#A99BE0" },
  SAD: { emoji: "🙁", label: "Sad", bg: "#EE8A5E" },
  NEUTRAL: { emoji: "😐", label: "Neutral", bg: "#6B5645" },
  HAPPY: { emoji: "🙂", label: "Happy", bg: "#E8C24A" },
  OVERJOYED: { emoji: "😄", label: "Overjoyed", bg: "#8FAE5D" },
};

const STRESS_LABELS = ["", "Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];

export default function DailyAssessmentSummary({ record, onEdit }: SummaryProps) {
  const mood = MOOD_MAP[record.mood] || { emoji: "😐", label: record.mood, bg: "#6B5645" };
  const sleep = SLEEP_OPTIONS.find((o) => o.rating === record.sleepRating);

  const updatedTime = new Date(record.updatedAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header: Selesai hari ini */}
      <div className="flex items-center gap-3 p-4 bg-green-100/60 rounded-2xl border border-green-500/30">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-bold text-brown-900">Assessment Harian Selesai!</p>
          <p className="text-xs text-brown-700">Tercatat pukul {updatedTime}. Evaluasi harian hanya dapat diisi 1 kali sehari.</p>
        </div>
        <span className="ml-auto text-[11px] font-bold text-green-700 bg-green-200/60 px-3 py-1.5 rounded-full whitespace-nowrap">
          Tersimpan ✓
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mood */}
        <div className="glass-card rounded-2xl p-4 border border-brown-900/10 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">Mood</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{mood.emoji}</span>
            <span className="font-display font-bold text-brown-900">{mood.label}</span>
          </div>
          <div
            className="h-1.5 rounded-full mt-1"
            style={{ backgroundColor: mood.bg, opacity: 0.7 }}
          />
        </div>

        {/* Stress */}
        <div className="glass-card rounded-2xl p-4 border border-brown-900/10 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">Level Stres</span>
          {record.stressLevel !== null ? (
            <>
              <span className="font-display text-2xl font-extrabold text-brown-900">
                {record.stressLevel}
                <span className="text-sm font-normal text-brown-700">/5</span>
              </span>
              <span className="text-xs text-brown-700">{STRESS_LABELS[record.stressLevel] || "-"}</span>
            </>
          ) : (
            <span className="text-xs text-brown-700 italic">Tidak diisi</span>
          )}
        </div>

        {/* Sleep */}
        <div className="glass-card rounded-2xl p-4 border border-brown-900/10 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">Tidur</span>
          {sleep ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sleep.icon}</span>
                <span className="font-display font-bold text-brown-900">{sleep.label}</span>
              </div>
              <span className="text-xs text-brown-700">{sleep.desc}</span>
            </>
          ) : (
            <span className="text-xs text-brown-700 italic">Tidak diisi</span>
          )}
        </div>

        {/* Energy Tags */}
        <div className="glass-card rounded-2xl p-4 border border-brown-900/10 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">Kondisi</span>
          {record.energyTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {record.energyTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-cream border border-brown-900/10 rounded-full text-[10px] font-semibold text-brown-700"
                >
                  {tag}
                </span>
              ))}
              {record.energyTags.length > 3 && (
                <span className="text-[10px] text-brown-700">+{record.energyTags.length - 3}</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-brown-700 italic">Tidak diisi</span>
          )}
        </div>
      </div>

      {/* Reflection */}
      {record.reflection && (
        <div className="glass-card rounded-2xl p-5 border border-brown-900/10 bg-gradient-to-r from-cream to-white">
          <p className="text-xs font-bold uppercase tracking-wider text-brown-700 mb-2">Refleksi Harian</p>
          <p className="text-sm text-brown-900 leading-relaxed whitespace-pre-wrap">{record.reflection}</p>
        </div>
      )}

      {/* Crisis warning jika flagged */}
      {record.flaggedForRisk && (
        <div className="rounded-2xl p-4 bg-orange-50 border border-orange-500/30 flex items-start gap-3">
          <span className="text-lg">💛</span>
          <div>
            <p className="text-sm font-bold text-brown-900">Kami peduli dengan kondisimu</p>
            <p className="text-xs text-brown-700 mt-0.5">
              Jika kamu sedang dalam situasi sulit, jangan ragu menghubungi Into The Light Indonesia di{" "}
              <strong>119 ext 8</strong> (Hotline Kemenkes).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
