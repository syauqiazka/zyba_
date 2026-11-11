"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Brain,
  HeartHandshake,
  BookOpen,
  Users,
  ShieldCheck,
  TrendingUp,
  Activity,
  CalendarCheck,
  Smile,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function LandingHero() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#EAEFEA]/70 via-[#F7F2E7] to-[#F7F2E7]">
      {/* Background Atmosphere: Subtle Ethereal Sky Aura */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-white/80 via-white/40 to-transparent rounded-b-[100px] pointer-events-none -z-10 blur-3xl opacity-80"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brown-900/10 text-brown-900 text-xs font-bold tracking-wide shadow-2xs mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Sanctuary Kebugaran Mental Gen Z</span>
          <span className="text-brown-700/30">|</span>
          <span className="text-brown-700/80 font-medium">100% Privat & Tanpa Jejak</span>
        </div>

        {/* Main Display Headline (Inspired by Reference Image 2) */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-brown-900 tracking-tight leading-[1.08] max-w-4xl">
          Kesehatan Mental Dirancang Ulang.
          <br />
          <span className="text-brown-700/90 font-medium italic block sm:inline">
            Sepenuhnya Privat & Anonim.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-brown-700 max-w-2xl leading-relaxed font-body">
          Dari langkah awal hingga pendampingan berkelanjutan, ZYBA menghadirkan ruang aman berbasis sains untuk merawat pikiran, tubuh, dan denyut jiwamu tanpa penghakiman.
        </p>

        {/* Central Primary CTA Pill */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/onboarding"
            className="group px-7 py-3.5 rounded-full bg-brown-900 hover:bg-orange-500 text-cream text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>Mulai Perjalanan</span>
            <div className="w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={13} className="text-cream" />
            </div>
          </Link>

          <Link
            href="/companion"
            className="px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-brown-900 border border-brown-900/15 text-sm font-bold shadow-2xs hover:border-orange-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={15} className="text-orange-500" />
            <span>Coba Tanya Zyba Gratis</span>
          </Link>
        </div>

        {/* =========================================================================
            STAGE: 4 FLOATING 3D PERSPECTIVE FEATURE CARDS
            Meniru komposisi Reference Image 2 dengan kurva perspektif lapang
        ========================================================================= */}
        <div className="mt-14 w-full relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full [perspective:1200px]">
            
            {/* ── CARD 1: Sesi Pendamping (Sage Green Perspective Card) ──────── */}
            <div
              onMouseEnter={() => setActiveCard(1)}
              onMouseLeave={() => setActiveCard(null)}
              className="group text-left p-6 rounded-[24px] bg-[#344638] text-cream border border-[#445B4A] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              style={{
                transform:
                  activeCard === 1
                    ? "scale(1.02) rotateY(0deg)"
                    : "rotateY(6deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-green-200/90 uppercase tracking-wider">
                    Sesi Pendamping
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <h3 className="font-display text-xl font-bold text-white leading-snug">
                  Tanya Zyba Siaga 24/7
                </h3>
                <p className="text-xs text-cream/80 mt-2 leading-relaxed font-body">
                  Dialog reflektif terarah untuk mengurai kecemasan dan menemukan langkah kecil hari ini.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-cream/70">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Activity size={14} className="text-green-400" />
                  Bebas Kuota 20k Token
                </span>
                <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">
                  Privat
                </span>
              </div>
            </div>

            {/* ── CARD 2: Rutinitas Jurnal Harian (Tactile Cream Card) ──────── */}
            <div
              onMouseEnter={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
              className="group text-left p-6 rounded-[24px] bg-white/95 text-brown-900 border border-brown-900/10 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              style={{
                transform:
                  activeCard === 2
                    ? "scale(1.02) rotateY(0deg)"
                    : "rotateY(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
                    Jurnal Reflektif
                  </span>
                  <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-brown-900">
                    <BookOpen size={14} />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-brown-900 leading-snug">
                  Ritme Catatan Harian
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold text-brown-900">
                    87
                  </span>
                  <span className="text-xs font-semibold text-brown-700/70">
                    refleksi /bulan
                  </span>
                </div>
              </div>

              {/* Mini Visual Metric Bar */}
              <div className="mt-6 pt-4 border-t border-brown-900/8">
                <div className="w-full h-2 bg-brown-900/8 rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div className="h-full bg-green-500 rounded-full w-2/5" />
                  <div className="h-full bg-orange-500 rounded-full w-1/4" />
                  <div className="h-full bg-brown-900 rounded-full w-1/3" />
                </div>
                <p className="text-[11px] text-brown-700/70 font-medium mt-2 flex items-center justify-between">
                  <span>Pola Ketenangan</span>
                  <span className="font-bold text-green-700">Stabil</span>
                </p>
              </div>
            </div>

            {/* ── CARD 3: Tumbuh Bersama Komunitas (Warm Support Circles) ─────── */}
            <div
              onMouseEnter={() => setActiveCard(3)}
              onMouseLeave={() => setActiveCard(null)}
              className="group text-left p-6 rounded-[24px] bg-white/95 text-brown-900 border border-brown-900/10 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              style={{
                transform:
                  activeCard === 3
                    ? "scale(1.02) rotateY(0deg)"
                    : "rotateY(-2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
                    Lingkaran Aman
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp size={11} />
                    +9.4k
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-brown-900 leading-snug">
                  Komunitas Hangat
                </h3>
                <p className="text-xs text-brown-700 mt-2 leading-relaxed">
                  Ruang berbagi rasa secara anonim. Kirim pelukan dan saling menguatkan tanpa rasa canggung.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brown-900/8 flex items-center justify-between text-xs">
                <span className="text-brown-700 font-semibold flex items-center gap-1.5">
                  <Heart size={14} className="text-orange-500 fill-orange-500" />
                  Kirim Pelukan
                </span>
                <span className="text-[11px] text-brown-700/70">
                  100% Pseudonim
                </span>
              </div>
            </div>

            {/* ── CARD 4: Pantau Ritme Mood (Tactile Mood Chart) ─────────────── */}
            <div
              onMouseEnter={() => setActiveCard(4)}
              onMouseLeave={() => setActiveCard(null)}
              className="group text-left p-6 rounded-[24px] bg-[#FAF7F2] text-brown-900 border border-brown-900/10 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              style={{
                transform:
                  activeCard === 4
                    ? "scale(1.02) rotateY(0deg)"
                    : "rotateY(-6deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brown-700/80 uppercase tracking-wider">
                    Ritme Mingguan
                  </span>
                  <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <CalendarCheck size={14} />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-brown-900 leading-snug">
                  Mood & Beban Batin
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold text-green-700">
                    78%
                  </span>
                  <span className="text-xs font-semibold text-brown-700/70">
                    stabil minggu ini
                  </span>
                </div>
              </div>

              {/* Minimal SVG Bar Chart */}
              <div className="mt-6 pt-4 border-t border-brown-900/8">
                <div className="flex items-end justify-between gap-1.5 h-7">
                  <div className="w-full bg-green-500/30 rounded-xs h-3" />
                  <div className="w-full bg-green-500/40 rounded-xs h-4" />
                  <div className="w-full bg-green-500/60 rounded-xs h-6" />
                  <div className="w-full bg-green-500/50 rounded-xs h-5" />
                  <div className="w-full bg-green-500 rounded-xs h-7" />
                  <div className="w-full bg-green-500/70 rounded-xs h-6" />
                  <div className="w-full bg-green-500/80 rounded-xs h-6" />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-brown-700/50 mt-1">
                  <span>SEN</span>
                  <span>RAB</span>
                  <span>JUM</span>
                  <span>MIN</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BOTTOM STRIP: REAL TRUST & IMPACT DATA (Matching Reference Image 2)
        ========================================================================= */}
        <div className="mt-14 w-full pt-10 border-t border-brown-900/10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          
          {/* Left: 99% Satisfaction & 5 Pillar Icons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 w-full md:w-auto">
            <div>
              <div className="font-display text-4xl sm:text-5xl font-black text-brown-900 tracking-tight">
                99%
              </div>
              <p className="text-xs sm:text-sm font-semibold text-brown-700 mt-1">
                Rasa Aman & Nyaman Pengguna
              </p>
            </div>

            {/* 5 Sanctuary Pillar Icons */}
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs"
                title="Pilar Pikiran"
              >
                <Brain size={16} />
              </div>
              <div
                className="w-9 h-9 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs"
                title="Pilar Emosi"
              >
                <Smile size={16} />
              </div>
              <div
                className="w-9 h-9 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs"
                title="Pilar Sosial"
              >
                <Users size={16} />
              </div>
              <div
                className="w-9 h-9 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs"
                title="Pilar Empati"
              >
                <HeartHandshake size={16} />
              </div>
              <div
                className="w-9 h-9 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-green-700 shadow-2xs"
                title="Privasi Terjamin"
              >
                <ShieldCheck size={16} />
              </div>
            </div>
          </div>

          {/* Right: 74.9M Indonesian Gen Z Market Reassurance */}
          <div className="flex items-center gap-4 w-full md:w-auto md:max-w-md">
            {/* Overlapping Avatar Stack */}
            <div className="flex -space-x-2 shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-mood-happy/30 text-brown-900 font-bold text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-mood-depressed/30 text-brown-900 font-bold text-xs flex items-center justify-center shadow-xs">
                M
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-mood-overjoyed/40 text-brown-900 font-bold text-xs flex items-center justify-center shadow-xs">
                R
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-black text-brown-900">
                  74.9 Juta+
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  Gen Z RI
                </span>
              </div>
              <p className="text-xs text-brown-700 mt-0.5 leading-relaxed font-body">
                Generasi muda Indonesia memiliki ruang kesehatan mental yang mendengar setiap cerita tanpa penghakiman.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
