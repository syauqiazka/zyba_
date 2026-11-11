"use client";

import React from "react";
import { Sparkles, Target, Compass } from "lucide-react";

interface ActivityBannerProps {
  activityProgress: number;
  targetProgress: number;
}

export default function ActivityBanner({
  activityProgress,
  targetProgress,
}: ActivityBannerProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const progressPercent = Math.min(
    Math.round((activityProgress / targetProgress) * 100),
    100
  );

  return (
    <div className="rounded-[24px] p-6 sm:p-8 border border-brown-900/10 bg-white/95 flex flex-col gap-4 shadow-xs relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Label + Heading + Description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-green-500 text-white text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-2xs">
              <Compass size={12} />
              Perencana Aktivitas Cerdas
            </span>
            <span className="text-xs text-brown-700/80 font-medium capitalize">
              {today}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 leading-tight">
            Tubuhmu adalah rumahmu. Berikan ia ruang beristirahat.
          </h1>

          <p className="text-xs sm:text-sm text-brown-700/80 mt-1.5 max-w-2xl leading-relaxed">
            Tidak ada target jarak atau kalori yang menuntut di sini. Kombinasikan gerak mikro sederhana dan ritme napas 4-7-8 untuk menjaga kestabilan sistem sarafmu sepanjang hari.
          </p>
        </div>

        {/* Right: Target Progress Card */}
        <div className="shrink-0">
          <div className="bg-cream/40 p-4 sm:p-5 rounded-[20px] border border-brown-900/10 flex flex-col items-center min-w-[160px] shadow-2xs">
            <div className="flex items-center gap-1.5 text-brown-700 mb-1">
              <Target size={13} className="text-orange-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Target Poin Hari Ini
              </span>
            </div>

            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">
                {activityProgress}
              </span>
              <span className="text-xs font-semibold text-brown-700/60">
                / {targetProgress} pts
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full mt-3 bg-brown-900/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[10px] font-bold text-orange-600 mt-2">
              {progressPercent}% tercapai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
