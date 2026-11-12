"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";

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

  const colorTone: "vital" | "warm" | "neutral" = !isEvaluated
    ? "neutral"
    : validScore >= 75
    ? "vital"
    : "warm";

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
        <ProgressRing
          value={validScore}
          size={144}
          strokeWidth={10}
          colorTone={colorTone}
          label="Skor Kesejahteraan"
          sublabel="dari 100"
        />
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream hover:bg-brown-900 hover:text-white border border-brown-900/15 text-xs font-semibold text-brown-900 transition-all duration-200 cursor-pointer shadow-2xs group"
          >
            <span>Mulai Asesmen Pertama</span>
            <ArrowRight size={13} className="text-orange-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      )}
    </div>
  );
}
