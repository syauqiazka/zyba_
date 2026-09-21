"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Fitur", href: "#fitur", section: "fitur" },
  { label: "Tentang", href: "#tentang", section: "tentang" },
  { label: "Komunitas", href: "#komunitas", section: "komunitas" },
];

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Scroll listener: sticky state + active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 48);

      const idx = NAV_ITEMS.findIndex(({ section }) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      setActiveIndex(idx >= 0 ? idx : null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute sliding pill position whenever active/hover changes
  const displayIndex = hoverIndex ?? activeIndex;

  useEffect(() => {
    const el = displayIndex !== null ? itemRefs.current[displayIndex] : null;
    const nav = navRef.current;
    if (!el || !nav) {
      setPillStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setPillStyle({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  }, [displayIndex]);

  const NavPill = ({ className = "" }: { className?: string }) => (
    <div
      ref={navRef}
      className={`relative flex items-center bg-white/80 backdrop-blur-sm border border-brown-900/10 shadow-sm rounded-full px-1.5 py-1 ${className}`}
    >
      {/* Sliding background indicator */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 bg-brown-900 rounded-full pointer-events-none"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          opacity: pillStyle.opacity,
          transition: "left 220ms cubic-bezier(0.16,1,0.3,1), width 220ms cubic-bezier(0.16,1,0.3,1), opacity 160ms ease",
        }}
      />
      {NAV_ITEMS.map(({ label, href }, i) => (
        <a
          key={href}
          ref={(el) => { itemRefs.current[i] = el; }}
          href={href}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => setActiveIndex(i)}
          className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 select-none ${
            displayIndex === i ? "text-cream" : "text-brown-700"
          }`}
        >
          {label}
        </a>
      ))}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-cream/82 backdrop-blur-md border-b border-brown-900/10 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-2xl bg-cream border border-orange-500/20 shadow-sm group-hover:scale-105 transition-transform">
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="w-2 h-2 rounded-full bg-brown-900 z-10" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight text-brown-900">
            ZYBA
          </span>
        </Link>

        {/* Nav pill — selalu di tengah, sejajar logo & CTA */}
        <NavPill className="hidden md:flex" />

        {/* CTA */}
        <Link
          href="/login"
          className="shrink-0 rounded-pill bg-brown-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-orange-500 transition-colors shadow-sm inline-block"
        >
          Masuk / Daftar
        </Link>
      </div>
    </header>
  );
}
