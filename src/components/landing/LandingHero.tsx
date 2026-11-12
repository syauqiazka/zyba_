"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Brain,
  MessageCircle,
  Activity,
  Heart,
  BookOpen,
} from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative w-full pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cream">
      {/* Subtle organic background tint */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto">
        {/* Asymmetric Editorial Hero Grid (60% Content : 40% Visual Anchor) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Context Badge (No decorative dots/sparkles) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brown-900/10 text-brown-900 text-xs font-semibold shadow-2xs mb-6">
              <span className="text-green-700 font-bold uppercase tracking-wider text-[11px]">Ruang Refleksi</span>
              <span className="text-brown-700/30">/</span>
              <span className="text-brown-700">Gen Z Mental Wellness</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-brown-900 tracking-tight leading-[1.08] max-w-2xl">
              Kesehatan mental dirancang ulang dengan sentuhan{" "}
              <span className="font-medium italic text-brown-700">manusiawi.</span>
            </h1>

            {/* Narrative Body Text */}
            <p className="mt-6 text-base sm:text-lg text-brown-700 leading-relaxed font-body max-w-xl">
              Sebuah ruang hening untuk mengurai kecemasan, mencatat ritme suasana hati harian, dan menemukan langkah kecil menuju ketenangan tanpa penghakiman.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="group px-7 py-3.5 rounded-full bg-brown-900 hover:bg-orange-500 text-cream text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Perjalanan</span>
                <ArrowUpRight size={15} className="text-cream transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/login"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-cream text-brown-900 border border-brown-900/15 text-sm font-bold shadow-2xs hover:border-brown-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Akun</span>
              </Link>
            </div>

            {/* Honest Reassuring Note */}
            <div className="mt-10 flex items-center gap-2 text-xs font-medium text-brown-700/80">
              <ShieldCheck size={16} className="text-green-600 shrink-0" />
              <span>Privat, aman, dan mendampingi tanpa menggantikan diagnosis klinis.</span>
            </div>
          </div>

          {/* Right Column: Tactile Sanctuary Preview Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[28px] bg-[#344638] text-cream p-7 sm:p-8 shadow-xl border border-[#445B4A] overflow-hidden flex flex-col gap-6">
              
              {/* Top Sanctuary Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
                <span className="font-display font-semibold tracking-wide text-cream/90 uppercase text-[11px]">
                  Sanctuary Preview
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cream border border-white/15">
                  Tenang &amp; Hening
                </span>
              </div>

              {/* Sanctuary Inner Card: Daily Check-in Pebble Preview */}
              <div className="bg-[#FAF7F2] text-brown-900 rounded-[20px] p-5 border border-brown-900/10 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brown-700/70 uppercase tracking-wider">
                    Ritual Hari Ini
                  </span>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Langkah Awal
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-brown-900">
                  Bagaimana batinmu bernapas pagi ini?
                </h2>
                <p className="text-xs text-brown-700 leading-relaxed font-body">
                  Pilih suasana hatimu, uraikan beban pikiran, dan biarkan Zyba Companion mendengarkan dengan penuh empati.
                </p>
                
                {/* 5 Mood Indicator Rings (Tactile Organic Representation) */}
                <div className="pt-2 flex items-center justify-between border-t border-brown-900/5">
                  <div className="w-8 h-8 rounded-full bg-[#A99BE0]/20 border border-[#A99BE0] flex items-center justify-center text-[10px] font-bold text-brown-900">1</div>
                  <div className="w-8 h-8 rounded-full bg-[#EE8A5E]/20 border border-[#EE8A5E] flex items-center justify-center text-[10px] font-bold text-brown-900">2</div>
                  <div className="w-8 h-8 rounded-full bg-[#6B5645]/20 border border-[#6B5645] flex items-center justify-center text-[10px] font-bold text-brown-900">3</div>
                  <div className="w-8 h-8 rounded-full bg-[#E8C24A]/30 border border-[#E8C24A] flex items-center justify-center text-[10px] font-bold text-brown-900">4</div>
                  <div className="w-8 h-8 rounded-full bg-[#8FAE5D]/30 border border-[#8FAE5D] flex items-center justify-center text-[10px] font-bold text-brown-900">5</div>
                </div>
              </div>

              {/* 3 Core Experience Pillars (Structured, No Icon-in-a-Box Syndrome) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <MessageCircle size={17} className="text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white">Zyba Companion</h3>
                    <p className="text-cream/70 text-[11px] mt-0.5">Ruang curhat bebas penghakiman siaga mendampingi harimu.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Activity size={17} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white">Smart Activity &amp; Pacer</h3>
                    <p className="text-cream/70 text-[11px] mt-0.5">Latihan napas 4-7-8 dan perencana langkah relaksasi kecil.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Heart size={17} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white">Komunitas Hangat</h3>
                    <p className="text-cream/70 text-[11px] mt-0.5">Saling kirim pelukan dan bertukar cerita secara anonim.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Supporting Editorial Ribbon: 3 Clean Value Propositions */}
        <div className="mt-16 pt-10 border-t border-brown-900/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display text-base font-bold text-brown-900">Pendekatan Berbasis Sains</h4>
            <p className="text-xs text-brown-700 mt-2 leading-relaxed">
              Memadukan Cognitive Behavioral Therapy (CBT) dan mindfulness untuk membantu merefleksikan emosi secara mandiri.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-brown-900">Kontrol Privasi Pengguna</h4>
            <p className="text-xs text-brown-700 mt-2 leading-relaxed">
              Catatan jurnal dan riwayat refleksi berada di bawah kendalimu, didesain untuk rasa aman dalam berekspresi.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-brown-900">Tanpa Tekanan Produktivitas</h4>
            <p className="text-xs text-brown-700 mt-2 leading-relaxed">
              Tidak ada angka streak yang memicu cemas. Ruang ini ada untuk menemani prosesmu, bukan mengukur prestasimu.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
