"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, Sparkles, ChevronRight, Info, CheckCircle2 } from "lucide-react";

interface TokenMeterBadgeProps {
  tokensUsed: number;
  tokensRemaining: number;
  tokenLimit: number;
  percentRemaining: number;
  percentUsed: number;
  plan: "FREE" | "PLUS";
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export default function TokenMeterBadge({
  tokensUsed,
  tokensRemaining,
  tokenLimit,
  percentRemaining,
  percentUsed,
  plan,
  onUpgradeClick,
  compact = false,
}: TokenMeterBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Color state based on remaining percent
  const isHealthy = percentRemaining > 40;
  const isWarning = percentRemaining > 15 && percentRemaining <= 40;
  const isCritical = percentRemaining <= 15;

  const badgeColorClass = isCritical
    ? "bg-danger/10 text-danger border-danger/25 hover:bg-danger/15"
    : isWarning
    ? "bg-orange-100 text-orange-700 border-orange-500/25 hover:bg-orange-200/60"
    : "bg-green-100/80 text-green-700 border-green-500/25 hover:bg-green-100";

  const progressColorClass = isCritical
    ? "bg-danger"
    : isWarning
    ? "bg-orange-500"
    : "bg-green-500";

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toLocaleString("id-ID");
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs select-none ${badgeColorClass}`}
        title="Klik untuk melihat rincian sisa kuota token hari ini"
        aria-expanded={isOpen}
      >
        <Sparkles size={12} className="shrink-0 animate-pulse" />
        <span>
          {compact
            ? `${percentRemaining}%`
            : `${percentRemaining}% Sisa (${formatNumber(tokensRemaining)} tok)`}
        </span>
      </button>

      {/* Floating Detailed Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 bg-white/95 backdrop-blur-xl border border-brown-900/10 rounded-2xl shadow-xl z-50 text-brown-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-brown-900/8">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-orange-500" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-brown-900">
                Sisa Kuota Token
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                plan === "PLUS"
                  ? "bg-orange-500 text-white"
                  : "bg-brown-900/8 text-brown-700"
              }`}
            >
              {plan === "PLUS" ? "Zyba Plus" : "Gratis"}
            </span>
          </div>

          {/* Progress Bar & Numerical Metrics */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-brown-900">
                {percentRemaining}%
                <span className="text-xs font-medium text-brown-700/60 ml-1.5 font-body">
                  tersisa hari ini
                </span>
              </span>
              <span className="text-xs font-bold text-brown-700">
                {formatNumber(tokensRemaining)} / {formatNumber(tokenLimit)}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-brown-900/8 rounded-full overflow-hidden p-0.5 border border-brown-900/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                style={{ width: `${Math.max(4, percentRemaining)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-brown-700/70 pt-0.5">
              <span>{tokensUsed.toLocaleString("id-ID")} terpakai</span>
              <span>Reset 00:00 WIB</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-cream/60 border border-brown-900/8 flex items-start gap-2 text-[11px] text-brown-700 leading-relaxed">
            <Info size={13} className="shrink-0 text-orange-500 mt-0.5" />
            <span>
              Token dihitung transparan dari panjang curhatmu dan jawaban pendamping. Kuota ini reset otomatis setiap malam.
            </span>
          </div>

          {/* Upgrade CTA if on Free Plan */}
          {plan === "FREE" && onUpgradeClick && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onUpgradeClick();
              }}
              className="mt-3.5 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <span>Upgrade 150.000 Token/Hari</span>
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

