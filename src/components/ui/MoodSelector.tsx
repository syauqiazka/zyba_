"use client";

import { useState } from "react";

const MOODS = [
  { value: "DEPRESSED", label: "Depressed", colorClass: "bg-mood-depressed", icon: "cloud" },
  { value: "SAD", label: "Sad", colorClass: "bg-mood-sad", icon: "rain" },
  { value: "NEUTRAL", label: "Neutral", colorClass: "bg-mood-neutral", icon: "minus" },
  { value: "HAPPY", label: "Happy", colorClass: "bg-mood-happy", icon: "sun" },
  { value: "OVERJOYED", label: "Overjoyed", colorClass: "bg-mood-overjoyed", icon: "spark" },
] as const;

function MoodIcon({ name }: { name: (typeof MOODS)[number]["icon"] }) {
  const paths = {
    cloud: "M4 16.5A4.5 4.5 0 018.5 12 5.5 5.5 0 0119 14.5a3.5 3.5 0 01-.5 7H6a4 4 0 01-2-7.5z",
    rain: "M7 17l-1 3m6-3l-1 3m6-3l-1 3M4 14.5A4.5 4.5 0 018.5 10 5.5 5.5 0 0119 12.5a3.5 3.5 0 01-.5 7H6a4 4 0 01-2-5z",
    minus: "M5 12h14",
    sun: "M12 3v2m0 14v2M3 12h2m14 0h2m-3.36-6.36l-1.42 1.42M6.78 17.22l-1.42 1.42m0-13.42l1.42 1.42m10.44 10.58l1.42 1.42M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    spark: "M12 3.75l1.42 4.83a2 2 0 001.36 1.36L19.6 11.4l-4.82 1.42a2 2 0 00-1.36 1.36L12 19.02l-1.42-4.84a2 2 0 00-1.36-1.36L4.4 11.4l4.82-1.46a2 2 0 001.36-1.36L12 3.75z",
  };

  return (
    <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

export default function MoodSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit() {
    if (!selected) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selected, note }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-brown-900/10 max-w-xl shadow-[0_18px_50px_-34px_rgba(59,42,32,0.7)]">
      <h2 className="font-display text-lg font-semibold mb-1">
        Bagaimana perasaanmu hari ini?
      </h2>
      <p className="text-sm text-brown-700 mb-6">
        Pilih mood yang paling mendekati kondisimu sekarang.
      </p>

      <div className="flex gap-3 mb-6">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setSelected(m.value)}
            className={`flex-1 rounded-2xl py-4 flex flex-col items-center gap-2 border-2 transition-all duration-300 hover:-translate-y-1 ${
              selected === m.value
                ? `${m.colorClass} border-brown-900 text-white`
                : "border-transparent bg-cream hover:border-brown-900/20"
            }`}
          >
            <MoodIcon name={m.icon} />
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Mau cerita lebih lanjut? (opsional)"
        className="w-full rounded-xl border border-brown-900/10 p-3 text-sm mb-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected || status === "saving"}
        className="rounded-pill bg-brown-900 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-40"
      >
        {status === "saving" ? "Menyimpan..." : "Set Mood →"}
      </button>

      {status === "saved" && (
        <p className="text-green-500 text-sm mt-3">Mood berhasil dicatat.</p>
      )}
      {status === "error" && (
        <p className="text-danger text-sm mt-3">
          Gagal menyimpan, coba lagi ya.
        </p>
      )}
    </div>
  );
}
