"use client";

import Link from "next/link";

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
    ? "#D8E3C6"
    : validScore >= 80
    ? "#8FAE5D"
    : validScore >= 60
    ? "#F2884B"
    : "#A99BE0";

  const badgeClass = !isEvaluated
    ? "bg-cream border border-brown-900/15 text-brown-700"
    : validScore >= 80
    ? "bg-green-100 text-green-500"
    : validScore >= 60
    ? "bg-orange-100 text-orange-500"
    : "bg-mood-depressed/20 text-mood-depressed";

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
          Zyba Score
        </span>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
          {isEvaluated ? condition : "Belum Dinilai"}
        </span>
      </div>

      <div className="my-6 flex items-center justify-center relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#F5EFE6"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke={ringColor}
            strokeWidth="12"
            strokeDasharray={377}
            strokeDashoffset={isEvaluated ? strokeDashoffset : 377}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl font-extrabold text-brown-900">
            {isEvaluated ? score : "--"}
          </span>
          <span className="text-[10px] text-brown-700 font-semibold uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      {isEvaluated ? (
        <p className="text-xs text-brown-700 text-center">
          Skor kesejahteraan mental dan fisik gabungan berdasarkan aktivitas harianmu.
        </p>
      ) : (
        <div className="text-center flex flex-col items-center gap-2">
          <p className="text-xs text-brown-700">
            Belum ada data evaluasi awal. Lengkapi asesmen untuk melihat Zyba Score personalmu.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-orange-500 hover:bg-brown-900 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <span>Mulai Asesmen</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
