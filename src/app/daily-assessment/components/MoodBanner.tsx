"use client";

interface MoodBannerProps {
  selectedMood: {
    value: string;
    label: string;
    emoji: string;
    bg: string;
    text: string;
  };
  streak?: number;
  dateStr?: string;
}

export default function MoodBanner({
  selectedMood,
  streak = 1,
  dateStr,
}: MoodBannerProps) {
  const displayDate =
    dateStr ||
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

  return (
    <div
      style={{ backgroundColor: selectedMood.bg }}
      className="rounded-3xl p-8 text-white transition-colors duration-500 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
          {selectedMood.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Mood Edit Active
            </span>
            <span className="text-xs opacity-80">{displayDate}</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Kondisimu: {selectedMood.label}
          </h1>
          <p className="text-xs opacity-90 mt-1 max-w-lg">
            Perubahan suasana hati adalah hal yang wajar. Mencatatnya membantu Zyba memberikan saran relaksasi yang tepat.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold uppercase tracking-wider">Journal Streak</span>
          <span className="text-xl font-display font-extrabold">{streak} / 365 Hari</span>
        </div>
        <span className="text-3xl">🔥</span>
      </div>
    </div>
  );
}
