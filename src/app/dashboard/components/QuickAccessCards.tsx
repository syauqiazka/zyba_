"use client";

import Link from "next/link";

export default function QuickAccessCards() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <h2 className="font-display text-base font-bold text-brown-900">Akses Cepat</h2>
        <div className="flex-1 h-px bg-brown-900/10" />
      </div>

      {/* Row 1: Assessment shortcuts (3 cards berbeda) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assessment (onboarding baseline) */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-brown-900/10 bg-gradient-to-br from-white to-cream hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              {/* ClipboardCheck icon */}
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Assessment</span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900">Lengkapi Assessment</h3>
            <p className="text-xs text-brown-700 mt-0.5">Profil kesehatan dasar & Zyba Score kamu.</p>
          </div>
          <Link
            href="/assessment"
            className="mt-auto inline-flex items-center gap-1.5 bg-orange-500 hover:bg-brown-900 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors w-max"
          >
            Buka Assessment →
          </Link>
        </div>

        {/* Mood Check-In Harian (D.3: was /daily-assessment, now /mood-check-in per Bagian 8.5.1) */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-brown-900/10 bg-gradient-to-br from-white to-green-100/20 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              {/* CalendarCheck2 icon */}
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l2 2 4-4" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Check-In Harian</span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900">Mood Check-In hari ini</h3>
            <p className="text-xs text-brown-700 mt-0.5">Mood, stres, tidur, energi &amp; refleksi harian.</p>
          </div>
          <Link
            href="/mood-check-in"
            className="mt-auto inline-flex items-center gap-1.5 bg-green-500 hover:bg-brown-900 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors w-max"
          >
            Mulai Check-In →
          </Link>
        </div>

        {/* Mood Check-In cepat */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-brown-900/10 bg-gradient-to-br from-white to-orange-50/30 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 flex items-center justify-center shrink-0">
              {/* Smile icon */}
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Mood Check-In</span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900">Check-in mood</h3>
            <p className="text-xs text-brown-700 mt-0.5">Catat perasaanmu sekarang. Cepat & ringan.</p>
          </div>
          <Link
            href="/mood-check-in"
            className="mt-auto inline-flex items-center gap-1.5 bg-brown-900 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors w-max"
          >
            Check-in Sekarang →
          </Link>
        </div>
      </div>

      {/* Row 2: Feature shortcuts (existing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
