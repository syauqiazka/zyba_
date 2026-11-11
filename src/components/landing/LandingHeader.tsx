"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", href: "#" },
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Kata Mereka", href: "#testimoni" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-brown-900/10 py-3 shadow-2xs"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand with authentic ZYBA Floral Vector Mark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-extrabold text-lg text-brown-900 tracking-tight"
          aria-label="ZYBA Sanctuary"
        >
          <span className="w-8 h-8 rounded-xl bg-brown-900 text-cream flex items-center justify-center p-1.5 shadow-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-cream"
              aria-hidden="true"
            >
              <path
                d="M12 2a4 4 0 0 0-4 4v1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0 4.5-4.5V6a4 4 0 0 0-4-4z"
                fill="#8FAE5D"
              />
              <path
                d="M2 12a4 4 0 0 0 4 4h1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0-4.5-4.5H6a4 4 0 0 0-4 4z"
                fill="#F2884B"
              />
              <path
                d="M12 22a4 4 0 0 0 4-4v-1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0-4.5 4.5V18a4 4 0 0 0 4 4z"
                fill="#8FAE5D"
              />
              <path
                d="M22 12a4 4 0 0 0-4-4h-1.5A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0 4.5 4.5H18a4 4 0 0 0 4-4z"
                fill="#F2884B"
              />
              <circle cx="12" cy="12" r="2.5" fill="#FAF7F2" />
            </svg>
          </span>
          <span className="text-xl font-black tracking-tight text-brown-900 font-display">
            ZYBA
          </span>
        </Link>

        {/* Center Pill Nav (Matching Reference Image 2) */}
        <nav
          className="hidden md:flex items-center gap-1 bg-white/80 border border-brown-900/10 rounded-full p-1.5 shadow-2xs backdrop-blur-sm"
          aria-label="Navigasi utama"
        >
          <a
            href="#"
            className="px-4 py-1.5 rounded-full bg-[#344638] text-cream text-xs font-bold transition-all shadow-2xs"
          >
            Beranda
          </a>
          <a
            href="#fitur"
            className="px-4 py-1.5 rounded-full text-brown-700 hover:text-brown-900 hover:bg-cream/70 text-xs font-semibold transition-all"
          >
            Fitur
          </a>
          <a
            href="#cara-kerja"
            className="px-4 py-1.5 rounded-full text-brown-700 hover:text-brown-900 hover:bg-cream/70 text-xs font-semibold transition-all"
          >
            Cara Kerja
          </a>
          <a
            href="#testimoni"
            className="px-4 py-1.5 rounded-full text-brown-700 hover:text-brown-900 hover:bg-cream/70 text-xs font-semibold transition-all"
          >
            Kata Mereka
          </a>
        </nav>

        {/* Right Action Button */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-cream text-brown-900 border border-brown-900/15 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Masuk</span>
            <ArrowUpRight size={13} className="text-brown-700" />
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex px-4 sm:px-5 py-2 rounded-full bg-brown-900 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all items-center gap-1 cursor-pointer"
          >
            <span>Daftar</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
