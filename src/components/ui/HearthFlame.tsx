import React from "react";
import { Flame } from "lucide-react";

export type HearthFlameState = "idle" | "glowing" | "dimmed";

export interface HearthFlameProps {
  daysCount?: number;
  state?: HearthFlameState;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function HearthFlame({
  daysCount = 1,
  state = "glowing",
  size = "md",
  showLabel = true,
  label = "Nyala Konsistensi",
  className = "",
}: HearthFlameProps) {
  const sizeStyles = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const stateStyles: Record<HearthFlameState, { bg: string; iconColor: string; border: string }> = {
    glowing: {
      bg: "bg-orange-100",
      iconColor: "text-orange-500",
      border: "border-orange-500/25",
    },
    idle: {
      bg: "bg-amber-50",
      iconColor: "text-amber-700",
      border: "border-brown-900/10",
    },
    dimmed: {
      bg: "bg-brown-900/5",
      iconColor: "text-brown-700/60",
      border: "border-brown-900/10",
    },
  };

  const current = stateStyles[state];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeStyles[size]} rounded-full ${current.bg} border ${current.border} flex items-center justify-center shrink-0 shadow-xs transition-colors`}
        title={`${label}: ${daysCount} hari berturut-turut`}
        aria-label={`${label}: ${daysCount} hari berturut-turut`}
      >
        <Flame className={`${iconSizes[size]} ${current.iconColor}`} strokeWidth={2} />
      </div>

      {showLabel && (
        <div className="flex flex-col text-left leading-tight">
          <span className="font-display font-bold text-brown-900 text-xs sm:text-sm">
            {daysCount} {daysCount === 1 ? "Hari" : "Hari"}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-brown-700">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default HearthFlame;

