"use client";

import React, { useState } from "react";
import {
  Eye,
  Hand,
  Ear,
  Flower2,
  Heart,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { notifyZybaDataChanged } from "@/hooks/useFreshData";

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroundingStep {
  number: number;
  sense: string;
  title: string;
  description: string;
  examples: string[];
  icon: React.ElementType;
  badgeBg: string;
  badgeColor: string;
  accentBorder: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    number: 5,
    sense: "Penglihatan",
    title: "Amati 5 hal yang kamu lihat di sekitarmu",
    description:
      "Perhatikan sekelilingmu dengan tenang. Temukan 5 objek atau warna fisik yang nyata, misalnya pola di dinding, cangkir, atau bayangan cahaya.",
    examples: [
      "Warna cangkir di mejamu",
      "Pola serat kayu atau lantai",
      "Cahaya matahari atau lampu",
      "Buku atau kertas di dekatmu",
      "Sepatu atau jam dinding",
    ],
    icon: Eye,
    badgeBg: "bg-green-100",
    badgeColor: "text-green-800",
    accentBorder: "border-green-500/30",
  },
  {
    number: 4,
    sense: "Sentuhan",
    title: "Rasakan 4 sensasi fisik pada kulitmu",
    description:
      "Bawa perhatianmu ke kontak fisik tubuhmu dengan dunia nyata. Sadari sentuhan yang sering kita abaikan.",
    examples: [
      "Kedua telapak kaki menapak di lantai",
      "Tekstur kain pakaian di kulitmu",
      "Permukaan meja yang sejuk atau hangat",
      "Hembusan udara atau napas lembut di bibir",
    ],
    icon: Hand,
    badgeBg: "bg-orange-100",
    badgeColor: "text-orange-800",
    accentBorder: "border-orange-500/30",
  },
  {
    number: 3,
    sense: "Pendengaran",
    title: "Dengarkan 3 suara lembut di sekitarmu",
    description:
      "Pejamkan mata sejenak jika nyaman. Buka telingamu untuk menangkap suara yang ada di kejauhan maupun di dekatmu.",
    examples: [
      "Desau angin atau kipas angin",
      "Suara langkah kaki atau kendaraan jauh",
      "Irama detak jam atau napasmu sendiri",
    ],
    icon: Ear,
    badgeBg: "bg-amber-100",
    badgeColor: "text-amber-800",
    accentBorder: "border-amber-500/30",
  },
  {
    number: 2,
    sense: "Penciuman",
    title: "Sadari 2 aroma di udara",
    description:
      "Tarik napas perlahan melalui hidung. Sadari aroma ruangan, minyak wangi, tanaman, atau cukup rasakan kesegaran udara yang masuk.",
    examples: [
      "Aroma minuman, teh, atau kopi",
      "Udara bersih sehabis hujan atau pengharum ruangan",
    ],
    icon: Flower2,
    badgeBg: "bg-cream",
    badgeColor: "text-brown-800",
    accentBorder: "border-brown-900/20",
  },
  {
    number: 1,
    sense: "Rasa & Syukur",
    title: "Rasakan 1 hal di lidah atau renungkan 1 hal yang kamu syukuri",
    description:
      "Basahi bibirmu atau rasakan sisa rasa air minum di mulut. Sebagai penutup, sebutkan satu hal kecil yang membuatmu merasa aman saat ini.",
    examples: [
      "Rasa segar segelas air putih",
      "Rasa syukur bahwa tubuhmu telah bertahan hingga hari ini",
    ],
    icon: Heart,
    badgeBg: "bg-mood-overjoyed/20",
    badgeColor: "text-green-800",
    accentBorder: "border-green-500/30",
  },
];

