"use client";

import React from "react";

interface ActivityBannerProps {
  activityProgress: number;
  targetProgress: number;
}

export default function ActivityBanner({ activityProgress, targetProgress }: ActivityBannerProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-brown-900/10 bg-gradient-to-r from-green-100/50 via-white to-orange-100/40 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Label + Heading + Description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Smart Activity Planner
            </span>
            <span className="text-xs text-brown-700">{today}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 leading-tight">
            Rencanakan Aktivitas &amp; Relaksasi
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Kombinasi gerak fisik dan latihan pernapasan untuk menjaga stamina serta kestabilan emosi sepanjang hari.
          </p>
        </div>

        {/* Right: Target Card */}
        <div className="shrink-0">
          <div className="bg-white p-4 rounded-2xl border border-brown-900/10 flex flex-col items-center min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-brown-700">Target Hari Ini</span>
            <span className="font-display text-2xl font-extrabold text-orange-500">
              {activityProgress} / {targetProgress}
            </span>
            <div className="w-full mt-2 bg-cream rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${Math.min((activityProgress / targetProgress) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
