"use client";

import React from "react";
import Link from "next/link";
import { Compass, CalendarCheck, ArrowRight } from "lucide-react";

export default function JourneyEmptyState() {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-orange-100/60 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-5">
        <Compass size={28} strokeWidth={2} />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
        Langkah Pertama
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 mb-3">
        Perjalanan Wellness-mu Baru Dimulai
      </h2>
      <p className="text-sm text-brown-700 leading-relaxed max-w-md mb-8">
        Halaman ini melacak perkembangan kesehatan mental, tingkat stres, dan kebiasaanmu dari waktu ke waktu. Lakukan beberapa Check-In Harian untuk mulai melihat tren dan insight nyata di sini.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Link
          href="/daily-assessment"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-brown-900 text-cream text-xs font-bold flex items-center justify-center gap-2 hover:bg-brown-900/90 active:scale-95 transition-all shadow-sm"
        >
          <CalendarCheck size={16} />
          <span>Mulai Check-In Harian</span>
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/activity"
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-brown-900/15 text-brown-900 text-xs font-bold hover:bg-cream active:scale-95 transition-all"
        >
          Lihat Aktivitas Hari Ini
        </Link>
      </div>
    </div>
  );
}
