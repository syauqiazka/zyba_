"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MetricScoreCardProps {
  score?: number | null;
  condition?: string;
  hasAssessment?: boolean;
}

export default function MetricScoreCard({
  score = null,
  condition = "Belum Dinilai",
  hasAssessment = false,
}: MetricScoreCardProps) {
  const isEvaluated = hasAssessment && score !== null && score !== undefined;
  const validScore = isEvaluated ? score : 0;
  const percentage = Math.min(Math.max(validScore, 0), 100) / 100;
  const strokeDashoffset = 377 * (1 - percentage);

  // Warna dinamis sesuai rentang skor
  const ringColor = !isEvaluated
    ? "#E4EED2"
    : validScore >= 80
    ? "#8FAE5D"
    : validScore >= 60
    ? "#F2884B"
    : "#A99BE0";

  const badgeClass = !isEvaluated
    ? "bg-cream border border-brown-900/15 text-brown-700"
    : validScore >= 80
    ? "bg-green-100 text-green-700 border border-green-500/20"
    : validScore >= 60
    ? "bg-orange-100 text-orange-700 border border-orange-500/20"
    : "bg-mood-depressed/20 text-mood-depressed border border-mood-depressed/30";

  return (
    <div className="rounded-[20px] bg-white/95 border border-brown-900/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-brown-700 uppercase tracking-widest">
          Skor Kesejahteraan
        </span>
        <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${badgeClass}`}>
          {isEvaluated ? condition : "Belum Dinilai"}
        </span>
      </div>

      <div className="my-5 flex items-center justify-center relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#F7F2E7"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke={ringColor}
            strokeWidth="10"
            strokeDasharray={377}
            strokeDashoffset={isEvaluated ? strokeDashoffset : 377}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl font-extrabold text-brown-900 tracking-tight">
            {isEvaluated ? score : "—"}
          </span>
          <span className="text-[10px] text-brown-700/80 font-bold uppercase tracking-wider mt-0.5">
            dari 100
          </span>
        </div>
      </div>

      {isEvaluated ? (
        <p className="text-xs text-brown-700 text-center leading-relaxed">
          Skor holistik dirawat melalui ritme harian dan istirahat yang cukup.
        </p>
      ) : (
        <div className="text-center flex flex-col items-center gap-3">
          <p className="text-xs text-brown-700 leading-relaxed">
            Mulai kenali ritme emosionalmu hari ini untuk memunculkan Skor Zyba personalmu.
          </p>
          <Link
            href="/mood-check-in"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-brown-900 hover:bg-orange-500 text-cream text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <span>Mulai Asesmen</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
