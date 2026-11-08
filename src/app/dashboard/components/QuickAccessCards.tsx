"use client";

import Link from "next/link";
import { Wind, Headphones, HeartHandshake, ArrowRight } from "lucide-react";

export default function QuickAccessCards() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-brown-900">
          Akses Ruang Pendukung
        </h3>
        <span className="text-[11px] text-brown-700/70">Pilihan cepat</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Latihan Pernapasan */}
        <div className="rounded-2xl p-4 bg-white/95 border border-brown-900/10 shadow-xs flex items-center justify-between hover:border-orange-500/30 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brown-900 group-hover:text-orange-500 transition-colors">
                Latihan Napas 3 Menit
              </h4>
              <p className="text-[11px] text-brown-700/80">
                Meredakan ketegangan fisik & memusatkan pikiran.
              </p>
            </div>
          </div>
          <Link
            href="/activity"
            className="w-7 h-7 rounded-full bg-cream hover:bg-brown-900 hover:text-white flex items-center justify-center text-brown-900 shrink-0 transition-colors"
            title="Buka Planner"
          >
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Audio Relaksasi */}
        <div className="rounded-2xl p-4 bg-white/95 border border-brown-900/10 shadow-xs flex items-center justify-between hover:border-green-500/30 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brown-900 group-hover:text-green-700 transition-colors">
                Mindfulness & Audio Hening
              </h4>
              <p className="text-[11px] text-brown-700/80">
                Panduan suara tenang untuk rehat dari overthinking.
              </p>
            </div>
          </div>
          <Link
            href="/resources"
            className="w-7 h-7 rounded-full bg-cream hover:bg-green-700 hover:text-white flex items-center justify-center text-brown-900 shrink-0 transition-colors"
            title="Dengarkan Audio"
          >
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Akses Bantuan Krisis Cepat */}
        <div className="rounded-2xl p-4 bg-cream border border-brown-900/15 shadow-2xs flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-brown-900/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-brown-900">
                  Layanan Bantuan 24/7
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-brown-700 border border-brown-900/10">
                  Resmi
                </span>
              </div>
              <p className="text-[11px] text-brown-700/80">
                Hotline Sejiwa Kemenkes 119 ext. 8 (Bebas Pulsa).
              </p>
            </div>
          </div>
          <a
            href="tel:119,8"
            className="px-2.5 py-1 rounded-full bg-white hover:bg-brown-900 hover:text-white border border-brown-900/15 text-[11px] font-semibold text-brown-900 transition-colors shrink-0"
          >
            Hubungi
          </a>
        </div>
      </div>
    </section>
  );
}
