"use client";

import React from "react";

export default function CompilingState() {
  return (
    <div className="flex flex-col items-center justify-center my-auto text-center gap-4 py-12">
      <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      <h2 className="font-display font-extrabold text-2xl text-brown-900">
        Compiling Mental Health Metrics...
      </h2>
      <p className="text-xs text-brown-700 max-w-sm">
        Zyba AI sedang menganalisis jawabanmu untuk menghitung skor awal dan menyusun program rekomendasi harian.
      </p>
    </div>
  );
}
