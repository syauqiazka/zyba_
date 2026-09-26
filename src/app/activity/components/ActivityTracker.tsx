"use client";

interface ActivityTrackerProps {
  activeTab: "WALKING" | "RUNNING" | "WORKOUT";
  setActiveTab: (tab: "WALKING" | "RUNNING" | "WORKOUT") => void;
  activityProgress: number;
  targetProgress: number;
  onAddProgress: () => void;
}

export default function ActivityTracker({
  activeTab,
  setActiveTab,
  activityProgress,
  targetProgress,
  onAddProgress,
}: ActivityTrackerProps) {
  return (
    <div className="glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-extrabold text-brown-900">
            Pelacak Activity & Workout
          </h2>
          <p className="text-xs text-brown-700 mt-0.5">
            Pilih mode aktivitas fisik harianmu untuk memperbarui Zyba Score.
          </p>
        </div>

        {/* Activity Type Selector Tabs */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10 overflow-x-auto max-w-full no-scrollbar shrink-0">
          {[
            { id: "WALKING", label: "Walking 🚶‍♂️" },
            { id: "RUNNING", label: "Running 🏃‍♂️" },
            { id: "WORKOUT", label: "Workout 🏋️‍♂️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Progress Ring & Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-brown-900/10">
        <div className="flex flex-col items-center justify-center border-r border-brown-900/10 pr-4">
          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider mb-2">
            Progress Real-Time
          </span>
          <span className="font-display text-4xl font-extrabold text-brown-900">
            {activityProgress} <span className="text-xs text-brown-700">/ {targetProgress}</span>
          </span>
          <span className="text-[11px] text-green-500 font-bold mt-1">
            {Math.round((activityProgress / targetProgress) * 100)}% Target Tercapai
          </span>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Estimasi Kalori Terbakar:</span>
            <span className="font-bold text-brown-900">320 kcal</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Durasi Aktif:</span>
            <span className="font-bold text-brown-900">42 Menit</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brown-700">Jarak Tempuh:</span>
            <span className="font-bold text-brown-900">3.4 km</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-cream/50 p-4 rounded-2xl border border-brown-900/10">
          <button
            onClick={onAddProgress}
            className="w-full py-3 rounded-full bg-green-500 hover:bg-brown-900 text-white font-bold text-xs transition-colors shadow-md"
          >
            + Tambah 150 Langkah / Aktivitas
          </button>
          <span className="text-[10px] text-brown-700">Tekan untuk menyimulasikan progress aktivitas</span>
        </div>
      </div>
    </div>
  );
}
