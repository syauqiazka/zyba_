"use client";

import React from "react";

interface AssessmentNavProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: { title: string; desc: string }[];
}

export default function AssessmentNav({ currentStep, setCurrentStep, steps }: AssessmentNavProps) {
  return (
    <div className="col-span-4 glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">
          Progress Assessment
        </span>
        <div className="w-full h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-brown-900 text-right mt-0.5">
          {Math.round(((currentStep + 1) / 10) * 100)}%
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <div
              key={s.title}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border ${
                isActive
                  ? "bg-brown-900 text-white border-brown-900 shadow-sm"
                  : isPast
                  ? "bg-green-100/60 text-brown-900 border-green-500/30"
                  : "bg-cream/40 text-brown-700/60 border-transparent"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
