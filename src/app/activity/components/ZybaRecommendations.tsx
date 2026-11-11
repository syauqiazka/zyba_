"use client";

import React from "react";
import { Plus, Sparkles, Clock, Compass } from "lucide-react";
import { renderActivityIcon } from "@/lib/activityIcons";

export interface Recommendation {
  id: string;
  icon: string;
  title: string;
  duration: string;
  points: number;
  description: string;
}

interface ZybaRecommendationsProps {
  recommendations: Recommendation[];
  onAdd: (recommendation: Recommendation) => void;
}

export default function ZybaRecommendations({
  recommendations,
  onAdd,
}: ZybaRecommendationsProps) {
  return (
    <div className="xl:col-span-7 rounded-[20px] p-6 md:p-8 border border-brown-900/10 bg-white/95 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-800 bg-green-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Compass size={12} className="text-green-700" />
            Rekomendasi Pemulihan
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-brown-900 mt-2">
            Pilih aktivitas yang paling nyaman hari ini
          </h2>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-cream text-brown-700 text-[10px] font-bold border border-brown-900/10">
          Saran Adaptif
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-3.5 mt-6">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-brown-900/10 bg-cream/35 hover:bg-cream/60 transition-colors p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-brown-900/10 flex items-center justify-center text-green-700 shadow-2xs">
                  {renderActivityIcon(item.icon, "w-5 h-5")}
                </div>
                <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                  <Sparkles size={11} className="text-orange-500" />
                  +{item.points} pts
                </span>
              </div>
              <h3 className="text-sm font-bold text-brown-900 mt-3">
                {item.title}
              </h3>
              <p className="text-[11px] text-brown-700/80 mt-1.5 leading-relaxed min-h-[44px]">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-brown-900/8">
              <span className="text-[11px] font-medium text-brown-700 flex items-center gap-1">
                <Clock size={11} className="text-brown-700/60" />
                {item.duration}
              </span>
              <button
                type="button"
                onClick={() => onAdd(item)}
                className="px-3.5 py-1.5 rounded-full bg-brown-900 text-white text-[11px] font-bold hover:bg-green-600 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
