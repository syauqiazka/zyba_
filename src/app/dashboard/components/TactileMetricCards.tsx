"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TactilePebble from "./TactilePebble";

interface TactileMetricCardsProps {
  streak: number;
  conversationCount: number;
  score: number | null;
  condition: string;
  hasAssessment: boolean;
}

export default function TactileMetricCards({
  streak,
  conversationCount,
  score,
  condition,
  hasAssessment,
}: TactileMetricCardsProps) {
  const currentWeek = Math.max(1, Math.min(4, Math.ceil((streak || 1) / 7)));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {/* 1. Ritual Konsistensi (Agate Stone) */}
      <Link
        href="/mood-check-in"
        className="group relative bg-[#FAF7F2] rounded-[22px] border border-brown-900/10 p-5 shadow-xs hover:border-orange-500/40 hover:shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
            Ritual Konsistensi
          </span>
          <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-brown-700/60 group-hover:text-orange-500 group-hover:bg-orange-100 transition-colors">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <span className="text-[11px] font-medium text-brown-700/70 block">
            Pekan {currentWeek} dari 4
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
              HARI {streak}
            </span>
            <span className="text-xs font-bold text-brown-700/60 tracking-wider">
              / 30
            </span>
          </div>
        </div>

        {/* 3D Tactile Red Agate Pebble */}
        <div className="absolute -bottom-2 -right-1 group-hover:scale-105 transition-transform duration-300">
          <TactilePebble type="agate" className="w-20 h-16" />
        </div>
      </Link>

      {/* 2. Sesi Curhat (Jade Stone) */}
      <Link
        href="/companion"
        className="group relative bg-[#FAF7F2] rounded-[22px] border border-brown-900/10 p-5 shadow-xs hover:border-green-500/40 hover:shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
            Sesi Curhat AI
          </span>
          <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-brown-700/60 group-hover:text-green-700 group-hover:bg-green-100 transition-colors">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <span className="text-[11px] font-medium text-brown-700/70 block">
            {conversationCount > 0 ? "Sesi Berlangsung" : "Sesi Baru Siaga"}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
              {conversationCount} SESI
            </span>
            <span className="text-xs font-bold text-brown-700/60 tracking-wider">
              / 10
            </span>
          </div>
        </div>

        {/* 3D Tactile Green Jade Pebble */}
        <div className="absolute -bottom-2 -right-1 group-hover:scale-105 transition-transform duration-300">
          <TactilePebble type="jade" className="w-20 h-16" />
        </div>
      </Link>

      {/* 3. Skor Kesejahteraan (Amber Stone) */}
      <Link
        href="/wellness-journey"
        className="group relative bg-[#FAF7F2] rounded-[22px] border border-brown-900/10 p-5 shadow-xs hover:border-amber-500/40 hover:shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
            Zyba Score
          </span>
          <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-brown-700/60 group-hover:text-amber-700 group-hover:bg-amber-100 transition-colors">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <span className="text-[11px] font-medium text-brown-700/70 block truncate max-w-[140px]">
            {hasAssessment ? condition : "Belum Dievaluasi"}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
              {score !== null && hasAssessment ? score : "—"}
            </span>
            <span className="text-xs font-bold text-brown-700/60 tracking-wider">
              / 100
            </span>
          </div>
        </div>

        {/* 3D Tactile Amber Stone */}
        <div className="absolute -bottom-2 -right-1 group-hover:scale-105 transition-transform duration-300">
          <TactilePebble type="amber" className="w-20 h-16" />
        </div>
      </Link>
    </div>
  );
}

