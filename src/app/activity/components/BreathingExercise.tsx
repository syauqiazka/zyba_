"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Wind,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";

interface BreathingExerciseProps {
  breathingActive: boolean;
  setBreathingActive: (active: boolean) => void;
  breathingPhase: "Tarik Napas" | "Tahan Napas" | "Hembuskan";
  breathTimer: number;
  setBreathTimer: (timer: number) => void;
  formatTime: (secs: number) => string;
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

export default function BreathingExercise({
  breathingActive,
  setBreathingActive,
  breathingPhase,
  breathTimer,
  setBreathTimer,
  formatTime,
}: BreathingExerciseProps) {
  // Background music state
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack>(AUDIO_TRACKS[0]);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play / pause audio along with breathing active state if toggle enabled
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicEnabled && breathingActive) {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn("[BreathingExercise] Audio play error:", err);
      });
    } else {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [musicEnabled, breathingActive]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTrackChange = (track: AudioTrack) => {
    setSelectedTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      if (musicEnabled && breathingActive) {
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

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-7 md:p-8 border border-brown-900/10 flex flex-col items-center justify-between text-center relative overflow-hidden bg-gradient-to-br from-white via-green-100/20 to-cream shadow-xs">
      {/* Hidden Audio Element with loop */}
      <audio
        ref={audioRef}
        src={selectedTrack.src}
        loop
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 mb-3">
        <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-1.5">
          <Wind size={16} className="text-green-600" />
          Zyba Hours — Latihan Pernapasan Relaksasi
        </span>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
          <Sparkles size={12} className="text-green-600" />
          Meredakan Stres
        </span>
      </div>

      {/* Animated Breathing Circle */}
      <div className="my-5 relative flex items-center justify-center">
        <div
          className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-green-500/30 to-orange-500/30 flex items-center justify-center transition-transform duration-1000 ${
            breathingActive ? "animate-breathe" : "scale-100"
          }`}
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-xl flex flex-col items-center justify-center p-3 border border-brown-900/10">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              {breathingActive ? breathingPhase : "Relaksasi"}
            </span>
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 mt-1">
              {formatTime(breathTimer)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-brown-700 max-w-md mb-5 leading-relaxed">
        Ikuti ritme lingkaran pernapasan (Tarik Napas 4 detik, Tahan 4 detik, Hembuskan 4 detik) untuk meredakan ketegangan sistem saraf otonom.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6 w-full sm:w-auto justify-center">
        <button
          type="button"
          onClick={() => setBreathingActive(!breathingActive)}
          className={`min-h-[44px] px-8 py-3 rounded-full text-sm font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            breathingActive
              ? "bg-orange-500 hover:bg-brown-900"
              : "bg-brown-900 hover:bg-green-600"
          }`}
        >
          {breathingActive ? (
            <>
              <Pause size={16} />
              Jeda Sesi
            </>
          ) : (
            <>
              <Play size={16} />
              Mulai Pernapasan →
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setBreathingActive(false);
            setBreathTimer(180);
          }}
          className="min-h-[44px] px-5 py-3 rounded-full text-xs font-bold border border-brown-900/15 bg-white text-brown-700 hover:bg-cream active:scale-95 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* ── Background Music Player Controls ── */}
      <div className="w-full bg-white/90 border border-brown-900/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brown-900/8 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Music size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
                <span>Musik Latar ElevenLabs</span>
                {isPlayingAudio && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full animate-pulse">
                    Memutar
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brown-700/80">
                Audio ambient bebas hak cipta untuk menemani fokus & relaksasi napas
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
              <div className="w-11 h-6 bg-brown-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
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
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isCurrent
                      ? "bg-brown-900 text-white shadow-xs"
                      : "bg-cream text-brown-700 hover:bg-orange-100 hover:text-orange-700"
                  }`}
                >
                  <Music size={12} className={isCurrent ? "text-orange-400" : "opacity-50"} />
                  <span>{track.name}</span>
                </button>
              );
            })}
          </div>

          {/* Player controls: Play/pause button + Volume */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={toggleManualAudio}
              className="min-h-[44px] min-w-[44px] rounded-full bg-cream hover:bg-orange-100 text-brown-900 flex items-center justify-center transition-colors active:scale-95 border border-brown-900/10 shadow-xs"
              title={isPlayingAudio ? "Jeda Audio" : "Putar Audio"}
              aria-label={isPlayingAudio ? "Jeda Audio" : "Putar Audio"}
            >
              {isPlayingAudio ? <Pause size={18} className="text-orange-600" /> : <Play size={18} className="text-brown-800 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="min-h-[44px] min-w-[44px] rounded-full bg-cream hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors active:scale-95"
              title={isMuted ? "Bunyikan" : "Bisukan"}
              aria-label={isMuted ? "Bunyikan" : "Bisukan"}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
              className="w-20 sm:w-24 h-2 bg-brown-900/15 rounded-lg appearance-none cursor-pointer accent-orange-500"
              aria-label="Volume Musik Latar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
