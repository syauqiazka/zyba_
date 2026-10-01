"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  CheckCircle2,
  Award,
  X,
  Clock,
  User,
  Volume2,
  VolumeX,
  BookOpen,
  Music,
} from "lucide-react";
import { ResourceItem, ResourceIcon } from "./ResourceCard";

interface ResourcePlayerModalProps {
  resource: ResourceItem;
  isAudioPlaying: boolean;
  courseCompleted: boolean;
  onPlayToggle: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function ResourcePlayerModal({
  resource,
  isAudioPlaying,
  courseCompleted,
  onPlayToggle,
  onComplete,
  onClose,
}: ResourcePlayerModalProps) {
  const isAudioType = resource.type === "COURSE" || resource.type === "AUDIO";
  const audioSrc = resource.audioUrl || "/audio/relaxation-breathe.ogg";

  // Parse "5:55 Menit" / "12:00 Menit" / "4 Menit Baca" → seconds
  const parseDurationToSecs = (dur: string): number => {
    // Match "M:SS" pattern
    const mmss = dur.match(/(\d+):(\d{2})/);
    if (mmss) return parseInt(mmss[1]) * 60 + parseInt(mmss[2]);
    // Match plain minutes like "5 Menit"
    const mins = dur.match(/(\d+)/);
    if (mins) return parseInt(mins[1]) * 60;
    return 300; // 5-min default
  };

  const resourceDurationSecs = parseDurationToSecs(resource.duration);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(resourceDurationSecs);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !isAudioType) return;
    if (isAudioPlaying) {
      audioRef.current.play().catch((err) => console.warn("Audio play error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isAudioPlaying, isAudioType]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 max-w-xl w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Hidden Audio Element for actual playback */}
        {isAudioType && (
          <audio
            ref={audioRef}
            src={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                // Only use audio file's actual duration if it's reasonable (> 60s)
                // Otherwise keep the resource.duration metadata so card & player stay in sync
                const audioDur = audioRef.current.duration;
                if (audioDur > 60) {
                  setDuration(audioDur);
                } else {
                  // Audio file is a short demo clip — keep resource metadata duration
                  setDuration(resourceDurationSecs);
                }
              }
            }}
            onEnded={() => {
              onComplete();
            }}
          />
        )}

        {/* Header row */}
        <div className="flex items-center justify-between border-b border-brown-900/8 pb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1.5">
              {resource.type === "COURSE" ? (
                <>
                  <Volume2 size={13} />
                  KURSUS AUDIO
                </>
              ) : resource.type === "AUDIO" ? (
                <>
                  <Music size={13} />
                  AUDIO AMBIENT
                </>
              ) : (
                <>
                  <BookOpen size={13} />
                  ARTIKEL EDUKASI
                </>
              )}
            </span>
            <span className="text-xs font-medium text-brown-700 flex items-center gap-1">
              <Clock size={12} /> {resource.duration}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-full bg-brown-900/5 hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resource Meta & Banner */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cream border border-orange-500/20 text-brown-900 flex items-center justify-center shrink-0 shadow-xs">
            <ResourceIcon name={resource.iconName} className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-brown-900 leading-snug">
              {resource.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-brown-700">
              <User size={13} />
              <span>
                Oleh <strong className="font-semibold text-brown-900">{resource.author}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Audio Player State if COURSE or AUDIO */}
        {isAudioType ? (
          <div className="bg-cream/70 p-5 sm:p-6 rounded-2xl border border-brown-900/10 flex flex-col items-center gap-4 text-center shadow-inner">
            <span className="text-xs font-bold text-brown-900 flex items-center gap-2">
              <Volume2
                size={16}
                className={isAudioPlaying ? "text-orange-500 animate-pulse" : "text-brown-700"}
              />
              {isAudioPlaying ? "Sedang Memutar Audio" : "Sesi Audio Siap Diputar"}
            </span>
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight">
              {formatSecs(currentTime)} / {formatSecs(duration)}
            </span>

            {/* Seek bar */}
            <div className="w-full flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-brown-900/15 rounded-lg appearance-none cursor-pointer accent-orange-500"
                aria-label="Posisi Audio"
              />
            </div>

            {/* Play controls: big touch target buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-1 w-full">
              <button
                type="button"
                onClick={onPlayToggle}
                className="min-h-[44px] px-7 py-3 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-md flex items-center gap-2 active:scale-95"
              >
                {isAudioPlaying ? (
                  <>
                    <Pause size={16} /> Jeda Audio
                  </>
                ) : (
                  <>
                    <Play size={16} className="ml-0.5" /> Putar Audio
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onComplete}
                className="min-h-[44px] px-5 py-3 rounded-full bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 size={16} /> Tandai Selesai
              </button>

              <div className="flex items-center gap-2 ml-1">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="min-h-[44px] min-w-[44px] rounded-full bg-white text-brown-700 hover:bg-brown-100 flex items-center justify-center transition-colors"
                  aria-label={isMuted ? "Bunyikan" : "Bisukan"}
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
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
                  className="w-16 h-2 bg-brown-900/15 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  aria-label="Volume Audio"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Article Body Text */
          <div className="text-xs sm:text-sm text-brown-900 leading-relaxed bg-cream/40 p-5 sm:p-6 rounded-2xl border border-brown-900/10 max-h-[380px] overflow-y-auto space-y-4">
            {resource.articleContent && resource.articleContent.length > 0 ? (
              resource.articleContent.map((paragraph, idx) => (
                <p key={idx} className="text-brown-800 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-brown-800 leading-relaxed">{resource.desc}</p>
            )}
          </div>
        )}

        {/* Course Completed Celebration */}
        {courseCompleted && (
          <div className="p-4 rounded-2xl bg-green-100/90 border border-green-500/30 text-center flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
              <Award size={20} />
            </div>
            <span className="text-sm font-bold text-brown-900">Sesi Edukasi Selesai!</span>
            <span className="text-xs text-brown-700">
              Zyba Score kamu meningkat untuk konsistensi perawatan diri hari ini.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
