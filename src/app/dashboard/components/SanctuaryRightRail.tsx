"use client";

import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";

interface SanctuaryRightRailProps {
  trackerState: { [key: string]: boolean };
  toggleTracker: (key: string) => void;
}

export default function SanctuaryRightRail({
  trackerState,
  toggleTracker,
}: SanctuaryRightRailProps) {
  const TODAY_SCHEDULE = [
    {
      key: "Refleksi Pagi",
      time: "08:00 WIB",
      duration: "5 mnt jurnal",
      category: "Ketenangan",
    },
    {
      key: "Latihan Napas 4-7-8",
      time: "12:00 WIB",
      duration: "Teknik 4-7-8",
      category: "Pernapasan",
    },
    {
      key: "Jeda & Hidrasi Sore",
      time: "15:00 WIB",
      duration: "Peregangan",
      category: "Fisik",
    },
  ];

  const completedToday = TODAY_SCHEDULE.filter((item) => Boolean(trackerState[item.key])).length;

  return (
    <aside className="w-full bg-white/90 rounded-[24px] border border-brown-900/10 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* ====================================================
          2. KOTAK TENANG: GROUNDING 5-4-3-2-1 TRIGGER CARD
      ==================================================== */}
      <div className="bg-green-100 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white text-brown-900 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-brown-900 truncate">Kotak Tenang 5-4-3-2-1</span>
            <span className="text-[10px] text-brown-700 font-medium truncate">Redakan cemas &amp; panik instan</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("zyba_open_grounding"));
            }
          }}
          className="px-3.5 py-1.5 rounded-full bg-brown-900 hover:bg-orange-500 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 ml-2"
        >
          Mulai
        </button>
      </div>

      {/* ====================================================
          2. TODAY'S TASKS (CHECKLIST HARIAN)
      ==================================================== */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm sm:text-base font-bold text-brown-900">
              Rutinitas Hari Ini
            </h3>
            <span className="w-5 h-5 rounded-full bg-cream text-brown-900 text-[11px] font-bold flex items-center justify-center border border-brown-900/15">
              {completedToday}/{TODAY_SCHEDULE.length}
            </span>
          </div>
          <span className="text-[11px] text-brown-700/70 font-medium">Langkah Mikro</span>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {TODAY_SCHEDULE.map((task) => {
            const isDone = Boolean(trackerState[task.key]);

            return (
              <div
                key={task.key}
                onClick={() => toggleTracker(task.key)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isDone
                    ? "bg-green-100/40 border-green-500/25 text-brown-900"
                    : "bg-white/90 border-brown-900/10 hover:border-orange-500/30 text-brown-900"
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold leading-tight ${isDone ? "line-through opacity-60" : ""}`}>
                    {task.key}
                  </span>
                  <span className="text-[10px] text-brown-700/70 mt-0.5">
                    {task.duration} · {task.time}
                  </span>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-green-500 text-white shadow-2xs"
                      : "border border-brown-900/25 bg-cream/50 group-hover:border-orange-500 group-hover:bg-orange-100/50"
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : null}
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/activity"
          className="text-center w-full py-2 rounded-xl text-xs font-semibold text-brown-900 hover:text-orange-500 hover:bg-cream/60 transition-colors cursor-pointer mt-1"
        >
          Lihat Semua Aktivitas →
        </Link>
      </div>
    </aside>
  );
}
