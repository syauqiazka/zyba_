"use client";

import { useState } from "react";
import { CloudRain, Frown, Meh, Smile, Sparkles } from "lucide-react";

const MOODS = [
  { value: "DEPRESSED", label: "Sangat Terpuruk", colorClass: "bg-mood-depressed", icon: CloudRain },
  { value: "SAD", label: "Sedih", colorClass: "bg-mood-sad", icon: Frown },
  { value: "NEUTRAL", label: "Biasa Saja", colorClass: "bg-mood-neutral", icon: Meh },
  { value: "HAPPY", label: "Senang", colorClass: "bg-mood-happy", icon: Smile },
  { value: "OVERJOYED", label: "Sangat Bahagia", colorClass: "bg-mood-overjoyed", icon: Sparkles },
] as const;

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
            <m.icon className="size-7" />
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
        {status === "saving" ? "Menyimpan..." : "Simpan Mood →"}
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
