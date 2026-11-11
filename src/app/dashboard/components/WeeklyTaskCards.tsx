"use client";

import Link from "next/link";
import { Smile, Wind, BookOpen, HeartHandshake } from "lucide-react";

interface WeeklyTaskCardsProps {
  hasAssessment: boolean;
  streak: number;
}

export default function WeeklyTaskCards({ hasAssessment, streak }: WeeklyTaskCardsProps) {
  const tasks = [
    {
      id: "mood-check",
      title: "Mood Check-In",
      tag: "Rekomendasi",
      progress: hasAssessment ? 20 : 15,
      total: 20,
      icon: Smile,
      href: "/mood-check-in",
      badgeColor: "bg-orange-500/30 text-orange-200 border-orange-500/40",
    },
    {
      id: "breathing",
      title: "Latihan Napas 4-7-8",
      tag: "Relaksasi Fisik",
      progress: Math.min(23, Math.max(5, streak * 3)),
      total: 23,
      icon: Wind,
      href: "/activity",
      badgeColor: "bg-green-500/30 text-green-200 border-green-500/40",
    },
    {
      id: "journaling",
      title: "Jurnal Emosi & Solusi",
      tag: "Ruang Refleksi",
      progress: 11,
      total: 25,
      icon: BookOpen,
      href: "/wellness-journey",
      badgeColor: "bg-amber-500/30 text-amber-200 border-amber-500/40",
    },
    {
      id: "community",
      title: "Lingkaran Komunitas",
      tag: "Saling Merangkul",
      progress: 7,
      total: 15,
      icon: HeartHandshake,
      href: "/community",
      badgeColor: "bg-cream/20 text-cream border-cream/30",
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 w-full mt-2">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base sm:text-lg font-bold text-cream tracking-tight">
          Aktivitas Pekan Ini
        </h3>
        <span className="text-xs text-cream/70 font-medium">
          Langkah mikro terpilih
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {tasks.map((task) => {
          const Icon = task.icon;
          const percentage = Math.min(100, Math.round((task.progress / task.total) * 100));

          return (
            <Link
              key={task.id}
              href={task.href}
              className="bg-[#304134] hover:bg-[#384c3d] border border-white/10 rounded-[20px] p-4 sm:p-4.5 flex flex-col justify-between min-h-[140px] transition-all duration-200 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${task.badgeColor}`}
                  >
                    {task.tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-cream/80 group-hover:text-cream group-hover:scale-105 transition-transform">
                    <Icon size={14} />
                  </div>
                </div>

                <h4 className="font-display text-sm font-bold text-cream group-hover:text-orange-200 transition-colors leading-snug">
                  {task.title}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-white/10 flex flex-col gap-1.5">
                <div className="w-full h-1.5 rounded-full bg-black/20 overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-cream/65 font-medium">
                  <span>Selesai {percentage}%</span>
                  <span>{task.progress}/{task.total}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

