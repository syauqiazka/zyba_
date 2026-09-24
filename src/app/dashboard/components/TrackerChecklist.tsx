"use client";

interface TrackerChecklistProps {
  trackerState: { [key: string]: boolean };
  completedCount: number;
  totalTrackers: number;
  toggleTracker: (key: string) => void;
}

function TrackerIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    lungs: "M9 5v6a3 3 0 01-3 3H4v-2a4 4 0 014-4h1m6-3v6a3 3 0 003 3h2v-2a4 4 0 00-4-4h-1M9 5h6m-3 0v14",
    smile: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    journal: "M6 4h12a2 2 0 012 2v14H6a2 2 0 01-2-2V6a2 2 0 012-2zm3 4h6m-6 4h6m-6 4h4",
    book: "M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 014 16.5v-11zM4 16.5A2.5 2.5 0 016.5 14H20",
    lotus: "M12 20c-4.5 0-7-2.2-7-5.5 0-2.1 1.3-3.7 3.1-4.5.2 3.1 1.5 5 3.9 6-1.8-2-2.2-4.5-1-6.5 1.2 2 2.2 3 3 3 1-1.4 1.8-3.1 3-4.7 1.2 2 1 4.6-.8 6.5 2.4-1 3.7-2.9 3.9-6 1.8.8 3.1 2.4 3.1 4.5 0 3.3-2.5 5.5-7 5.5z",
    message: "M20 11.5a7.5 7.5 0 01-8 7.5 8.5 8.5 0 01-3.5-.8L4 20l1.5-4A7.5 7.5 0 1112 4a7.5 7.5 0 018 7.5z",
  };

  return (
    <svg className="size-5 text-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

export default function TrackerChecklist({
  trackerState,
  completedCount,
  totalTrackers,
  toggleTracker,
}: TrackerChecklistProps) {
  return (
    <section className="glass-card rounded-3xl p-7 border border-brown-900/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-extrabold text-brown-900">
            Zyba Tracker Checklist
          </h2>
          <p className="text-xs text-brown-700 mt-0.5">
            Selesaikan rutinitas harianmu untuk menjaga Zyba Score tetap optimal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brown-900">
            {completedCount} / {totalTrackers} Selesai
          </span>
          <div className="w-24 h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(completedCount / totalTrackers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: "Zyba Hours (Breathing)", category: "Mindfulness", icon: "lungs", href: "/activity" },
          { key: "Mood Quality Check", category: "Emotional", icon: "smile", href: "/daily-assessment" },
          { key: "Health Journal Entry", category: "Reflection", icon: "journal", href: "/daily-assessment" },
          { key: "Daily Resource Reading", category: "Knowledge", icon: "book", href: "/resources" },
          { key: "Mental Journal Reflection", category: "Wellness", icon: "lotus", href: "/wellness-journey" },
          { key: "Community Activity", category: "Social Support", icon: "message", href: "/community" },
        ].map((item) => {
          const isChecked = trackerState[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleTracker(item.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isChecked
                  ? "bg-green-100/50 border-green-500/30 text-brown-900"
                  : "bg-white border-brown-900/10 hover:border-orange-500/40 text-brown-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isChecked ? "bg-green-500 text-white" : "border-2 border-brown-900/20 bg-cream"
                  }`}
                >
                  {isChecked ? "✓" : ""}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{item.key}</span>
                  <span className="text-[10px] text-brown-700/80">{item.category}</span>
                </div>
              </div>
              <TrackerIcon name={item.icon} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
