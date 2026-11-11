"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Wind,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Feather,
} from "lucide-react";

export type BreathingPhase = "Tarik Napas" | "Tahan Napas" | "Hembuskan";

interface BreathingExerciseProps {
  onComplete?: () => void;
  // Optional backwards-compatibility props
  breathingActive?: boolean;
  setBreathingActive?: (active: boolean) => void;
  breathingPhase?: BreathingPhase;
  breathTimer?: number;
  setBreathTimer?: (timer: number) => void;
  formatTime?: (secs: number) => string;
}

interface AudioTrack {
  id: string;
  name: string;
  src: string;
  category: string;
}

const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "relaxation",
    name: "Relaksasi Pernapasan",
    src: "/audio/relaxation-breathe.ogg",
    category: "Relaksasi",
  },
  {
    id: "focus",
    name: "Fokus Menenangkan",
    src: "/audio/ambient-focus.ogg",
    category: "Fokus",
  },
  {
    id: "sleep",
    name: "Tidur & Meditasi",
    src: "/audio/deep-sleep.ogg",
    category: "Sleep",
  },
];

// 4-7-8 Breathing Technique: 4s Tarik, 7s Tahan, 8s Hembuskan
const PHASE_DURATIONS: Record<BreathingPhase, number> = {
  "Tarik Napas": 4,
  "Tahan Napas": 7,
  "Hembuskan": 8,
};

const TOTAL_CYCLES = 4; // Standard 4-7-8 session is 4 breath cycles (~76 seconds)

