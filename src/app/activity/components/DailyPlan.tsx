"use client";

import { useState } from "react";

export interface PlannedActivity {
  id: string;
  time: string;
  title: string;
  duration: string;
  icon: string;
  category: string;
  points: number;
  completed: boolean;
}

interface DailyPlanProps {
  activities: PlannedActivity[];
  completedCount: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onResetDefault?: () => void;
}

export default function DailyPlan({
  activities,
  completedCount,
  onToggle,
  onDelete,
  onAdd,
  onResetDefault,
}: DailyPlanProps) {
  const [activityToDelete, setActivityToDelete] = useState<PlannedActivity | null>(null);

  const confirmDelete = () => {
    if (activityToDelete) {
      onDelete(activityToDelete.id);
      setActivityToDelete(null);
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 md:p-7 border border-brown-900/10 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brown-700">
              📅 Rencana Hari Ini
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cream text-brown-900 text-[10px] font-bold">
              {activities.length} Aktivitas
            </span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
            Aktivitas yang sudah kamu susun
          </h2>
          <p className="text-xs text-brown-700 mt-1">
            {completedCount} dari {activities.length} aktivitas selesai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onResetDefault && activities.length === 0 && (
            <button
              type="button"
              onClick={onResetDefault}
              className="px-4 py-2.5 rounded-full border border-brown-900/15 text-brown-700 text-xs font-bold hover:bg-cream transition-colors"
            >
              Pulihkan Rencana Bawaan
            </button>
          )}

          <button
            type="button"
            onClick={onAdd}
            className="self-start md:self-auto px-5 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-500 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> Tambah Aktivitas
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-6 divide-y divide-brown-900/10">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-colors hover:bg-cream/20 rounded-2xl px-2"
          >
            {/* Left: Time, Icon, Details */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-14 shrink-0">
                <span className="text-xs font-extrabold text-brown-900">
                  {activity.time}
                </span>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-cream flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                {activity.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={
                      "text-sm font-bold truncate " +
                      (activity.completed
                        ? "text-brown-700 line-through opacity-60"
                        : "text-brown-900")
                    }
                  >
                    {activity.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold">
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-brown-700">
                    ⏱️ {activity.duration}
                  </span>
                  <span className="text-[10px] font-bold text-orange-500">
                    +{activity.points} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Toggle Button & Delete Button */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => onToggle(activity.id)}
                className={
                  "px-4 py-2 rounded-full text-xs font-bold transition-all " +
                  (activity.completed
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-brown-900 text-white hover:bg-green-500 shadow-xs")
                }
              >
                {activity.completed ? "✓ Selesai" : "Tandai Selesai"}
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setActivityToDelete(activity)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700/60 hover:text-danger hover:bg-danger/10 transition-colors"
                title="Hapus aktivitas ini"
                aria-label={`Hapus ${activity.title}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-2xl">
              📝
            </div>
            <div>
              <p className="text-sm font-bold text-brown-900">
                Belum ada aktivitas yang kamu susun
              </p>
              <p className="text-xs text-brown-700 max-w-sm mt-1">
                Mulai susun aktivitas hari ini agar tetap produktif, aktif secara fisik, dan pikiran lebih rileks.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={onAdd}
                className="px-6 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
              >
                + Tambah Aktivitas Pertama
              </button>
              {onResetDefault && (
                <button
                  type="button"
                  onClick={onResetDefault}
                  className="px-5 py-2.5 rounded-full border border-brown-900/15 text-brown-700 text-xs font-bold hover:bg-cream transition-colors"
                >
                  Gunakan Template Bawaan
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {activityToDelete && (
        <div
          className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivityToDelete(null);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-brown-900/10">
            <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="font-display text-xl font-bold text-brown-900 text-center">
              Hapus Aktivitas?
            </h3>
            <p className="text-xs text-brown-700 text-center mt-2 leading-relaxed">
              Apakah kamu yakin ingin menghapus{" "}
              <strong className="text-brown-900 font-bold">
                {activityToDelete.icon} {activityToDelete.title}
              </strong>{" "}
              ({activityToDelete.time}) dari rencana hari ini?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActivityToDelete(null)}
                className="flex-1 py-3 rounded-full border border-brown-900/10 bg-white text-brown-700 text-xs font-bold hover:bg-cream transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-full bg-danger hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Hapus Aktivitas
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
