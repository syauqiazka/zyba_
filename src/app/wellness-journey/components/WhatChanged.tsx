"use client";

import React from "react";
import { Sparkles, ArrowUp, ArrowDown, Check, Info } from "lucide-react";

export interface ChangeObservation {
  category: "Mood" | "Stres" | "Istirahat" | "Konsistensi";
  direction: "up" | "down" | "neutral";
  title: string;
  description: string;
  isPositive: boolean;
}

interface WhatChangedProps {
  observations: ChangeObservation[];
  hasEnoughData: boolean;
  timeRangeLabel: string;
}

export default function WhatChanged({
  observations,
  hasEnoughData,
  timeRangeLabel,
}: WhatChangedProps) {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-brown-900/5">
        <div>
          <h3 className="font-display text-base font-bold text-brown-900 tracking-tight flex items-center gap-2">
            <Sparkles size={18} className="text-orange-500" />
            <span>Yang Berubah (Observasi Data)</span>
          </h3>
          <p className="text-xs text-brown-700/70 mt-0.5">
            Perbandingan tren kondisimu antara {timeRangeLabel} terakhir dan {timeRangeLabel} sebelumnya.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-brown-700/60 self-start sm:self-auto">
          Catatan Observasional
        </span>
      </div>

      {!hasEnoughData ? (
        <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 bg-cream/35 rounded-2xl border border-dashed border-brown-900/10">
          <Info size={20} className="text-brown-700/50" />
          <p className="text-xs font-bold text-brown-900">
            Belum Cukup Data Perbandingan
          </p>
          <p className="text-xs text-brown-700/70 max-w-md">
            Lakukan beberapa Check-In Harian secara teratur agar ZYBA dapat merangkum observasi perubahan kondisi emosional dan fisikmu dari waktu ke waktu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {observations.map((obs, idx) => {
            const getIcon = () => {
              if (obs.direction === "up") {
                return (
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      obs.isPositive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <ArrowUp size={13} />
                  </span>
                );
              }
              if (obs.direction === "down") {
                return (
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      obs.isPositive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <ArrowDown size={13} />
                  </span>
                );
              }
              return (
                <span className="w-6 h-6 rounded-lg bg-cream text-brown-700 flex items-center justify-center shrink-0">
                  <Check size={13} />
                </span>
              );
            };

            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/5 flex items-start gap-3 hover:border-brown-900/15 transition-colors"
              >
                {getIcon()}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-brown-900 leading-tight">
                    {obs.title}
                  </span>
                  <p className="text-xs text-brown-700 leading-relaxed">
                    {obs.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
