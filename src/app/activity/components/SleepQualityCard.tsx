"use client";

import React from "react";
import { Moon, Lightbulb } from "lucide-react";

export default function SleepQualityCard() {
  return (
    <div className="lg:col-span-5 glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-brown-900/10 flex flex-col justify-between bg-gradient-to-b from-white to-cream/40 shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider flex items-center gap-1.5">
            <Moon size={14} className="text-indigo-600" />
            Kualitas Tidur & Istirahat
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
            Perlu Ditingkatkan
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="font-display text-5xl font-extrabold text-brown-900">5.2h</span>
          <span className="text-xs text-brown-700 font-semibold">Total Durasi Tidur</span>
        </div>

        <div className="text-xs text-brown-700 leading-relaxed mt-2 bg-cream/70 p-4 rounded-2xl border border-brown-900/10 flex items-start gap-2.5">
          <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-brown-900">Insight Zyba:</strong> Kamu terbangun 2 kali tadi malam. Cobalah batasi kafein setelah jam 4 sore dan lakukan latihan pernapasan relaksasi sebelum tidur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-brown-900/10 text-center">
        <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
          <span className="text-[10px] text-brown-700 font-bold uppercase block">Tidur Lelap</span>
          <span className="font-display text-lg font-bold text-brown-900">1h 15m</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
          <span className="text-[10px] text-brown-700 font-bold uppercase block">Efisiensi Tidur</span>
          <span className="font-display text-lg font-bold text-green-600">72%</span>
        </div>
      </div>
    </div>
  );
}

