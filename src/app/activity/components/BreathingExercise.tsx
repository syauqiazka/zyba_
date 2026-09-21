"use client";

interface BreathingExerciseProps {
  breathingActive: boolean;
  setBreathingActive: (active: boolean) => void;
  breathingPhase: "Tarik Napas" | "Tahan Napas" | "Hembuskan";
  breathTimer: number;
  setBreathTimer: (timer: number) => void;
  formatTime: (secs: number) => string;
}

export default function BreathingExercise({
  breathingActive,
  setBreathingActive,
  breathingPhase,
  breathTimer,
  setBreathTimer,
  formatTime,
}: BreathingExerciseProps) {
  return (
    <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col items-center justify-between text-center relative overflow-hidden bg-gradient-to-br from-white via-green-100/20 to-cream">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-1.5">
          🫁 Zyba Hours — Breathing Exercise
        </span>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
          Stress Relief Mode
        </span>
      </div>

      {/* Animated Breathing Circle */}
      <div className="my-6 relative flex items-center justify-center">
        <div
          className={`w-44 h-44 rounded-full bg-gradient-to-tr from-green-500/30 to-orange-500/30 flex items-center justify-center transition-transform duration-1000 ${
            breathingActive ? "animate-breathe" : "scale-100"
          }`}
        >
          <div className="w-32 h-32 rounded-full bg-white shadow-xl flex flex-col items-center justify-center p-2 border border-brown-900/10">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              {breathingActive ? breathingPhase : "Relaksasi"}
            </span>
            <span className="font-display text-3xl font-extrabold text-brown-900 mt-1">
              {formatTime(breathTimer)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-brown-700 max-w-md mb-4">
        Ikuti ritme lingkaran pernapasan (Tarik Napas 4 detik, Tahan 4 detik, Hembuskan 4 detik) untuk meredakan ketegangan sistem saraf.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setBreathingActive(!breathingActive)}
          className={`px-8 py-3 rounded-full text-xs font-bold text-white transition-all shadow-md ${
            breathingActive
              ? "bg-orange-500 hover:bg-brown-900"
              : "bg-brown-900 hover:bg-green-500"
          }`}
        >
          {breathingActive ? "Jeda Sesi" : "Mulai Pernapasan →"}
        </button>
        <button
          type="button"
          onClick={() => {
            setBreathingActive(false);
            setBreathTimer(180);
          }}
          className="px-4 py-3 rounded-full text-xs font-bold border border-brown-900/10 bg-white text-brown-700 hover:bg-cream"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
