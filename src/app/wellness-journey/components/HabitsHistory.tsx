"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Wind, Footprints, Dumbbell, BookOpen, ArrowRight } from "lucide-react";

export interface HabitCountItem {
  id: string;
  label: string;
  count: number;
  unit: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface HabitsHistoryProps {
  habits: HabitCountItem[];
  timeRangeLabel: string;
}

export default function HabitsHistory({ habits, timeRangeLabel }: HabitsHistoryProps) {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-brown-900/5">
        <div>
          <h3 className="font-display text-base font-bold text-brown-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 size={18} className="text-orange-500" />
            <span>Kebiasaan & Riwayat Aktivitas</span>
          </h3>
          <p className="text-xs text-brown-700/70 mt-0.5">
            Akumulasi aktivitas dan rutinitas sehatmu dalam {timeRangeLabel} terakhir.
          </p>
        </div>

        <Link
          href="/activity"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>Buka Activity Planner</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {habits.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-cream/35 border border-brown-900/5 flex flex-col justify-between gap-2 hover:border-brown-900/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`w-8 h-8 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon size={16} />
                </span>
              </div>

              <div className="flex flex-col mt-1">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 leading-none">
                  {item.count}
                </span>
                <span className="text-[11px] font-semibold text-brown-700 mt-1">
                  {item.label}
                </span>
                <span className="text-[10px] text-brown-700/60">
                  {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
