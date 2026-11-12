import React from "react";

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // diameter in px (default: 88)
  strokeWidth?: number; // default: 8
  colorTone?: "vital" | "warm" | "neutral";
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 88,
  strokeWidth = 8,
  colorTone = "vital",
  label,
  sublabel,
  className = "",
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const toneColors = {
    vital: "#8FAE5D", // Vital Green
    warm: "#F2884B", // Warm Orange
    neutral: "#5A4636", // Brown 700
  };

  const strokeColor = toneColors[colorTone];

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${clampedValue}%` : `Skor: ${clampedValue}%`}
      className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(59, 42, 32, 0.10)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Value Stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-extrabold text-brown-900 leading-none" style={{ fontSize: size * 0.28 }}>
          {clampedValue}
        </span>
        {sublabel && (
          <span className="text-[10px] font-semibold text-brown-700 uppercase tracking-wider mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressRing;

