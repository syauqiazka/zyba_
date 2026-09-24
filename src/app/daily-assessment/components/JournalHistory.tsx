"use client";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  flaggedForRisk?: boolean;
}

interface JournalHistoryProps {
  journalList: JournalEntry[];
}

export default function JournalHistory({ journalList }: JournalHistoryProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-brown-900">
        Riwayat Health Journal
      </h3>

      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
        {journalList.map((j) => (
          <div key={j.id} className="p-4 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brown-900">{j.title}</span>
              <span className="text-[10px] text-brown-700">{j.date}</span>
            </div>
            <p className="text-xs text-brown-700 leading-relaxed">{j.content}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-500">
                Mood: {j.mood}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
