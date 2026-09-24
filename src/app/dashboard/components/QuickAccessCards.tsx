"use client";

import Link from "next/link";

export default function QuickAccessCards() {
  return (
    <section className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h2 className="font-display text-base font-bold text-brown-900 whitespace-nowrap">
          Akses Cepat
        </h2>
        <div className="h-px flex-1 bg-brown-900/10" />
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* ==================== ASSESSMENT ==================== */}
        <div
          className="
            group
            glass-card
            rounded-3xl
            p-5
            flex
            flex-col
            min-h-[215px]
            border
            border-orange-500/15
            bg-gradient-to-br
            from-white
            via-cream/80
            to-orange-50/50
            hover:shadow-md
            hover:-translate-y-0.5
            transition-all
            duration-200
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-4.5 h-4.5 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5a3 3 0 0 0 6 0"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 13 2 2 4-4"
                  />
                </svg>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
                Assessment Harian
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4">
            <h3 className="font-display text-[17px] font-bold text-brown-900">
              Check-in Asesmen
            </h3>

            <p className="text-xs leading-relaxed text-brown-700 mt-1.5 max-w-md">
              Evaluasi kesehatan mental lengkap harian &amp; perbarui Zyba
              Score kamu.
            </p>
          </div>

          {/* Action */}
          <div className="mt-auto pt-4">
            <Link
              href="/daily-assessment"
              className="
                inline-flex
                items-center
                gap-1.5
                bg-orange-500
                hover:bg-brown-900
                text-white
                px-4
                py-2.5
                rounded-full
                text-xs
                font-bold
                transition-colors
                shadow-sm
              "
            >
              Mulai Asesmen
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ==================== ACTIVITY ==================== */}
        <div
          className="
            group
            glass-card
            rounded-3xl
            p-5
            flex
            flex-col
            min-h-[215px]
            border
            border-orange-500/15
            bg-gradient-to-br
            from-orange-50/70
            via-cream/70
            to-white
            hover:shadow-md
            hover:-translate-y-0.5
            transition-all
            duration-200
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Smart Activity Planner
            </span>

            <span className="text-4xl leading-none opacity-80 shrink-0">
              🫁
            </span>
          </div>

          {/* Content */}
          <div className="mt-3">
            <h3 className="font-display text-[17px] font-bold text-brown-900 leading-snug">
              Sesi Latihan Pernapasan 3 Menit
            </h3>

            <p className="text-xs leading-relaxed text-brown-700 mt-1.5">
              Turunkan tingkat kortisol dan kembalikan fokus belajar/kerjamu.
            </p>
          </div>

          {/* Action */}
          <div className="mt-auto pt-4">
            <Link
              href="/activity"
              className="
                inline-flex
                items-center
                gap-1.5
                bg-brown-900
                hover:bg-orange-500
                text-white
                px-4
                py-2.5
                rounded-full
                text-xs
                font-bold
                transition-colors
                shadow-sm
              "
            >
              Mulai Sesi
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ==================== RESOURCES ==================== */}
        <div
          className="
            group
            glass-card
            rounded-3xl
            p-5
            flex
            flex-col
            min-h-[215px]
            border
            border-green-500/15
            bg-gradient-to-br
            from-green-50/70
            via-cream/70
            to-white
            hover:shadow-md
            hover:-translate-y-0.5
            transition-all
            duration-200
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-600">
              Rekomendasi Hari Ini
            </span>

            <span className="text-4xl leading-none opacity-75 shrink-0">
              🎧
            </span>
          </div>

          {/* Content */}
          <div className="mt-3">
            <h3 className="font-display text-[17px] font-bold text-brown-900 leading-snug">
              Mindfulness 101: Mengatasi Overthinking
            </h3>

            <p className="text-xs leading-relaxed text-brown-700 mt-1.5">
              Audio panduan 5:55 menit untuk meredakan kecemasan akademik.
            </p>
          </div>

          {/* Action */}
          <div className="mt-auto pt-4">
            <Link
              href="/resources"
              className="
                inline-flex
                items-center
                gap-1.5
                bg-green-600
                hover:bg-brown-900
                text-white
                px-4
                py-2.5
                rounded-full
                text-xs
                font-bold
                transition-colors
                shadow-sm
              "
            >
              Dengar Audio
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}