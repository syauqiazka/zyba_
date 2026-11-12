"use client";

import React, { useState } from "react";
import { Sun, Moon, Sunrise, Sunset, Clock, ChevronDown, Check } from "lucide-react";
import { TimePhase } from "./SanctuaryLandscape";

interface TimeAtmosphereControlProps {
  currentPhase: TimePhase;
  isAuto: boolean;
  onSelectPhase: (phase: TimePhase) => void;
  onToggleAuto: (auto: boolean) => void;
}

const PHASE_CONFIG: Record<
  TimePhase,
  { label: string; sub: string; icon: React.ElementType; color: string }
> = {
  sunrise: {
    label: "Fajar",
    sub: "05:00 - 07:00",
    icon: Sunrise,
    color: "text-orange-500",
  },
  day: {
    label: "Siang",
    sub: "07:00 - 17:00",
    icon: Sun,
    color: "text-amber-500",
  },
  sunset: {
    label: "Senja",
    sub: "17:00 - 19:00",
    icon: Sunset,
    color: "text-orange-600",
  },
  night: {
    label: "Malam",
    sub: "19:00 - 05:00",
    icon: Moon,
    color: "text-indigo-400",
  },
};

export default function TimeAtmosphereControl({
  currentPhase,
  isAuto,
  onSelectPhase,
  onToggleAuto,
}: TimeAtmosphereControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const active = PHASE_CONFIG[currentPhase];
  const Icon = active.icon;

  const isNight = currentPhase === "night";

  return (
    <div className="relative inline-block text-left z-30">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 border shadow-xs ${
          isNight
            ? "bg-stone-900/80 text-cream border-white/15 hover:bg-stone-800"
            : "bg-white/85 text-brown-900 border-brown-900/10 hover:bg-white"
        } backdrop-blur-md cursor-pointer`}
        aria-label="Pengaturan Waktu Suasana Sanctuary"
      >
        <span className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${active.color}`} strokeWidth={2} />
          <span>{active.label}</span>
        </span>

        {isAuto && (
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              isNight ? "bg-white/10 text-stone-300" : "bg-brown-900/5 text-brown-700/70"
            }`}
          >
            Auto
          </span>
        )}

        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop dismiss */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className={`absolute right-0 mt-2 w-52 rounded-2xl border p-2 shadow-lg backdrop-blur-md z-30 transition-all duration-200 ${
              isNight
                ? "bg-stone-900/95 border-white/15 text-cream"
                : "bg-white/95 border-brown-900/10 text-brown-900"
            }`}
          >
            <div className="px-3 py-1.5 border-b border-brown-900/8">
              <p
                className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  isNight ? "text-stone-400" : "text-brown-700/60"
                }`}
              >
                Suasana Alam ZYBA
              </p>
            </div>

            {/* Auto Real-time option */}
            <button
              type="button"
              onClick={() => {
                onToggleAuto(true);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                isAuto
                  ? isNight
                    ? "bg-white/10 text-white"
                    : "bg-brown-900/8 text-brown-900 font-bold"
                  : isNight
                  ? "hover:bg-white/5 text-stone-300"
                  : "hover:bg-cream text-brown-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Ikuti Jam Nyata (RL)</span>
              </div>
              {isAuto && <Check size={14} className="text-orange-500" />}
            </button>

            <div className="my-1 border-t border-brown-900/6" />

            {/* Manual time choices */}
            {(["sunrise", "day", "sunset", "night"] as TimePhase[]).map((phase) => {
              const cfg = PHASE_CONFIG[phase];
              const PhIcon = cfg.icon;
              const isSelected = !isAuto && currentPhase === phase;

              return (
                <button
                  key={phase}
                  type="button"
                  onClick={() => {
                    onToggleAuto(false);
                    onSelectPhase(phase);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    isSelected
                      ? isNight
                        ? "bg-white/10 text-white font-bold"
                        : "bg-brown-900/8 text-brown-900 font-bold"
                      : isNight
                      ? "hover:bg-white/5 text-stone-300"
                      : "hover:bg-cream text-brown-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PhIcon className={`w-3.5 h-3.5 ${cfg.color}`} strokeWidth={2} />
                    <div className="text-left">
                      <p className="leading-tight">{cfg.label}</p>
                      <p
                        className={`text-[9px] ${
                          isNight ? "text-stone-400" : "text-brown-700/50"
                        }`}
                      >
                        {cfg.sub}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-orange-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

