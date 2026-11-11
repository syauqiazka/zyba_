"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Wind,
  Sparkles,
  Moon,
  Headphones,
  X,
} from "lucide-react";

export interface SoundTrack {
  id: string;
  name: string;
  src: string;
  icon: React.ElementType;
  badge: string;
}

const SOUND_TRACKS: SoundTrack[] = [
  {
    id: "relaxation",
    name: "Hujan & Napas Lega",
    src: "/audio/relaxation-breathe.ogg",
    icon: Wind,
    badge: "Relaksasi",
  },
  {
    id: "focus",
    name: "Fokus & Jernih",
    src: "/audio/ambient-focus.ogg",
    icon: Sparkles,
    badge: "Fokus",
  },
  {
    id: "sleep",
    name: "Ketenangan Malam",
    src: "/audio/deep-sleep.ogg",
    icon: Moon,
    badge: "Malam",
  },
];

interface AmbientSoundDockProps {
  onShowTooltip?: (el: HTMLElement, label: string) => void;
  onHideTooltip?: () => void;
  className?: string;
}

export default function AmbientSoundDock({
  onShowTooltip,
  onHideTooltip,
  className = "",
}: AmbientSoundDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SoundTrack>(SOUND_TRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio playback error:", err));
    }
  };

  const handleSelectTrack = (track: SoundTrack) => {
    setSelectedTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      if (isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <div ref={dockRef} className={`relative flex items-center justify-center ${className}`}>
      {/* Hidden Audio Element with Loop */}
      <audio
        ref={audioRef}
        src={selectedTrack.src}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dock Icon Button */}
      <button
        type="button"
        onClick={() => {
          onHideTooltip?.();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={(e) => onShowTooltip?.(e.currentTarget, isPlaying ? "Musik Aktif: " + selectedTrack.name : "Suara Penenang")}
        onMouseLeave={onHideTooltip}
        onFocus={(e) => onShowTooltip?.(e.currentTarget, "Suara Penenang")}
        onBlur={onHideTooltip}
        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative shadow-xs border ${
          isPlaying
            ? "bg-green-100/90 text-green-800 border-green-500/30"
            : "bg-white/90 text-brown-700 hover:text-brown-900 hover:bg-cream border-brown-900/10"
        }`}
        title="Suara Penenang Santuari"
        aria-label="Suara Penenang Santuari"
        aria-expanded={isOpen}
      >
        <Headphones size={18} strokeWidth={isPlaying ? 2.2 : 1.8} />

        {/* Subtle pulsating dot when playing */}
        {isPlaying && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border border-white animate-pulse" />
        )}
      </button>

      {/* Floating Ambient Controller Popover */}
      {isOpen && (
        <div
          className="absolute left-14 bottom-0 z-50 w-72 rounded-[22px] bg-white border border-brown-900/10 p-4 shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-left-2 duration-200"
          style={{ transform: "translateY(-10px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-brown-900/8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Music size={14} />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-brown-900">
                  Suara Santuari
                </h4>
                <span className="text-[10px] text-brown-700/60 block">
                  Audio gelombang alami
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-cream text-brown-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {/* Track Selection Pills */}
          <div className="flex flex-col gap-1.5">
            {SOUND_TRACKS.map((track) => {
              const isSelected = selectedTrack.id === track.id;
              const TrackIcon = track.icon;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track)}
                  className={`p-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brown-900 text-white shadow-2xs font-bold"
                      : "bg-cream/40 text-brown-800 hover:bg-cream"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TrackIcon size={14} className={isSelected ? "text-orange-400" : "text-brown-700"} />
                    <span className="text-xs truncate">{track.name}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-cream" : "bg-white text-brown-700"}`}>
                    {track.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-brown-900/8">
            <button
              type="button"
              onClick={togglePlay}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                isPlaying
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-brown-900 hover:bg-green-600 text-white"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={13} />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play size={13} className="ml-0.5" />
                  <span>Putar</span>
                </>
              )}
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="w-7 h-7 rounded-full bg-cream hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors cursor-pointer"
                title={isMuted ? "Bunyikan" : "Bisukan"}
              >
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
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
                className="w-16 h-1.5 bg-brown-900/15 rounded-lg appearance-none cursor-pointer accent-green-600"
                aria-label="Volume Suara Santuari"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

