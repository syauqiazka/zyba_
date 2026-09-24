"use client";

import { useState } from "react";
import type { PlannedActivity } from "./DailyPlan";

export type NewActivity = Omit<PlannedActivity, "id" | "completed">;

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: NewActivity) => void;
}

const CATEGORY_OPTIONS = [
  "Aktivitas Ringan",
  "Mobility",
  "Latihan",
  "Recovery",
  "Relaksasi",
];

const ICON_OPTIONS = ["🚶", "🏃", "🤸", "🏋️", "🧘", "🫁", "🧍"];

export default function AddActivityModal({
  isOpen,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("19:00");
  const [duration, setDuration] = useState("15 min");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);

  if (!isOpen) return null;

  const reset = () => {
    setTitle("");
    setTime("19:00");
    setDuration("15 min");
    setCategory(CATEGORY_OPTIONS[0]);
    setIcon(ICON_OPTIONS[0]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      time,
      duration: duration.trim() || "15 min",
      category,
      icon,
      points: 50,
    });
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-brown-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">
              Planner
            </span>
            <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
              Tambah Aktivitas
            </h2>
            <p className="text-xs text-brown-700 mt-1">
              Masukkan aktivitas yang ingin kamu jadwalkan hari ini.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-cream text-brown-700 font-bold hover:bg-brown-900 hover:text-white transition-colors"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-brown-700">
              Nama aktivitas
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Jalan sore"
              className="w-full mt-1 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              autoFocus
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-brown-700">
                Waktu
              </span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full mt-1 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase text-brown-700">
                Durasi
              </span>
              <input
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="15 min"
                className="w-full mt-1 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-brown-700">
                Kategori
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full mt-1 rounded-2xl border border-brown-900/10 bg-cream/40 px-4 py-3 text-xs font-bold text-brown-900 focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-[10px] font-bold uppercase text-brown-700">
                Ikon
              </span>
              <div className="grid grid-cols-7 gap-1 mt-1">
                {ICON_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setIcon(option)}
                    className={
                      "h-10 rounded-xl text-lg transition-colors " +
                      (icon === option
                        ? "bg-brown-900"
                        : "bg-cream hover:bg-green-100")
                    }
                    aria-label={"Pilih ikon " + option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
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
            className="flex-1 py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-500 transition-colors"
          >
            Simpan Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}
