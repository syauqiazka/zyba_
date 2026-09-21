"use client";

import Link from "next/link";

export default function QuickAccessCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Smart Activity Shortcut */}
      <div className="glass-card rounded-3xl p-6 flex items-center justify-between bg-gradient-to-r from-orange-100/40 to-cream border border-orange-500/20">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            Smart Activity Planner
          </span>
          <h3 className="font-display text-lg font-bold text-brown-900">
            Sesi Latihan Pernapasan 3 Menit
          </h3>
          <p className="text-xs text-brown-700 max-w-sm">
            Turunkan tingkat kortisol dan kembalikan fokus belajar/kerjamu.
          </p>
          <Link
            href="/activity"
            className="mt-2 inline-flex items-center gap-2 bg-brown-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors w-max"
          >
            Mulai Sesi →
          </Link>
        </div>
        <div className="text-5xl opacity-80">🫁</div>
      </div>

      {/* Resources Recommendation */}
      <div className="glass-card rounded-3xl p-6 flex items-center justify-between bg-gradient-to-r from-green-100/40 to-cream border border-green-500/20">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
            Rekomendasi Hari Ini
          </span>
          <h3 className="font-display text-lg font-bold text-brown-900">
            Mindfulness 101: Mengatasi Overthinking
          </h3>
          <p className="text-xs text-brown-700 max-w-sm">
            Audio panduan 5:55 menit untuk meredakan kecemasan akademik.
          </p>
          <Link
            href="/resources"
            className="mt-2 inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brown-900 transition-colors w-max"
          >
            Dengar Audio →
          </Link>
        </div>
        <div className="text-5xl opacity-80">🎧</div>
      </div>
    </section>
  );
}
