"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartHandshake, PhoneCall, X, ExternalLink } from "lucide-react";

export interface CrisisBannerProps {
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function CrisisBanner({
  dismissible = false,
  onDismiss,
  className = "",
}: CrisisBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className={`rounded-[24px] bg-cream border-2 border-brown-900/20 p-5 sm:p-6 shadow-sm transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-100 border border-orange-500/20 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-brown-900 text-sm sm:text-base">
                Kamu tidak sendirian. Bantuan siaga untukmu.
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-500/20">
                24 Jam Bebas Pulsa
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-brown-700 mt-1 leading-relaxed max-w-2xl">
              Jika perasaanmu terasa terlalu berat atau memerlukan teman bicara profesional saat ini, hubungi Hotline Resmi Sejiwa 119 Ekstensi 8.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 justify-end">
          <Link
            href="/guidebook"
            className="text-xs font-semibold text-brown-700 hover:text-brown-900 underline underline-offset-4 py-2 px-3 transition-colors inline-flex items-center gap-1"
          >
            Direktori Lengkap
            <ExternalLink className="w-3 h-3" />
          </Link>

          <a
            href="tel:119,8"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold min-h-[44px] sm:min-h-[48px] shadow-xs transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Panggil 119 ext. 8</span>
          </a>

          {dismissible && (
            <button
              type="button"
              onClick={() => {
                setIsDismissed(true);
                onDismiss?.();
              }}
              aria-label="Tutup pemberitahuan bantuan"
              className="p-2 rounded-full hover:bg-brown-900/10 text-brown-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default CrisisBanner;

