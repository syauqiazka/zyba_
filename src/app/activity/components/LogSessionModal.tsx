"use client";

import { useState } from "react";
import { Footprints, Flame, Dumbbell, X, Check, Timer, Zap, MapPin } from "lucide-react";

export interface LoggedSessionData {
  type: "WALKING" | "RUNNING" | "WORKOUT";
  durationMin: number;
  stepsEstimated: number;
  calories: number;
  distanceKm: number;
  points: number;
  notes?: string;
}

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "WALKING" | "RUNNING" | "WORKOUT";
  onSaveSession: (data: LoggedSessionData) => Promise<void> | void;
}

const DURATION_PRESETS = [10, 15, 20, 30, 45, 60];

const TYPE_CONFIG = {
  WALKING: {
    label: "Jalan Kaki",
    icon: Footprints,
    stepsPerMin: 110,
    kcalPerMin: 4.5,
    kmPerMin: 0.08,
    ptsPerMin: 5,
    badgeColor: "text-green-700 bg-green-100",
  },
  RUNNING: {
    label: "Lari Santai",
    icon: Flame,
    stepsPerMin: 160,
    kcalPerMin: 9.0,
    kmPerMin: 0.15,
    ptsPerMin: 8,
    badgeColor: "text-orange-700 bg-orange-100",
  },
  WORKOUT: {
    label: "Olahraga / Latihan",
    icon: Dumbbell,
    stepsPerMin: 90,
    kcalPerMin: 7.0,
    kmPerMin: 0,
    ptsPerMin: 7,
    badgeColor: "text-blue-700 bg-blue-100",
  },
};

export default function LogSessionModal({
  isOpen,
  onClose,
  initialType = "WALKING",
  onSaveSession,
}: LogSessionModalProps) {
  const [selectedType, setSelectedType] = useState<"WALKING" | "RUNNING" | "WORKOUT">(initialType);
  const [durationMin, setDurationMin] = useState<number>(20);
  const [customInput, setCustomInput] = useState<string>("20");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cfg = TYPE_CONFIG[selectedType];
  const safeDuration = Math.max(1, Math.min(300, durationMin));
  const estimatedSteps = Math.round(safeDuration * cfg.stepsPerMin);
  const estimatedCalories = Math.round(safeDuration * cfg.kcalPerMin);
  const estimatedDistance = parseFloat((safeDuration * cfg.kmPerMin).toFixed(2));
  const estimatedPoints = Math.round(safeDuration * cfg.ptsPerMin);

  const handleSelectPreset = (min: number) => {
    setDurationMin(min);
    setCustomInput(String(min));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setDurationMin(num);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSaveSession({
        type: selectedType,
        durationMin: safeDuration,
        stepsEstimated: estimatedSteps,
        calories: estimatedCalories,
        distanceKm: estimatedDistance,
        points: estimatedPoints,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-session-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-brown-900/10 shadow-2xl p-6 sm:p-7 flex flex-col gap-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-brown-900/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                Catat Sesi Aktivitas
              </span>
            </div>
            <h3
              id="log-session-modal-title"
              className="font-display text-xl font-bold text-brown-900"
            >
              Berapa menit kamu bergerak hari ini?
            </h3>
            <p className="text-xs text-brown-700/80 mt-0.5">
              Sistem akan menghitung estimasi langkah, kalori, dan poin kebugaran secara otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-brown-700/60 hover:text-brown-900 hover:bg-cream transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Pilih Jenis Aktivitas */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brown-900">
              Pilih Jenis Aktivitas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["WALKING", "RUNNING", "WORKOUT"] as const).map((type) => {
                const item = TYPE_CONFIG[type];
                const Icon = item.icon;
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-sm scale-102"
                        : "bg-cream/40 text-brown-900 border-brown-900/10 hover:border-brown-900/30"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih / Masukkan Durasi */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brown-900 flex items-center gap-1.5">
                <Timer size={14} className="text-[#456882]" />
                <span>Durasi Aktivitas (Menit)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={customInput}
                  onChange={handleCustomChange}
                  className="w-16 h-8 text-center text-xs font-bold rounded-lg border border-brown-900/20 bg-cream/30 text-brown-900 focus:outline-hidden focus:ring-1 focus:ring-[#1B3C53]"
                />
                <span className="text-xs font-semibold text-brown-700">menit</span>
              </div>
            </div>

            {/* Durasi Presets */}
            <div className="grid grid-cols-6 gap-1.5">
              {DURATION_PRESETS.map((preset) => {
                const isSelected = durationMin === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brown-900 text-white border-brown-900 shadow-2xs"
                        : "bg-white text-brown-700 border-brown-900/15 hover:bg-cream/50"
                    }`}
                  >
                    {preset}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Real-Time Calculation Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-brown-900/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-700/70 uppercase tracking-wider">
                Kalkulasi Real-Time
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cfg.badgeColor}`}>
                {cfg.label} · {safeDuration} Menit
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-brown-900/5 text-center">
              {/* Langkah / Reps */}
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brown-900/5">
                <Footprints size={15} className="text-[#8FAE5D] mb-1" />
                <span className="text-[10px] text-brown-700/70 font-medium">
                  {selectedType === "WORKOUT" ? "Setara Langkah" : "Estimasi Langkah"}
                </span>
                <span className="font-display font-extrabold text-sm text-brown-900">
                  {estimatedSteps.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Kalori */}
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brown-900/5">
                <Zap size={15} className="text-orange-500 mb-1" />
                <span className="text-[10px] text-brown-700/70 font-medium">
                  Kalori Terbakar
                </span>
                <span className="font-display font-extrabold text-sm text-brown-900">
                  ~{estimatedCalories} kcal
                </span>
              </div>

              {/* Jarak / Poin */}
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brown-900/5">
                {selectedType === "WORKOUT" ? (
                  <Flame size={15} className="text-blue-500 mb-1" />
                ) : (
                  <MapPin size={15} className="text-[#456882] mb-1" />
                )}
                <span className="text-[10px] text-brown-700/70 font-medium">
                  {selectedType === "WORKOUT" ? "Poin Kebugaran" : "Jarak Tempuh"}
                </span>
                <span className="font-display font-extrabold text-sm text-brown-900">
                  {selectedType === "WORKOUT"
                    ? `+${estimatedPoints} pts`
                    : `${estimatedDistance} km`}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-brown-700/60 text-center leading-relaxed">
              *Dihitung berdasarkan standar durasi rata-rata MET (Metabolic Equivalent of Task).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-brown-900/20 text-xs font-semibold text-brown-900 hover:bg-cream transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Simpan Sesi Aktivitas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
