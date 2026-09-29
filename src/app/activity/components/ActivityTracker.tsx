"use client";

import React from "react";
import { Footprints, Flame, Dumbbell, Activity, Plus } from "lucide-react";

interface ActivityTrackerProps {
  activeTab: "WALKING" | "RUNNING" | "WORKOUT";
  setActiveTab: (tab: "WALKING" | "RUNNING" | "WORKOUT") => void;
  activityProgress: number;
  targetProgress: number;
  onAddProgress: () => void;
}

export default function ActivityTracker({
  activeTab,
  setActiveTab,
  activityProgress,
  targetProgress,
  onAddProgress,
}: ActivityTrackerProps) {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-brown-900/10 flex flex-col gap-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-extrabold text-brown-900 flex items-center gap-2">
            <Activity size={20} className="text-orange-500" />
            Pelacak Aktivitas & Latihan Fisik
          </h2>
          <p className="text-xs text-brown-700 mt-0.5">
            Pilih mode aktivitas fisik harianmu untuk memperbarui Zyba Score dan menjaga kebugaran tubuh.
          </p>
        </div>

        {/* Activity Type Selector Tabs with Lucide Icons */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10 overflow-x-auto max-w-full no-scrollbar shrink-0">
          {[
            { id: "WALKING", label: "Jalan Kaki", icon: Footprints },
            { id: "RUNNING", label: "Lari Santai", icon: Flame },
            { id: "WORKOUT", label: "Olahraga", icon: Dumbbell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brown-900 text-white shadow-sm"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Progress Ring & Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-brown-900/10 shadow-xs">
        <div className="flex flex-col items-center justify-center md:border-r border-brown-900/10 pr-0 md:pr-4">
          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider mb-2">
            Progress Real-Time
          </span>
          <span className="font-display text-4xl font-extrabold text-brown-900">
            {activityProgress} <span className="text-xs text-brown-700">/ {targetProgress}</span>
          </span>
          <span className="text-[11px] text-green-600 font-bold mt-1">
            {Math.round((activityProgress / targetProgress) * 100)}% Target Tercapai
          </span>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Estimasi Kalori Terbakar:</span>
            <span className="font-bold text-brown-900">320 kcal</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Durasi Aktif:</span>
            <span className="font-bold text-brown-900">42 Menit</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Jarak Tempuh:</span>
            <span className="font-bold text-brown-900">3.4 km</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-cream/50 p-4 rounded-2xl border border-brown-900/10">
          <button
            type="button"
            onClick={onAddProgress}
            className="w-full py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Tambah 150 Langkah / Poin</span>
          </button>
          <span className="text-[10px] text-brown-700 text-center">
            Tekan untuk memperbarui progress aktivitasmu
          </span>
        </div>
      </div>
    </div>
  );
}

