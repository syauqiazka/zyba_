"use client";

import React from "react";
import { DailyRecord, Pagination, SLEEP_OPTIONS } from "./DailyAssessmentForm";

interface HistoryProps {
  history: DailyRecord[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const MOOD_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  DEPRESSED: { emoji: "😞", label: "Depressed", color: "text-[#A99BE0]" },
  SAD: { emoji: "🙁", label: "Sad", color: "text-[#EE8A5E]" },
  NEUTRAL: { emoji: "😐", label: "Neutral", color: "text-brown-700" },
  HAPPY: { emoji: "🙂", label: "Happy", color: "text-[#E8C24A]" },
  OVERJOYED: { emoji: "😄", label: "Overjoyed", color: "text-green-500" },
};

const STRESS_LABELS = ["", "Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];

export default function DailyAssessmentHistory({ history, pagination, onPageChange, isLoading }: HistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-cream/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-brown-700 text-sm">
        <span className="text-4xl block mb-2">📋</span>
        Belum ada riwayat Assessment Harian.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-brown-900">
        Riwayat Assessment Harian
        <span className="ml-2 text-xs font-normal text-brown-700">({pagination.total} entri)</span>
      </h3>

      <div className="flex flex-col gap-3">
        {history.map((record) => {
          const mood = MOOD_MAP[record.mood] || { emoji: "😐", label: record.mood, color: "text-brown-700" };
          const sleep = SLEEP_OPTIONS.find((o) => o.rating === record.sleepRating);
          const dateFormatted = new Date(record.date + "T00:00:00").toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={record.id}
              className="glass-card rounded-2xl p-4 border border-brown-900/10 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-brown-900">{dateFormatted}</p>
                    <p className={`text-xs font-semibold ${mood.color}`}>{mood.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right shrink-0">
                  {record.stressLevel !== null && (
                    <div className="text-center">
                      <p className="text-[10px] text-brown-700 font-semibold">Stres</p>
                      <p className="text-xs font-bold text-brown-900">{record.stressLevel}/5</p>
                    </div>
                  )}
                  {sleep && (
                    <div className="text-center">
                      <p className="text-[10px] text-brown-700 font-semibold">Tidur</p>
                      <p className="text-xs font-bold text-brown-900">{sleep.icon} {sleep.label}</p>
                    </div>
                  )}
                </div>
              </div>

              {record.energyTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {record.energyTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-cream border border-brown-900/10 rounded-full text-[10px] font-semibold text-brown-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {record.reflection && (
                <p className="mt-2.5 text-xs text-brown-700 line-clamp-2 italic">"{record.reflection}"</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-brown-700 border border-brown-900/15 hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Prev
          </button>
          <span className="text-xs text-brown-700 font-semibold">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-brown-700 border border-brown-900/15 hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
