"use client";

import { Wind, Smile, PenTool, BookOpen, Sparkles, MessageCircle, Check } from "lucide-react";

interface TrackerChecklistProps {
  trackerState: { [key: string]: boolean };
  completedCount: number;
  totalTrackers: number;
  toggleTracker: (key: string) => void;
}

const TRACKER_ITEMS = [
  { key: "Zyba Hours (Latihan Napas)", category: "Ketenangan", icon: Wind, href: "/activity" },
  { key: "Catatan Jurnal Kesehatan", category: "Refleksi", icon: PenTool, href: "/daily-assessment" },
  { key: "Membaca Wawasan Harian", category: "Wawasan", icon: BookOpen, href: "/resources" },
  { key: "Refleksi Jurnal Mental", category: "Kesehatan Mental", icon: Sparkles, href: "/wellness-journey" },
  { key: "Aktivitas Komunitas", category: "Dukungan Sosial", icon: MessageCircle, href: "/community" },
];

export default function TrackerChecklist({
  trackerState,
  completedCount,
  totalTrackers,
  toggleTracker,
}: TrackerChecklistProps) {
  return (
    <section className="glass-card rounded-3xl p-5 sm:p-7 border border-brown-900/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-brown-900">
            Daftar Rutinitas Harian
          </h2>
          <p className="text-xs text-brown-700 mt-0.5">
            Selesaikan rutinitas harianmu untuk menjaga Skor Zyba tetap optimal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brown-900">
            {completedCount} / {totalTrackers} Selesai
          </span>
          <div className="w-24 h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${totalTrackers > 0 ? (completedCount / totalTrackers) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRACKER_ITEMS.map((item) => {
          const isChecked = Boolean(trackerState[item.key]);
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => toggleTracker(item.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isChecked
                  ? "bg-green-100/50 border-green-500/30 text-brown-900"
                  : "bg-white border-brown-900/10 hover:border-orange-500/40 text-brown-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isChecked ? "bg-green-500 text-white" : "border-2 border-brown-900/20 bg-cream"
                  }`}
                >
                  {isChecked ? <Check size={14} strokeWidth={3} /> : null}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{item.key}</span>
                  <span className="text-[10px] text-brown-700/80">{item.category}</span>
                </div>
              </div>
              <Icon className="size-5 text-brown-700" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
