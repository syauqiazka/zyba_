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
              {/* Card Header: Mood + Date + Hari Ini Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0 leading-none">
                    {mood.emoji}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brown-900 truncate">
                      {formatDateIndonesia(record.date)}
                    </p>
                    <p className={`text-[11px] font-semibold leading-tight ${mood.color}`}>
                      {mood.label}
                    </p>
                  </div>
                </div>

                {isToday && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-extrabold shrink-0 border border-orange-200">
                    Hari Ini
                  </span>
                )}
              </div>

              {/* Stats Grid: Zyba Score, Stres, Tidur (Clean, responsive, never overlaps) */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-brown-900/10 text-center">
                {score !== null ? (
                  <div className="bg-cream/60 rounded-xl p-2 border border-brown-900/5">
                    <p className="text-[9px] uppercase font-bold text-brown-700/70">
                      Zyba Score
                    </p>
                    <p className="text-xs font-extrabold text-brown-900 mt-0.5">
                      {score}
                      <span className="text-[9px] font-normal text-brown-700/60">
                        /100
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-cream/60 rounded-xl p-2 border border-brown-900/5">
                    <p className="text-[9px] uppercase font-bold text-brown-700/70">
                      Zyba Score
                    </p>
                    <p className="text-xs font-extrabold text-brown-900 mt-0.5">-</p>
                  </div>
                )}

                <div className="bg-cream/60 rounded-xl p-2 border border-brown-900/5">
                  <p className="text-[9px] uppercase font-bold text-brown-700/70">
                    Stres
                  </p>
                  <p className="text-xs font-extrabold text-brown-900 mt-0.5">
                    {record.stressLevel !== null ? `${record.stressLevel}/5` : "-"}
                  </p>
                </div>

                <div className="bg-cream/60 rounded-xl p-2 border border-brown-900/5">
                  <p className="text-[9px] uppercase font-bold text-brown-700/70">
                    Tidur
                  </p>
                  <p className="text-xs font-extrabold text-brown-900 mt-0.5 truncate flex items-center justify-center gap-0.5">
                    {sleep ? (
                      <>
                        <span>{sleep.icon}</span>
                        <span className="truncate">{sleep.label}</span>
                      </>
                    ) : (
                      "-"
                    )}
                  </p>
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