"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  "Menyiapkan ruang tenang dan aman untukmu...",
  "Memuat data kesejahteraan emosional & fisik...",
  "Curhat → Solusi → Program → Aksi",
  "Napas perlahan... Zyba siap mendampingimu.",
];

export default function Loading() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full py-12 animate-in fade-in duration-300">
      {/* Brand Splash 4-Petal Floral Logomark (Orange & Green) */}
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute w-8 h-8 rounded-full bg-orange-500 -top-1 left-1/2 -translate-x-1/2 animate-ping opacity-75" />
        <div className="absolute w-8 h-8 rounded-full bg-green-500 -bottom-1 left-1/2 -translate-x-1/2 animate-ping opacity-75 delay-150" />
        <div className="absolute w-8 h-8 rounded-full bg-orange-500 -left-1 top-1/2 -translate-y-1/2 animate-ping opacity-75 delay-300" />
        <div className="absolute w-8 h-8 rounded-full bg-green-500 -right-1 top-1/2 -translate-y-1/2 animate-ping opacity-75 delay-500" />
        
        {/* Core Flower Logomark */}
        <div className="relative w-16 h-16 rounded-3xl bg-cream border border-orange-500/20 shadow-lg flex items-center justify-center z-10 animate-bounce">
          <div className="absolute w-5 h-5 rounded-full bg-orange-500 -top-1 left-1/2 -translate-x-1/2 shadow-xs" />
          <div className="absolute w-5 h-5 rounded-full bg-green-500 -bottom-1 left-1/2 -translate-x-1/2 shadow-xs" />
          <div className="absolute w-5 h-5 rounded-full bg-orange-500 -left-1 top-1/2 -translate-y-1/2 shadow-xs" />
          <div className="absolute w-5 h-5 rounded-full bg-green-500 -right-1 top-1/2 -translate-y-1/2 shadow-xs" />
          <div className="w-4 h-4 rounded-full bg-brown-900 z-20" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="font-display font-extrabold text-2xl tracking-tight text-brown-900">
          ZYBA
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">
          Gen Z Wellness Support
        </span>
      </div>

      {/* Rotating Quote */}
      <p className="text-xs font-semibold text-brown-700 max-w-xs text-center h-8 flex items-center justify-center transition-all duration-300">
        {QUOTES[quoteIndex]}
      </p>

      {/* Loading Progress Bar */}
      <div className="w-48 h-1.5 bg-cream rounded-full overflow-hidden border border-brown-900/10 mt-4 shadow-inner">
        <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full animate-pulse w-3/4 transition-all duration-500" />
      </div>
    </div>
  );
}
