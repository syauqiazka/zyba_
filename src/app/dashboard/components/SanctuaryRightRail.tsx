"use client";

import Link from "next/link";
import { Bot, Check, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

interface SanctuaryRightRailProps {
  conversationCount: number;
  hasAssessment: boolean;
  trackerState: { [key: string]: boolean };
  toggleTracker: (key: string) => void;
}

export default function SanctuaryRightRail({
  conversationCount,
  hasAssessment,
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
    <aside className="w-full bg-[#FAF7F2] rounded-[24px] border border-brown-900/10 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* ====================================================
          1. TANYA ZYBA COMPANION / SPECIALIST CARD
      ==================================================== */}
      <div className="flex flex-col gap-3 pb-5 border-b border-brown-900/10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
            Pendamping Tenang
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Siaga 24/7
          </span>
        </div>

        <div className="flex items-center gap-3.5 mt-1">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0 shadow-2xs">
            <Bot size={24} />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-display text-base font-bold text-brown-900 truncate">
              Tanya Zyba AI
            </h4>
            <span className="text-xs text-brown-700/70 font-medium truncate">
              Ruang Curhat &amp; Konseling Privat
            </span>
          </div>
        </div>

        <div className="mt-2 bg-white/90 rounded-2xl p-3 border border-brown-900/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-brown-900">Sesi Mendengarkan</span>
            <span className="text-[10px] text-brown-700/70">{conversationCount} percakapan tersimpan</span>
          </div>
          <Link
            href="/companion"
            className="rounded-full bg-brown-900 hover:bg-orange-500 text-cream px-3.5 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Mulai</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ====================================================
          2. KOTAK TENANG: GROUNDING 5-4-3-2-1 TRIGGER CARD
      ==================================================== */}
      <div className="bg-green-100/60 rounded-2xl p-3.5 border border-green-500/25 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-green-500/20 text-green-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-brown-900 truncate">Kotak Tenang 5-4-3-2-1</span>
            <span className="text-[10px] text-green-800/80 font-medium truncate">Redakan cemas &amp; panik instan</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("zyba_open_grounding"));
            }
          }}
          className="px-3.5 py-1.5 rounded-full bg-brown-900 hover:bg-green-700 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 ml-2"
        >
          Mulai
        </button>
      </div>

      {/* ====================================================
          2. TODAY'S TASKS (CHECKLIST HARIAN)
      ==================================================== */}
      <div className="flex flex-col gap-3 pb-5 border-b border-brown-900/10">
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
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isDone
                    ? "bg-green-100/40 border-green-500/25 text-brown-900"
                    : "bg-white/90 border-brown-900/10 hover:border-orange-500/30 text-brown-800"
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

      {/* ====================================================
          3. BOTTOM MOOD CHECK-IN BANNER
      ==================================================== */}
      <div className="relative rounded-[24px] bg-orange-500 p-6 text-white shadow-xs overflow-hidden flex flex-col justify-between min-h-[160px] group">
        {/* Soft background glow circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/10 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
            <span>Check-In Emosimu</span>
          </div>

          <h4 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
            {hasAssessment ? "Sudah Hadir Hari Ini?" : "Bagaimana Cuaca Batinmu?"}
          </h4>

          <p className="text-xs text-white/85 mt-1 leading-relaxed max-w-[220px]">
            {hasAssessment
              ? "Catatan suasana hatimu telah tersimpan. Ingin menambah refleksi baru?"
              : "Amati perasaanmu tanpa menghakimi. Luangkan 1 menit untuk dirimu."}
          </p>
        </div>

        <div className="mt-5 relative z-10">
          <Link
            href="/mood-check-in"
            className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-cream text-brown-900 px-5 py-2 text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <span>{hasAssessment ? "Buka Catatan" : "Check in sekarang"}</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

