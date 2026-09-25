"use client";

import React from "react";
import {
  calculateDailyZybaScore,
} from "@/lib/assessmentMetrics";
import {
  DailyRecord,
  Pagination,
  SLEEP_OPTIONS,
} from "./DailyAssessmentForm";

interface HistoryProps {
  history: DailyRecord[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const MOOD_MAP: Record<
  string,
  {
    emoji: string;
    label: string;
    color: string;
  }
> = {
  DEPRESSED: {
    emoji: "😞",
    label: "Depressed",
    color: "text-[#A99BE0]",
  },
  SAD: {
    emoji: "🙁",
    label: "Sad",
    color: "text-[#EE8A5E]",
  },
  NEUTRAL: {
    emoji: "😐",
    label: "Neutral",
    color: "text-brown-700",
  },
  HAPPY: {
    emoji: "🙂",
    label: "Happy",
    color: "text-[#E8C24A]",
  },
  OVERJOYED: {
    emoji: "😄",
    label: "Overjoyed",
    color: "text-green-500",
  },
};

function getJakartaDateKey(
  date = new Date()
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);
}

function formatDateIndonesia(
  date: string
) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }
  ).format(
    new Date(`${date}T00:00:00+07:00`)
  );
}

function getConditionFromScore(
  score: number | null
) {
  if (score === null) {
    return "Belum Dinilai";
  }

  if (score >= 80) {
    return "Baik";
  }

  if (score >= 60) {
    return "Cukup";
  }

  return "Perlu Perhatian";
}

export default function DailyAssessmentHistory({
  history,
  pagination,
  onPageChange,
  isLoading,
}: HistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-cream/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-brown-700 text-sm">
        <span className="text-4xl block mb-2">
          📋
        </span>

        Belum ada riwayat Assessment Harian.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-brown-900">
        Riwayat Assessment Harian

        <span className="ml-2 text-xs font-normal text-brown-700">
          ({pagination.total} entri)
        </span>
      </h3>

      <div className="flex flex-col gap-3">
        {history.map((record) => {
          const mood =
            MOOD_MAP[record.mood] ?? {
              emoji: "😐",
              label: record.mood,
              color: "text-brown-700",
            };

          const sleep =
            SLEEP_OPTIONS.find(
              (o) =>
                o.rating ===
                record.sleepRating
            );


          const score =
            calculateDailyZybaScore({
              ...record,
            });

          const condition =
            record.condition ||
            getConditionFromScore(score);

          const isToday =
            record.date ===
            getJakartaDateKey();

          return (
            <div
              key={record.id}
              className={`
                glass-card
                rounded-2xl
                p-4
                border
                transition-shadow
                ${isToday
                  ? "border-orange-500/30 shadow-sm"
                  : "border-brown-900/10"
                }
              `}
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                {/* MOOD */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl shrink-0">
                    {mood.emoji}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-brown-900">
                        {formatDateIndonesia(
                          record.date
                        )}
                      </p>

                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-500 text-[9px] font-bold">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-semibold ${mood.color}`}
                    >
                      {mood.label}
                    </p>
                  </div>
                </div>

                {/* SCORE + DATA */}
                <div className="flex items-center gap-3 text-right shrink-0">
                  {/* ZYBA SCORE */}
                  {score !== null && (
                    <div className="text-center">
                      <p className="text-[10px] text-brown-700 font-semibold">
                        Zyba Score
                      </p>

                      <p className="text-sm font-extrabold text-brown-900">
                        {score}
                        <span className="text-[9px] font-semibold text-brown-700">
                          /100
                        </span>
                      </p>
                    </div>
                  )}

                  {/* STRESS */}
                  {record.stressLevel !==
                    null && (
                      <div className="text-center">
                        <p className="text-[10px] text-brown-700 font-semibold">
                          Stres
                        </p>

                        <p className="text-xs font-bold text-brown-900">
                          {record.stressLevel}/5
                        </p>
                      </div>
                    )}

                  {/* SLEEP */}
                  {sleep && (
                    <div className="text-center max-w-[90px]">
                      <p className="text-[10px] text-brown-700 font-semibold">
                        Tidur
                      </p>

                      <p className="text-xs font-bold text-brown-900">
                        {sleep.icon}{" "}
                        {sleep.label}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CONDITION */}
              {score !== null && (
                <div className="mt-3">
                  <span
                    className={`
                      inline-flex
                      px-2.5
                      py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      ${score >= 80
                        ? "bg-green-100 text-green-700"
                        : score >= 60
                          ? "bg-orange-100 text-orange-600"
                          : "bg-purple-100 text-purple-700"
                      }
                    `}
                  >
                    {condition}
                  </span>
                </div>
              )}

              {/* ENERGY TAGS */}
              {record.energyTags &&
                record.energyTags.length >
                0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {record.energyTags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-cream border border-brown-900/10 rounded-full text-[10px] font-semibold text-brown-700"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                )}

              {/* REFLECTION */}
              {record.reflection &&
                record.reflection.trim() !==
                "" && (
                  <p className="mt-2.5 text-xs text-brown-700 line-clamp-2 italic">
                    "{record.reflection}"
                  </p>
                )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() =>
              onPageChange(
                pagination.page - 1
              )
            }
            disabled={
              pagination.page <= 1
            }
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-brown-700 border border-brown-900/15 hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Prev
          </button>

          <span className="text-xs text-brown-700 font-semibold">
            {pagination.page} /{" "}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              onPageChange(
                pagination.page + 1
              )
            }
            disabled={
              pagination.page >=
              pagination.totalPages
            }
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-brown-700 border border-brown-900/15 hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}