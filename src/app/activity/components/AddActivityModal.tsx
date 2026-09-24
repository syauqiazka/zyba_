"use client";

import { useState } from "react";
import type { PlannedActivity } from "./DailyPlan";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

export type NewActivity = Omit<PlannedActivity, "id" | "completed">;

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: NewActivity) => void;
}

const CATEGORY_OPTIONS = [
  "Aktivitas Ringan",
  "Mobility & Stretching",
  "Latihan & Workout",
  "Kardio",
  "Recovery",
  "Relaksasi & Meditasi",
];

const DURATION_PRESETS = ["5 min", "10 min", "15 min", "20 min", "30 min", "45 min", "60 min"];

const POINT_OPTIONS = [
  { label: "+20 pts", value: 20 },
  { label: "+40 pts", value: 40 },
  { label: "+50 pts", value: 50 },
  { label: "+60 pts", value: 60 },
  { label: "+100 pts", value: 100 },
];

const ICON_OPTIONS = ["🚶", "🏃", "🤸", "🏋️", "🧘", "🫁", "🚴", "🏊", "⚽", "🛹", "🧗", "🧍"];

export default function AddActivityModal({
  isOpen,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("15 min");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [points, setPoints] = useState(50);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setTitle("");
    setTime("17:00");
    setDuration("15 min");
    setCategory(CATEGORY_OPTIONS[0]);
    setIcon(ICON_OPTIONS[0]);
    setPoints(50);
    setErrorMsg(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMsg("Nama aktivitas tidak boleh kosong.");
      return;
    }

    if (detectRisk(trimmedTitle)) {
      setErrorMsg(
        "Aktivitas ini memicu deteksi keamanan ZYBA. Silakan hubungi layanan bantuan jika kamu membutuhkan dukungan segera."
      );
      return;
    }

    onAdd({
      title: trimmedTitle,
      time,
      duration: duration.trim() || "15 min",
      category,
      icon,
      points,
    });
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-7 shadow-2xl border border-brown-900/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">
              Smart Planner
            </span>
            <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
              Tambah Aktivitas
            </h2>
            <p className="text-xs text-brown-700 mt-1">
              Susun aktivitas fisik atau relaksasi untuk melengkapi rutinitas harianmu.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-cream text-brown-700 font-bold hover:bg-brown-900 hover:text-white transition-colors flex items-center justify-center text-lg shrink-0"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Title */}
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
              Nama Aktivitas *
            </span>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Contoh: Jalan santai sore, Jogging 2 km, Peregangan leher"
              className="w-full mt-1.5 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 placeholder:font-normal placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              autoFocus
            />
          </label>

          {/* Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
                Waktu Pelaksanaan
              </span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full mt-1.5 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
                Durasi
              </span>
              <input
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="15 min"
                className="w-full mt-1.5 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </label>
          </div>

          {/* Duration Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
              Pilihan Cepat Durasi
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDuration(preset)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    duration === preset
                      ? "bg-brown-900 text-white shadow-sm"
                      : "bg-cream text-brown-700 hover:bg-green-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
                Kategori
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full mt-1.5 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
                Zyba Points
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1">
                {POINT_OPTIONS.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPoints(pt.value)}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                      points === pt.value
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-cream text-brown-700 hover:bg-orange-100"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
              Pilih Ikon Aktivitas
            </span>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mt-1.5">
              {ICON_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIcon(option)}
                  className={`h-10 rounded-2xl text-lg flex items-center justify-center transition-all ${
                    icon === option
                      ? "bg-brown-900 text-white ring-2 ring-orange-500/50 scale-105"
                      : "bg-cream hover:bg-green-100"
                  }`}
                  aria-label={"Pilih ikon " + option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-7">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-full border border-brown-900/10 bg-white text-brown-700 text-xs font-bold hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Simpan Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}
