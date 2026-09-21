"use client";

import React, { useState } from "react";
import Link from "next/link";

const SHOWCASE_SLIDES = [
  {
    title: "Pendamping Kesehatan Mental Berbasis AI",
    subtitle: "Curhat bebas kapan saja tanpa rasa takut dihakimi dengan Zyba Companion yang siap mendengarkan 24/7.",
    tag: "AI Companion",
    color: "from-orange-100 to-[#FCE3D3]",
    icon: "🌱",
    badge: "24/7 Support",
  },
  {
    title: "Personalized Wellness & Mood Tracking",
    subtitle: "Pantau suasana hati, pola tidur, dan progres mindfulness harianmu dengan visualisasi analitik cerdas.",
    tag: "Mood Check-In",
    color: "from-green-100 to-[#E4EED2]",
    icon: "📊",
    badge: "Data Privacy",
  },
  {
    title: "Komunitas Suportif & Aman Sesama Gen Z",
    subtitle: "Saling berbagi afirmasi positif, cerita resiliensi, dan tips self-care dalam ruang komunitas hangat.",
    tag: "Zyba Community",
    color: "from-amber-100 to-orange-100",
    icon: "🤝",
    badge: "Ruang Aman",
  },
];

export default function DesktopShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-gradient-to-br from-cream via-white to-[#E8F0DC]/40 rounded-3xl p-10 border border-brown-900/10 relative overflow-hidden shadow-sm">
      {/* Ornamen Latar Belakang Organik */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#E2EBD2]/50 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-2xl bg-white shadow-sm border border-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="w-2.5 h-2.5 rounded-full bg-brown-900 z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl text-brown-900 tracking-tight">
              ZYBA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 -mt-1">
              Gen Z Wellness
            </span>
          </div>
        </Link>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 border border-brown-900/10 text-brown-900 shadow-xs">
          Desktop Experience 💻
        </span>
      </div>

      {/* Main Feature Showcase Interactive Card */}
      <div className="relative z-10 my-auto flex flex-col gap-6 py-6">
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-brown-900/10 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-100 px-3 py-0.5 rounded-full">
              {SHOWCASE_SLIDES[activeSlide].tag}
            </span>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              {SHOWCASE_SLIDES[activeSlide].badge}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cream border border-brown-900/10 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {SHOWCASE_SLIDES[activeSlide].icon}
            </div>
            <div className="flex flex-col">
              <h3 className="font-display font-extrabold text-xl text-brown-900 leading-snug">
                {SHOWCASE_SLIDES[activeSlide].title}
              </h3>
              <p className="text-xs text-brown-700/80 mt-1 leading-relaxed">
                {SHOWCASE_SLIDES[activeSlide].subtitle}
              </p>
            </div>
          </div>

          {/* Mini Interactive Preview Element */}
          <div className="mt-2 p-3.5 rounded-2xl bg-cream/50 border border-brown-900/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                80
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brown-900">Zyba Wellness Index</span>
                <span className="text-[10px] text-brown-700">Status: Mentally Stable & Calm</span>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-500">
              Optimal ✨
            </span>
          </div>
        </div>

        {/* Carousel Indicators & Switcher */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {SHOWCASE_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-8 bg-brown-900" : "w-2 bg-brown-900/20 hover:bg-brown-900/40"
                }`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length)}
            className="text-xs font-bold text-brown-700 hover:text-orange-500 transition-colors flex items-center gap-1"
          >
            <span>Selanjutnya</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Footer Quote / Trust Indicator */}
      <div className="relative z-10 pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs text-brown-700">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[10px]">🦊</span>
            <span className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px]">🐼</span>
            <span className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[10px]">🦁</span>
          </div>
          <span className="text-[11px] font-semibold text-brown-900">
            10.000+ Gen Z terbantu setiap hari
          </span>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-brown-700/80 hover:text-brown-900 transition-colors"
        >
          Pelajari Lebih Lanjut ↗
        </Link>
      </div>
    </div>
  );
}
