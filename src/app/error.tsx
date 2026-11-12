"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, ArrowLeft, HeartHandshake } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely without exposing raw technical stacks to UI
    console.error("[ZYBA Sanctuary Error Boundary]:", error?.message || error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12 text-brown-900 select-none">
      <div className="w-full max-w-lg rounded-[28px] bg-white/95 border border-brown-900/10 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
        {/* Serene Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100/70 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-6 shadow-xs">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.8} />
        </div>

        {/* Small badge */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-brown-700/70 mb-2">
          Terjadi Kendala Sejenak
        </span>

        {/* Heading */}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight mb-3">
          Ruang ini sedang merapikan diri
        </h1>

        {/* Description */}
        <p className="font-body text-xs sm:text-sm text-brown-700 max-w-sm mb-8 leading-relaxed">
          Sistem kami mengalami interupsi singkat. Datamu tetap aman dan tersimpan rapi. Silakan coba muat ulang halaman ini atau kembali ke sanctuary utama.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brown-900 hover:bg-brown-900/90 text-cream px-7 py-3 text-sm font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-cream border border-brown-900/15 text-brown-900 px-6 py-3 text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Dashboard</span>
          </Link>
        </div>

        {/* Crisis fallback link */}
        <div className="mt-8 pt-6 border-t border-brown-900/10 w-full flex items-center justify-center">
          <Link
            href="/guidebook"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-orange-500" />
            <span>Membutuhkan bantuan darurat? Buka Panduan Krisis Sejiwa 119</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

