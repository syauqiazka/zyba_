"use client";

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
  onAdd: () => void;
}

export default function DailyPlan({
  activities,
  completedCount,
  onToggle,
  onAdd,
}: DailyPlanProps) {
  return (
    <section className="glass-card rounded-3xl p-6 md:p-7 border border-brown-900/10 bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">
            📅 Rencana Hari Ini
          </span>
          <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
            Aktivitas yang sudah kamu susun
          </h2>
          <p className="text-xs text-brown-700 mt-1">
            {completedCount} dari {activities.length} aktivitas selesai.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="self-start md:self-auto px-5 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-500 transition-colors"
        >
          + Tambah Aktivitas
        </button>
      </div>

      <div className="mt-6 divide-y divide-brown-900/10">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="w-16 shrink-0">
              <span className="text-xs font-extrabold text-brown-900">
                {activity.time}
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-cream flex items-center justify-center text-xl shrink-0">
              {activity.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={
                    "text-sm font-bold " +
                    (activity.completed
                      ? "text-brown-700 line-through opacity-60"
                      : "text-brown-900")
                  }
                >
                  {activity.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-500 text-[9px] font-bold">
                  {activity.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-brown-700">
                  {activity.duration}
                </span>
                <span className="text-[10px] font-bold text-orange-500">
                  +{activity.points} pts
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggle(activity.id)}
              className={
                "px-4 py-2 rounded-full text-[10px] font-bold transition-colors shrink-0 " +
                (activity.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-brown-900 text-white hover:bg-green-500")
              }
            >
              {activity.completed ? "✓ Selesai" : "Tandai Selesai"}
            </button>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="py-10 text-center text-xs text-brown-700">
            Belum ada aktivitas. Tambahkan satu untuk mulai menyusun harimu.
          </div>
        )}
      </div>
    </section>
  );
}
