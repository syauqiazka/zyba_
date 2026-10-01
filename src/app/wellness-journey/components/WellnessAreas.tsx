"use client";

import React from "react";
import { ShieldCheck, Heart, Sparkles, Feather, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface WellnessDomain {
  id: string;
  name: string;
  score: number | null; // 0 - 100
  previousScore: number | null;
  description: string;
  icon: React.ElementType;
  barColor: string;
}

interface WellnessAreasProps {
  domains: WellnessDomain[];
  timeRangeLabel: string;
}

export default function WellnessAreas({ domains, timeRangeLabel }: WellnessAreasProps) {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-brown-900/5">
        <div>
          <h3 className="font-display text-base font-bold text-brown-900 tracking-tight flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-600" />
            <span>Pilar Evaluasi Wellness (Mental Reset 360)</span>
          </h3>
          <p className="text-xs text-brown-700/70 mt-0.5">
            Evaluasi domain wellness berdasarkan data check-in nyata yang kamu catat.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-brown-700/60 self-start sm:self-auto">
          Dihitung dari data riil
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((domain) => {
          const Icon = domain.icon;
          const hasScore = domain.score !== null && domain.score !== undefined;
          const scoreVal = hasScore ? Math.round(domain.score!) : null;

          // Calculate real diff
          let diff: number | null = null;
          if (hasScore && domain.previousScore !== null && domain.previousScore !== undefined) {
            diff = Math.round(domain.score! - domain.previousScore);
          }

          return (
            <div
              key={domain.id}
              className="p-4 rounded-2xl bg-cream/35 border border-brown-900/5 flex flex-col justify-between gap-3 hover:border-brown-900/15 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brown-900 leading-tight">
                      {domain.name}
                    </h4>
                    <span className="text-[10px] text-brown-700/70">
                      {domain.description}
                    </span>
                  </div>
                </div>

                {hasScore ? (
                  <div className="text-right shrink-0">
                    <span className="font-display text-base font-extrabold text-brown-900">
                      {scoreVal}
                    </span>
                    <span className="text-[10px] text-brown-700/60 font-semibold">/100</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-brown-700/50 italic shrink-0">
                    Belum ada data
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-cream overflow-hidden border border-brown-900/5">
                <div
                  className={`h-full ${domain.barColor} transition-all duration-700 rounded-full`}
                  style={{ width: `${hasScore ? Math.min(100, Math.max(5, scoreVal!)) : 0}%` }}
                />
              </div>

              {/* Footer Delta */}
              <div className="flex items-center justify-between text-[11px] text-brown-700/70 pt-0.5">
                <span>Perubahan vs {timeRangeLabel} lalu:</span>
                {diff !== null ? (
                  diff === 0 ? (
                    <span className="inline-flex items-center gap-0.5 font-bold text-brown-700">
                      <Minus size={11} /> Stabil
                    </span>
                  ) : diff > 0 ? (
                    <span className="inline-flex items-center gap-0.5 font-bold text-green-700">
                      <ArrowUpRight size={11} /> +{diff}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 font-bold text-orange-700">
                      <ArrowDownRight size={11} /> {diff}%
                    </span>
                  )
                ) : (
                  <span className="text-brown-700/50 italic">Periode awal</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
