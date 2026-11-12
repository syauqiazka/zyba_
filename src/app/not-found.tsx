import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, HeartHandshake } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12 text-brown-900 select-none">
      <div className="w-full max-w-lg rounded-[28px] bg-white/95 border border-brown-900/10 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
        {/* Serene Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100/70 border border-orange-500/20 flex items-center justify-center text-orange-600 mb-6 shadow-xs">
          <Compass className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.8} />
        </div>

        {/* Small badge */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-brown-700/70 mb-2">
          404 · Ruang Tidak Ditemukan
        </span>

        {/* Heading */}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight mb-3">
          Jalan ini sedang hening sejenak
        </h1>

        {/* Description */}
        <p className="font-body text-xs sm:text-sm text-brown-700 max-w-sm mb-8 leading-relaxed">
          Halaman yang kamu cari mungkin telah dipindahkan, berganti nama, atau belum pernah tersedia di sanctuary ZYBA. Tarik napas perlahan dan mari kembali bersama.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brown-900 hover:bg-brown-900/90 text-cream px-7 py-3 text-sm font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <Link
            href="/guidebook"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-cream border border-brown-900/15 text-brown-900 px-6 py-3 text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <HeartHandshake className="w-4 h-4 text-orange-500" />
            <span>Direktori Bantuan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
