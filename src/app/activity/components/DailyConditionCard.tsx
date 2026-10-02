"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useFreshData } from "@/hooks/useFreshData";

export interface DailyConditionData {
  energyTitle: string;
  badgeText: string;
  badgeColor: "green" | "orange" | "amber";
  sleepHours: string;
  moodLabel: string;
  focusLabel: string;
  insight: string;
  hasCheckedInToday?: boolean;
}

interface DailyConditionCardProps {
  initialCondition?: DailyConditionData | null;
}

export default function DailyConditionCard({ initialCondition }: DailyConditionCardProps) {
  const [condition, setCondition] = useState<DailyConditionData>(
    initialCondition || {
      energyTitle: "Memuat Kondisi...",
      badgeText: "Sinkronisasi",
      badgeColor: "green",
      sleepHours: "-",
      moodLabel: "-",
      focusLabel: "-",
      insight: "Menganalisis data aktivitas dan kesehatan mentalmu...",
      hasCheckedInToday: false,
    }
  );
  const [isLoading, setIsLoading] = useState(!initialCondition);

  const fetchCondition = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/activity", {
        cache: "no-store",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.condition) setCondition(data.condition);
      }
    } catch (err) {
      console.warn("[DailyConditionCard] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCondition) {
      setCondition(initialCondition);
      setIsLoading(false);
    } else {
      void fetchCondition();
    }
  }, [initialCondition, fetchCondition]);

  useFreshData(fetchCondition);

  const badgeBg =
    condition.badgeColor === "orange"
      ? "bg-orange-100 text-orange-600"
      : condition.badgeColor === "amber"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="xl:col-span-5 glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-brown-900/10 bg-gradient-to-b from-white to-cream/40 flex flex-col justify-between shadow-xs min-w-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brown-700">
              Kondisi Hari Ini
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brown-900 mt-1 leading-tight break-words">
              {condition.energyTitle}
            </h2>
          </div>
          <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${badgeBg}`}>
            {condition.badgeText}
          </span>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3 sm:p-3.5 text-center shadow-2xs min-w-0 min-h-[92px] flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Tidur
            </span>
            <span className="block font-display text-base sm:text-xl leading-tight font-extrabold text-brown-900 mt-1 whitespace-nowrap">
              {condition.sleepHours}
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3.5 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Mood
            </span>
            <span className="block font-display text-base sm:text-xl leading-tight font-extrabold text-green-600 mt-1 whitespace-nowrap">
              {condition.moodLabel}
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3.5 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Fokus
            </span>
            <span className="block font-display text-base sm:text-xl leading-tight font-extrabold text-orange-500 mt-1 whitespace-nowrap">
              {condition.focusLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 rounded-2xl bg-cream/70 border border-brown-900/10 p-3.5 sm:p-4">
          <p className="text-xs leading-relaxed text-brown-700">
            <strong className="text-brown-900">Insight Zyba: </strong>
            {condition.insight}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <span className="text-brown-700/70 text-[11px] leading-relaxed min-w-0 break-words">
          {condition.hasCheckedInToday ? "✓ Terhubung dengan Check-In Harian" : "Belum check-in hari ini"}
        </span>
        <Link
          href="/daily-assessment"
          className="text-orange-500 hover:text-brown-900 font-bold transition-colors inline-flex items-center gap-1 text-[11px] shrink-0 self-start sm:self-auto"
        >
          <span>{condition.hasCheckedInToday ? "Lihat Mood" : "Check-in Sekarang"}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