export default function GroundingModal({ isOpen, onClose }: GroundingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const currentStep = GROUNDING_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < GROUNDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleted(true);
    setIsSaving(true);
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BREATHING",
          durationMin: 2,
          points: 25,
          completed: true,
          title: "Kotak Tenang (Grounding 5-4-3-2-1)",
        }),
      });
      notifyZybaDataChanged();
    } catch (e) {
      console.warn("Failed to log grounding exercise:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-[24px] p-6 sm:p-8 shadow-2xl border border-brown-900/10 flex flex-col justify-between relative overflow-hidden transition-all">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-brown-900/8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-800 bg-green-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-700" />
                Kotak Tenang ZYBA
              </span>
              <span className="text-xs text-brown-700/60 font-medium">
                Metode Sensorik 5-4-3-2-1
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-brown-900 mt-2">
              {isCompleted ? "Tubuhmu Kembali Berlabuh" : "Meredakan Cemas & Panik"}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-cream hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup Kotak Tenang"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {isCompleted ? (
          <div className="py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-green-100 border border-green-500/30 text-green-700 flex items-center justify-center shadow-xs mb-4">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="font-display text-xl font-bold text-brown-900">
              Napasmu Kini Lebih Tenang
            </h3>

            <p className="text-xs sm:text-sm text-brown-700/80 max-w-md mt-2 leading-relaxed font-body">
              Kamu telah mengembalikan kesadaranmu ke saat ini. Pikiran yang kalut adalah gelombang sementara, sedangkan tubuhmu adalah jangkar yang kokoh.
            </p>

            <div className="mt-4 px-4 py-2 rounded-xl bg-cream/70 border border-brown-900/10 text-xs text-brown-800 font-semibold inline-flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />
              <span>Sesi tercatat • +25 Zyba Points tersimpan</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full border border-brown-900/15 bg-white text-brown-700 text-xs font-bold hover:bg-cream transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Ulangi Latihan</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-600 transition-colors shadow-2xs cursor-pointer"
              >
                Selesai &amp; Kembali
              </button>
            </div>
          </div>
        ) : (
          <div className="my-5 flex flex-col gap-4">
            {/* Progress Stepper Dots */}
            <div className="flex items-center justify-between gap-1.5 mb-1">
              {GROUNDING_STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <div
                    key={step.number}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-green-600"
                        : isPassed
                        ? "bg-green-300"
                        : "bg-brown-900/10"
                    }`}
                  />
                );
              })}
            </div>

            {/* Current Step Card */}
            <div className={`rounded-2xl border ${currentStep.accentBorder} bg-cream/30 p-5 sm:p-6 transition-all`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl ${currentStep.badgeBg} ${currentStep.badgeColor} flex items-center justify-center font-display font-extrabold text-base shadow-2xs`}>
                    {currentStep.number}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brown-700/70 block">
                      Langkah {5 - currentStep.number + 1} dari 5
                    </span>
                    <span className="font-display text-sm font-bold text-brown-900">
                      Pancaindra: {currentStep.sense}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white border border-brown-900/10 flex items-center justify-center text-brown-700">
                  <StepIcon size={16} strokeWidth={1.8} />
                </div>
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mt-2 leading-snug">
                {currentStep.title}
              </h3>

              <p className="text-xs sm:text-sm text-brown-700/80 mt-2 leading-relaxed font-body">
                {currentStep.description}
              </p>

              {/* Gentle physical examples */}
              <div className="mt-4 pt-3 border-t border-brown-900/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60 block mb-2">
                  Contoh hal yang bisa diamati:
                </span>
                <ul className="space-y-1.5 text-xs text-brown-800">
                  {currentStep.examples.map((ex, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-full border border-brown-900/15 text-brown-700 text-xs font-bold hover:bg-cream disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-600 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>
                  {currentStepIndex === GROUNDING_STEPS.length - 1
                    ? "Selesaikan Latihan"
                    : "Sudah Menemukan, Lanjut →"}
                </span>
                {currentStepIndex < GROUNDING_STEPS.length - 1 && <ArrowRight size={13} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

