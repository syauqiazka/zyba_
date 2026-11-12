"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface TactileMetricCardsProps {
  streak: number;
  conversationCount: number;
  hasAssessment: boolean;
}

/**
 * Ringkasan datar (tanpa kartu di dalam kartu).
 * Skor Zyba sengaja tidak diulang di sini — sudah ada di MetricScoreCard.
 * Tidak ada target "/30" atau "/10" yang dikarang: hanya angka nyata.
 */
export default function TactileMetricCards({
  streak,
  conversationCount,
  hasAssessment,
}: TactileMetricCardsProps) {
  const items = [
    {
      label: "Kehadiran",
      value: hasAssessment ? streak : 0,
      unit: "hari",
      hint: hasAssessment ? "Hadir berturut-turut" : "Mulai dari check-in pertama",
      href: "/mood-check-in",
    },
    {
      label: "Zyba Companion",
      value: conversationCount,
      unit: "percakapan",
      hint: conversationCount > 0 ? "Tersimpan privat" : "Belum ada percakapan",
      href: "/companion",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-brown-900/10 gap-y-4 w-full">
      {items.map((item, i) => (
        <Link
          key={item.label}
          href={item.href}
          className={`group flex flex-col gap-1 ${i === 0 ? "sm:pr-6" : "sm:pl-6"}`}
        >
          <span className="flex items-center justify-between text-[11px] font-semibold text-brown-700 uppercase tracking-wider">
            {item.label}
            <ArrowUpRight
              size={14}
              className="text-brown-700/50 group-hover:text-orange-500 transition-colors"
              aria-hidden
            />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-extrabold text-brown-900 tracking-tight">
              {item.value.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-medium text-brown-700">{item.unit}</span>
          </span>
          <span className="text-xs text-brown-700/80">{item.hint}</span>
        </Link>
      ))}
    </div>
  );
}
