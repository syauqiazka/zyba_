"use client";

import React from "react";

interface AssessmentNavProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: { title: string; desc: string }[];
}

export default function AssessmentNav({ currentStep, setCurrentStep, steps }: AssessmentNavProps) {
  return (
    <aside className="w-full lg:col-span-4 glass-card rounded-3xl p-4 sm:p-6 border border-brown-900/10 flex flex-col gap-4 bg-white/60">
      <div className="flex flex-col gap-1 mb-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
            Progress Assessment
          </span>
          <span className="text-xs font-bold text-brown-900">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step List (hidden on mobile, visible on lg:) */}
      <div className="hidden lg:flex flex-col gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <button
              type="button"
              key={s.title}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border text-left ${
                isActive
                  ? "bg-brown-900 text-white border-brown-900 shadow-sm"
                  : isPast
                  ? "bg-green-100/60 text-brown-900 border-green-500/30"
                  : "bg-cream/40 text-brown-700/60 border-transparent hover:bg-cream"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : isPast
                    ? "bg-green-500 text-white"
                    : "bg-brown-900/10 text-brown-700"
                }`}
              >
                {isPast ? "✓" : idx + 1}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{s.title}</span>
                <span className="text-[10px] opacity-80 truncate">{s.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Horizontal Pills (visible below lg:) */}
      <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {steps.map((s, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <button
              type="button"
              key={s.title}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${
                isActive
                  ? "bg-brown-900 text-white shadow-xs"
                  : isPast
                  ? "bg-green-100 text-green-700"
                  : "bg-cream/80 text-brown-700/60"
              }`}
            >
              {idx + 1}. {s.title}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
