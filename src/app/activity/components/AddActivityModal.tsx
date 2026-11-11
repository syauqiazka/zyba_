"use client";

import { useState } from "react";
import type { PlannedActivity } from "./DailyPlan";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { ACTIVITY_ICON_OPTIONS, renderActivityIcon } from "@/lib/activityIcons";
import { X, Clock, Calendar, AlertTriangle } from "lucide-react";

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
  { label: "+30 pts", value: 30 },
  { label: "+40 pts", value: 40 },
  { label: "+50 pts", value: 50 },
  { label: "+60 pts", value: 60 },
  { label: "+100 pts", value: 100 },
];

export default function AddActivityModal({
  isOpen,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("15 min");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [icon, setIcon] = useState(ACTIVITY_ICON_OPTIONS[0].key);
  const [points, setPoints] = useState(50);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setTitle("");
    setTime("17:00");
    setDuration("15 min");
    setCategory(CATEGORY_OPTIONS[0]);
    setIcon(ACTIVITY_ICON_OPTIONS[0].key);
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
      <div className="w-full max-w-lg bg-white rounded-[24px] p-6 md:p-7 shadow-2xl border border-brown-900/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-800 bg-green-100 px-3 py-1 rounded-full">
              Aktivitas Kustom
            </span>
            <h2 className="font-display text-2xl font-bold text-brown-900 mt-2">
              Tambah Aktivitas Hari Ini
            </h2>
            <p className="text-xs text-brown-700/80 mt-1">
              Jadwalkan satu langkah gerak atau jeda pemulihan yang sesuai dengan kapasitasmu.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-cream hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup form"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-orange-100 border border-orange-500/20 text-orange-900 text-xs flex items-start gap-2">
            <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perhatian</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-brown-700">
              Nama Aktivitas *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Contoh: Jalan Santai di Taman, Peregangan Leher, dll."
              className="w-full mt-1.5 rounded-xl border border-brown-900/10 bg-cream/30 px-4 py-3 text-sm font-medium text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brown-700">
                Waktu Pelaksanaan
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1.5 rounded-xl border border-brown-900/10 bg-cream/30 px-4 py-2.5 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brown-700">
                Durasi
              </label>
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1">
                {DURATION_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      duration === d
                        ? "bg-brown-900 text-white shadow-2xs"
                        : "bg-cream text-brown-700 hover:bg-green-100 hover:text-green-800"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700">
                Kategori
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full mt-1.5 rounded-xl border border-brown-900/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700">
                Zyba Points
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1">
                {POINT_OPTIONS.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPoints(pt.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      points === pt.value
                        ? "bg-orange-500 text-white shadow-2xs"
                        : "bg-cream text-brown-700 hover:bg-orange-100"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Anti-Slop Lucide Icon Picker */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700 block mb-1.5">
              Pilih Ikon Aktivitas
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ACTIVITY_ICON_OPTIONS.map((opt) => {
                const isSelected = icon === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setIcon(opt.key)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-brown-900 text-white border-brown-900 shadow-2xs scale-102"
                        : "bg-cream/40 border-brown-900/10 text-brown-700 hover:bg-cream hover:text-brown-900"
                    }`}
                    title={opt.label}
                  >
                    {renderActivityIcon(opt.key, isSelected ? "text-orange-400" : "text-brown-800", 1.8)}
                    <span className="text-[9px] font-semibold truncate max-w-full">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brown-900/10">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-full border border-brown-900/10 bg-white text-brown-700 text-xs font-bold hover:bg-cream transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            + Simpan Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}
