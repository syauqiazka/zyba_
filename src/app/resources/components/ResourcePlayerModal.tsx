"use client";

import React from "react";
import {
  Play,
  Pause,
  CheckCircle2,
  Award,
  X,
  Clock,
  User,
  Volume2,
  BookOpen,
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
  return (
    <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-brown-900/10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-brown-900/8 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1.5">
              {resource.type === "COURSE" ? (
                <>
                  <Volume2 size={13} />
                  KURSUS AUDIO
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Resource Meta & Banner */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream border border-orange-500/20 text-brown-900 flex items-center justify-center shrink-0 shadow-sm">
            <ResourceIcon name={resource.iconName} className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-brown-900 leading-snug">
              {resource.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-brown-700">
              <User size={12} />
              <span>Oleh <strong className="font-semibold text-brown-900">{resource.author}</strong></span>
            </div>
          </div>
        </div>

        {/* Audio Player State if COURSE */}
        {resource.type === "COURSE" ? (
          <div className="bg-cream/70 p-6 rounded-2xl border border-brown-900/10 flex flex-col items-center gap-4 text-center shadow-inner">
            <span className="text-xs font-bold text-brown-900 flex items-center gap-2">
              <Volume2 size={14} className={isAudioPlaying ? "text-orange-500 animate-pulse" : "text-brown-700"} />
              {isAudioPlaying
                ? `Sedang Memutar: ${resource.title}`
                : "Sesi Audio Siap Diputar"}
            </span>
            <span className="font-display text-4xl font-extrabold text-brown-900 tracking-tight">
              {isAudioPlaying ? "05:55" : "00:00"}
            </span>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-brown-900/10 shadow-inner">
              <div
                className={`h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all ${
                  isAudioPlaying ? "w-full duration-[10000ms]" : "w-0"
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={onPlayToggle}
                className="px-6 py-2.5 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-md flex items-center gap-2"
              >
                {isAudioPlaying ? (
                  <>
                    <Pause size={14} /> Jeda Audio
                  </>
                ) : (
                  <>
                    <Play size={14} /> Putar Audio
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="px-5 py-2.5 rounded-full bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Selesaikan Sesi
              </button>
            </div>
          </div>
        ) : (
          /* Article Body Text */
          <div className="text-xs text-brown-900 leading-relaxed bg-cream/40 p-5 rounded-2xl border border-brown-900/10 max-h-[260px] overflow-y-auto space-y-3">
            {resource.articleContent && resource.articleContent.length > 0 ? (
              resource.articleContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  Pikiran berlebih (overthinking) terjadi ketika amigdala merespons potensi ancaman masa depan dengan mengaktifkan hormon stres kortisol secara berlebihan.
                </p>
                <p>
                  Dengan melatih kesadaran penuh (mindfulness), kita dapat mengaktifkan kembali korteks prefrontal untuk memproses emosi secara rasional dan menghentikan lingkaran kecemasan berulang.
                </p>
                <p className="font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-200">
                  💡 Tips Praktis: Ketika kamu mulai terjebak dalam siklus overthinking, tarik napas 4 detik, tahan 4 detik, dan hembuskan perlahan 6 detik. Fokuskan perhatianmu sepenuhnya pada sensasi fisik udara yang keluar.
                </p>
              </>
            )}
          </div>
        )}

        {/* Course Completed Celebration */}
        {courseCompleted && (
          <div className="p-4 rounded-2xl bg-green-100/90 border border-green-500/30 text-center flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
              <Award size={20} />
            </div>
            <span className="text-xs font-bold text-brown-900">Sesi Selesai!</span>
            <span className="text-[11px] text-brown-700">
              Zyba Score kamu meningkat +10 poin untuk konsistensi self-care hari ini.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
