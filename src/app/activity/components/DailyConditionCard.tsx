"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

  useEffect(() => {
    if (initialCondition) {
      setCondition(initialCondition);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    async function fetchCondition() {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) {
          const data = await res.json();
          if (data.condition && !isCancelled) {
            setCondition(data.condition);
          }
        }
      } catch (err) {
        console.warn("[DailyConditionCard] Fetch error:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchCondition();
    return () => {
      isCancelled = true;
    };
  }, [initialCondition]);

  const badgeBg =
    condition.badgeColor === "orange"
      ? "bg-orange-100 text-orange-600"
      : condition.badgeColor === "amber"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="xl:col-span-5 glass-card rounded-3xl p-6 md:p-7 border border-brown-900/10 bg-gradient-to-b from-white to-cream/40 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brown-700">
              Kondisi Hari Ini
            </span>
            <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
              {condition.energyTitle}
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${badgeBg}`}>
            {condition.badgeText}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3.5 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Tidur
            </span>
            <span className="block font-display text-xl font-extrabold text-brown-900 mt-1">
              {condition.sleepHours}
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3.5 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Mood
            </span>
            <span className="block font-display text-xl font-extrabold text-green-600 mt-1">
              {condition.moodLabel}
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-brown-900/10 p-3.5 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-brown-700">
              Fokus
            </span>
            <span className="block font-display text-xl font-extrabold text-orange-500 mt-1">
              {condition.focusLabel}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-cream/70 border border-brown-900/10 p-4">
          <p className="text-xs leading-relaxed text-brown-700">
            <strong className="text-brown-900">Insight Zyba: </strong>
            {condition.insight}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/10 flex items-center justify-between text-xs">
        <span className="text-brown-700/70 text-[11px]">
          {condition.hasCheckedInToday ? "✓ Terhubung dengan Check-In Harian" : "Belum check-in hari ini"}
        </span>
        <Link
          href="/mood-check-in"
          className="text-orange-500 hover:text-brown-900 font-bold transition-colors inline-flex items-center gap-1 text-[11px]"
        >
          <span>{condition.hasCheckedInToday ? "Lihat Mood" : "Check-in Sekarang"}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
