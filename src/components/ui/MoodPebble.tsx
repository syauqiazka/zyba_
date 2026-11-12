"use client";

import React from "react";
import { CloudRain, Frown, Meh, Smile, Sparkles, LucideIcon } from "lucide-react";

export type MoodValue = "DEPRESSED" | "SAD" | "NEUTRAL" | "HAPPY" | "OVERJOYED";

export interface MoodConfig {
  value: MoodValue;
  score: number;
  label: string;
  sublabel: string;
  colorHex: string;
  bgClass: string;
  icon: LucideIcon;
}

export const CANONICAL_MOODS: MoodConfig[] = [
  {
    value: "DEPRESSED",
    score: 1,
    label: "Sangat Terpuruk",
    sublabel: "Butuh Ruang & Bantuan",
    colorHex: "#A99BE0",
    bgClass: "bg-mood-depressed",
    icon: CloudRain,
  },
  {
    value: "SAD",
    score: 2,
    label: "Sedih / Cemas",
    sublabel: "Hati Terasa Berat",
    colorHex: "#EE8A5E",
    bgClass: "bg-mood-sad",
    icon: Frown,
  },
  {
    value: "NEUTRAL",
    score: 3,
    label: "Biasa Saja",
    sublabel: "Stabil & Mengalir",
    colorHex: "#6B5645",
    bgClass: "bg-mood-neutral",
    icon: Meh,
  },
  {
    value: "HAPPY",
    score: 4,
    label: "Tenang / Senang",
    sublabel: "Rasa Syukur Hadir",
    colorHex: "#E8C24A",
    bgClass: "bg-mood-happy",
    icon: Smile,
  },
  {
    value: "OVERJOYED",
    score: 5,
    label: "Penuh Energi",
    sublabel: "Bahagia & Bersinar",
    colorHex: "#8FAE5D",
    bgClass: "bg-mood-overjoyed",
    icon: Sparkles,
  },
];

export interface MoodPebbleProps {
  mood: MoodConfig;
  isSelected?: boolean;
  onSelect?: (value: MoodValue) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showLabel?: boolean;
}

export function MoodPebble({
  mood,
  isSelected = false,
  onSelect,
  size = "md",
  disabled = false,
  showLabel = true,
}: MoodPebbleProps) {
  const Icon = mood.icon;

  const sizeStyles = {
    sm: "w-10 h-10 min-w-[40px] min-h-[40px]",
    md: "w-12 h-12 min-w-[48px] min-h-[48px]",
    lg: "w-14 h-14 min-w-[56px] min-h-[56px]",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${mood.label}: ${mood.sublabel}`}
      disabled={disabled}
      onClick={() => onSelect?.(mood.value)}
      className={`group flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div
        className={`${sizeStyles[size]} rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs border ${
          isSelected
            ? `${mood.bgClass} text-white ring-2 ring-brown-900 ring-offset-2 ring-offset-cream scale-105 border-transparent`
            : "bg-white/90 text-brown-700 hover:bg-white hover:text-brown-900 border-brown-900/10 hover:border-brown-900/25"
        } group-focus-visible:ring-2 group-focus-visible:ring-orange-500/60 group-focus-visible:ring-offset-2`}
      >
        <Icon className={`${iconSizes[size]}`} strokeWidth={1.8} />
      </div>
      {showLabel && (
        <span
          className={`text-[11px] font-medium leading-tight text-center transition-colors ${
            isSelected ? "text-brown-900 font-bold" : "text-brown-700/80 group-hover:text-brown-900"
          }`}
        >
          {mood.label}
        </span>
      )}
    </button>
  );
}

export interface MoodPebbleGroupProps {
  value?: MoodValue | string | null;
  onChange?: (value: MoodValue) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  showLabels?: boolean;
}

export function MoodPebbleGroup({
  value,
  onChange,
  size = "md",
  disabled = false,
  className = "",
  showLabels = true,
}: MoodPebbleGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Pilih Suasana Hati"
      className={`flex items-center justify-between gap-2 sm:gap-3 w-full ${className}`}
    >
      {CANONICAL_MOODS.map((m) => (
        <MoodPebble
          key={m.value}
          mood={m}
          isSelected={value === m.value}
          onSelect={onChange}
          size={size}
          disabled={disabled}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

export default MoodPebble;

