"use client";

import { Wind, Smile, PenTool, BookOpen, Heart, MessageCircle, Check } from "lucide-react";

interface TrackerChecklistProps {
  trackerState: { [key: string]: boolean };
  completedCount: number;
  totalTrackers: number;
  toggleTracker: (key: string) => void;
}

const TRACKER_ITEMS = [
  { key: "Zyba Hours (Latihan Napas)", category: "Ketenangan", icon: Wind, href: "/activity" },
  { key: "Catatan Jurnal Kesehatan", category: "Refleksi", icon: PenTool, href: "/mood-check-in" },
  { key: "Membaca Wawasan Harian", category: "Wawasan", icon: BookOpen, href: "/resources" },
  { key: "Refleksi Jurnal Mental", category: "Kesehatan Mental", icon: Heart, href: "/wellness-journey" },
  { key: "Aktivitas Komunitas", category: "Dukungan Sosial", icon: MessageCircle, href: "/community" },
];

export default function TrackerChecklist({
  trackerState,
  completedCount,
  totalTrackers,
  toggleTracker,
}: TrackerChecklistProps) {
  return (
    <section className="rounded-[20px] bg-white/95 border border-brown-900/10 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-brown-900/10">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-brown-900">
            Rutinitas Pemulihan Hari Ini
          </h2>
          <p className="text-xs text-brown-700 mt-0.5">
            Langkah mikro untuk merawat keseimbangan emosional.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-bold text-brown-900">
            {completedCount}/{totalTrackers}
          </span>
          <div className="w-16 h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${totalTrackers > 0 ? (completedCount / totalTrackers) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {TRACKER_ITEMS.map((item) => {
          const isChecked = Boolean(trackerState[item.key]);
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => toggleTracker(item.key)}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isChecked
                  ? "bg-green-100/40 border-green-500/25 text-brown-900"
                  : "bg-cream/40 border-brown-900/10 hover:border-orange-500/30 hover:bg-cream/70 text-brown-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isChecked ? "bg-green-500 text-white shadow-2xs" : "border-2 border-brown-900/20 bg-white"
                  }`}
                >
                  {isChecked ? <Check size={13} strokeWidth={3} /> : null}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold ${isChecked ? "line-through opacity-70" : ""}`}>
                    {item.key}
                  </span>
                  <span className="text-[10px] text-brown-700/70">{item.category}</span>
                </div>
              </div>
              <Icon className="w-4 h-4 text-brown-700/60 shrink-0" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