export default function BreathingExercise({
  onComplete,
  breathingActive: externalActive,
  setBreathingActive: externalSetActive,
}: BreathingExerciseProps) {
  // Internal state for robust 4-7-8 cycle coordination
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("Tarik Napas");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(PHASE_DURATIONS["Tarik Napas"]);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Background music state
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack>(AUDIO_TRACKS[0]);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with external state if provided
  const active = externalActive !== undefined ? externalActive : isActive;
  const setActive = useCallback((val: boolean) => {
    setIsActive(val);
    if (externalSetActive) externalSetActive(val);
  }, [externalSetActive]);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Audio play/pause sync
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicEnabled && active) {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn("[BreathingExercise] Audio play error:", err);
      });
    } else {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [musicEnabled, active]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Session Completion
  const handleCompleteSession = useCallback(() => {
    setActive(false);
    setIsSessionFinished(true);
    if (onComplete) {
      onComplete();
    }
  }, [setActive, onComplete]);

  // Reset Session
  const handleReset = () => {
    setActive(false);
    setPhase("Tarik Napas");
    setPhaseSecondsLeft(PHASE_DURATIONS["Tarik Napas"]);
    setCurrentCycle(1);
    setIsSessionFinished(false);
  };

  // 4-7-8 Breathing Loop Interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (active) {
      setIsSessionFinished(false);
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Transition to next phase
          if (phase === "Tarik Napas") {
            setPhase("Tahan Napas");
            return PHASE_DURATIONS["Tahan Napas"];
          } else if (phase === "Tahan Napas") {
            setPhase("Hembuskan");
            return PHASE_DURATIONS["Hembuskan"];
          } else {
            // "Hembuskan" completed, increment cycle or finish
            if (currentCycle >= TOTAL_CYCLES) {
              handleCompleteSession();
              setPhase("Tarik Napas");
              return PHASE_DURATIONS["Tarik Napas"];
            } else {
              setCurrentCycle((c) => c + 1);
              setPhase("Tarik Napas");
              return PHASE_DURATIONS["Tarik Napas"];
            }
          }
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [active, phase, currentCycle, handleCompleteSession]);

  const handleTrackChange = (track: AudioTrack) => {
    setSelectedTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      if (musicEnabled && active) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
    }
  };

  const toggleManualAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        setMusicEnabled(true);
      }).catch((e) => console.warn(e));
    }
  };

  // Visual dynamic scaling for organic breathing
  // Tarik Napas (4s): scale expands to 1.25
  // Tahan Napas (7s): stays at scale 1.25
  // Hembuskan (8s): contracts to scale 1.0
  const getCircleScaleClass = () => {
    if (reducedMotion || !active) return "scale-100";
    if (phase === "Tarik Napas") return "scale-120 duration-[4000ms]";
    if (phase === "Tahan Napas") return "scale-120 duration-500";
    if (phase === "Hembuskan") return "scale-95 duration-[8000ms]";
    return "scale-100";
  };

  const getPhaseColorClass = () => {
    if (!active) return "text-brown-900";
    if (phase === "Tarik Napas") return "text-green-700";
    if (phase === "Tahan Napas") return "text-orange-600";
    return "text-brown-900";
  };

  return (
    <div className="w-full bg-green-100/70 rounded-[24px] border border-green-500/25 p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xs transition-all">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={selectedTrack.src}
        loop
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center text-green-700">
            <Wind size={16} strokeWidth={2} />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-bold text-green-800 uppercase tracking-wider block">
              Taman Bernapas 4-7-8
            </span>
            <span className="text-xs text-brown-700/80">
              Zyba Hours • Relaksasi Sistem Saraf Otonom
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-green-800 border border-green-500/20 flex items-center gap-1.5 shadow-2xs">
            <Sparkles size={12} className="text-green-600" />
            <span>Siklus {currentCycle} dari {TOTAL_CYCLES}</span>
          </span>
        </div>
      </div>

      {/* Animated Breathing Circle */}
      <div className="my-6 relative flex items-center justify-center">
        {/* Soft atmospheric halo */}
        <div
          className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-green-500/10 transition-all ease-in-out pointer-events-none ${
            active && phase === "Tarik Napas" ? "scale-125 opacity-100 duration-[4000ms]" : "scale-100 opacity-40 duration-[4000ms]"
          }`}
        />

        {/* Outer Ring */}
        <div
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white/90 border-2 border-green-500/35 flex flex-col items-center justify-center p-4 shadow-sm transition-transform ease-in-out ${getCircleScaleClass()}`}
        >
          {isSessionFinished ? (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              <CheckCircle2 size={36} className="text-green-600 mb-1" />
              <span className="font-display text-lg font-bold text-brown-900">
                Sesi Selesai
              </span>
              <span className="text-[11px] text-green-700 font-medium mt-0.5">
                Tubuhmu kini lebih rileks
              </span>
            </div>
          ) : (
            <>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-brown-700/70 flex items-center gap-1">
                <Feather size={12} className="text-green-600" />
                {active ? "Ritme Napas" : "Siap Memulai"}
              </span>

              <span className={`font-display text-2xl sm:text-3xl font-extrabold mt-1 transition-colors duration-300 ${getPhaseColorClass()}`}>
                {active ? phase : "4-7-8"}
              </span>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900">
                  {active ? phaseSecondsLeft : "19"}
                </span>
                <span className="text-xs font-semibold text-brown-700/70">
                  detik
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Breathing Guide Subtitle */}
      <div className="max-w-md mx-auto mb-6">
        <p className="text-xs sm:text-sm text-brown-800 leading-relaxed font-body">
          {active ? (
            phase === "Tarik Napas" ? (
              <span className="font-semibold text-green-800">
                Tarik napas perlahan melalui hidung selama 4 detik, rasakan paru-paru mengembang.
              </span>
            ) : phase === "Tahan Napas" ? (
              <span className="font-semibold text-orange-700">
                Tahan napasmu selama 7 detik dengan tenang dan rileks, tanpa paksaan.
              </span>
            ) : (
              <span className="font-semibold text-brown-900">
                Hembuskan perlahan lewat bibir selama 8 detik hingga dada terasa plong.
              </span>
            )
          ) : isSessionFinished ? (
            <span className="text-green-800 font-medium">
              Selesai! Kamu telah menyelesaikan 4 siklus pernapasan menenangkan. +30 Zyba Points telah tersimpan.
            </span>
          ) : (
            <span>
              Metode 4-7-8 terbukti secara klinis menenangkan respon <em>fight-or-flight</em>. Ambil posisi duduk yang nyaman dan mulai sesi ini.
            </span>
          )}
        </p>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setActive(!active)}
          className={`min-h-[46px] px-8 py-3 rounded-full text-sm font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
            active
              ? "bg-orange-500 hover:bg-orange-600 ring-2 ring-orange-500/20"
              : "bg-brown-900 hover:bg-brown-900/90 hover:shadow-lg"
          }`}
          aria-label={active ? "Jeda Latihan Pernapasan" : "Mulai Latihan Pernapasan"}
        >
          {active ? (
            <>
              <Pause size={17} />
              <span>Jeda Sesi</span>
            </>
          ) : (
            <>
              <Play size={17} className="ml-0.5" />
              <span>{isSessionFinished ? "Ulangi Sesi" : "Mulai Bernapas →"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[46px] px-5 py-3 rounded-full text-xs font-bold border border-brown-900/15 bg-white/90 text-brown-700 hover:bg-white hover:text-brown-900 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          aria-label="Reset Latihan Pernapasan"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Ambient Audio Player Card */}
      <div className="w-full bg-white/95 border border-brown-900/10 rounded-[20px] p-4 sm:p-5 shadow-2xs flex flex-col gap-3.5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brown-900/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Music size={18} strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
                <span>Musik Latar Penenang</span>
                {isPlayingAudio && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full animate-pulse">
                    Memutar
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brown-700/80">
                Audio gelombang alami untuk menemani fokus & relaksasi pernapasan
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto select-none">
            <span className="text-xs font-semibold text-brown-800">
              {musicEnabled ? "Musik Aktif" : "Putar Musik Latar"}
            </span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={(e) => {
                  setMusicEnabled(e.target.checked);
                  if (!e.target.checked && audioRef.current) {
                    audioRef.current.pause();
                    setIsPlayingAudio(false);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-brown-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
            </div>
          </label>
        </div>

        {/* Track selector + Volume slider */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Track Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {AUDIO_TRACKS.map((track) => {
              const isCurrent = selectedTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleTrackChange(track)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    isCurrent
                      ? "bg-brown-900 text-white shadow-2xs"
                      : "bg-cream text-brown-700 hover:bg-green-100 hover:text-green-800"
                  }`}
                >
                  <Music size={12} className={isCurrent ? "text-green-400" : "opacity-50"} />
                  <span>{track.name}</span>
                </button>
              );
            })}
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={toggleManualAudio}
              className="min-h-[42px] min-w-[42px] rounded-full bg-cream hover:bg-orange-100 text-brown-900 flex items-center justify-center transition-colors active:scale-95 border border-brown-900/10 shadow-2xs cursor-pointer"
              title={isPlayingAudio ? "Jeda Audio" : "Putar Audio"}
              aria-label={isPlayingAudio ? "Jeda Audio" : "Putar Audio"}
            >
              {isPlayingAudio ? (
                <Pause size={17} className="text-orange-600" />
              ) : (
                <Play size={17} className="text-brown-800 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="min-h-[42px] min-w-[42px] rounded-full bg-cream hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              title={isMuted ? "Bunyikan" : "Bisukan"}
              aria-label={isMuted ? "Bunyikan" : "Bisukan"}
            >
              {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-20 sm:w-24 h-2 bg-brown-900/15 rounded-lg appearance-none cursor-pointer accent-green-600"
              aria-label="Volume Musik Latar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
