"use client";

import React, { useState } from "react";
import Link from "next/link";

const SLIDES = [
  {
    title: "Welcome to ZYBA",
    subtitle: "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
    desc: "Alur terpadu dari Curhat → Solusi → Program → Aksi dalam satu aplikasi yang aman, privat, dan bebas dihakimi.",
    emoji: "🌱",
    tag: "Pengenalan ZYBA",
  },
  {
    title: "Personalize Your Mental Health State With AI",
    subtitle: "Analisis emosi cerdas dan penyesuaian gaya komunikasi AI yang fleksibel.",
    desc: "Zyba Companion siap mendengarkan cerita harianmu 24/7 dengan dukungan Multi-Model AI cerdas yang empatik.",
    emoji: "🤖",
    tag: "AI Companion",
  },
  {
    title: "Intelligent Mood Tracking & Emotion Insights",
    subtitle: "Catat suasana hati harianmu dan dapatkan grafik rekomendasi resiliensi.",
    desc: "Kenali pemicu emosional dan pantau perkembangan kestabilan pikiranmu dari hari ke hari dengan Zyba Score.",
    emoji: "📊",
    tag: "Mood Check-In",
  },
  {
    title: "Mindful Resources That Make You Happy",
    subtitle: "Koleksi artikel ilmu psikologi dan audio meditasi relaksasi 5 menit.",
    desc: "Akses tips mindfulness ilmiah, latihan pernapasan terpandu (breathing exercise), dan audio relaksasi tidur lelap.",
    emoji: "🎧",
    tag: "Wellness Resources",
  },
  {
    title: "Loving & Supportive Community",
    subtitle: "Ruang aman untuk berbagi cerita dan motivasi tanpa saling menghakimi.",
    desc: "Bergabung bersama ribuan sesama Gen Z, saling menguatkan, dan merayakan pencapaian self-care kecil setiap hari.",
    emoji: "💬",
    tag: "Zyba Community",
  },
];

export default function WelcomeTour() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-green-500 bg-green-100 px-3 py-1 rounded-full">
            Panduan &amp; Tur Aplikasi
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-brown-900 mt-2">
            Welcome to ZYBA Experience
          </h1>
          <p className="text-xs text-brown-700 mt-0.5">
            Jelajahi fitur utama dan cara ZYBA mendampingi perjalanan wellness harianmu.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-full bg-cream border border-brown-900/15 text-brown-900 text-xs font-bold hover:bg-white transition-colors shadow-xs"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Main Interactive Carousel Card */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-brown-900/10 shadow-lg flex flex-col items-center text-center gap-6 relative overflow-hidden">
        {/* Slide Tag & Step indicator */}
        <div className="flex items-center justify-between w-full pb-4 border-b border-brown-900/10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
            {slide.tag}
          </span>
          <span className="text-xs font-bold text-brown-700">
            Slide {currentSlide + 1} dari {SLIDES.length}
          </span>
        </div>

        {/* Big Emoji Illustration */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-cream border-2 border-brown-900/10 shadow-md flex items-center justify-center text-5xl md:text-6xl animate-bounce duration-1000 my-2">
          {slide.emoji}
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2 max-w-lg">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown-900 leading-snug">
            {slide.title}
          </h2>
          <p className="text-sm font-semibold text-orange-500">{slide.subtitle}</p>
          <p className="text-xs md:text-sm text-brown-700/80 leading-relaxed mt-1">
            {slide.desc}
          </p>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 my-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 bg-brown-900"
                  : "w-2.5 bg-brown-900/20 hover:bg-brown-900/40"
              }`}
              title={`Buka Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-4 w-full max-w-md pt-4 border-t border-brown-900/10">
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 py-3 rounded-full border border-brown-900/15 bg-cream/50 text-brown-900 text-xs font-bold hover:bg-cream transition-colors"
          >
            ← Sebelumnya
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors shadow-md"
          >
            {currentSlide === SLIDES.length - 1 ? "Ulangi Tur ↺" : "Lanjut Slide →"}
          </button>
        </div>

        {/* Shortcut Action ke Fitur */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/companion" className="text-xs font-bold text-orange-500 hover:underline">
            Curhat ke Zyba Companion →
          </Link>
          <span className="text-brown-700/40">•</span>
          <Link href="/daily-assessment" className="text-xs font-bold text-green-500 hover:underline">
            Catat Mood Hari Ini →
          </Link>
          <span className="text-brown-700/40">•</span>
          <Link href="/community" className="text-xs font-bold text-brown-900 hover:underline">
            Jelajahi Komunitas →
          </Link>
        </div>
      </div>
    </div>
  );
}
