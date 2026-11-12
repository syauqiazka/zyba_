"use client";

import React, { useEffect, useState } from "react";

export type TimePhase = "sunrise" | "day" | "sunset" | "night";

interface WatercolorBackgroundProps {
  phase: TimePhase;
  isNight: boolean;
}

const PHASES: Record<
  TimePhase,
  {
    image: string;
    fallbackBg: string;
    lightTint: string;
    lightPosition: string;
  }
> = {
  sunrise: {
    image: "/assets/sunrise.png",
    fallbackBg: "#F6E7D8",
    lightTint:
      "radial-gradient(circle at 45% 55%, rgba(254, 215, 170, 0.35) 0%, rgba(253, 186, 116, 0.15) 45%, transparent 75%)",
    lightPosition: "45% 55%",
  },
  day: {
    image: "/assets/day.png",
    fallbackBg: "#FAF6EE",
    lightTint:
      "radial-gradient(circle at 62% 28%, rgba(254, 240, 138, 0.28) 0%, rgba(253, 224, 71, 0.10) 45%, transparent 70%)",
    lightPosition: "62% 28%",
  },
  sunset: {
    image: "/assets/sunset.png",
    fallbackBg: "#DB8B6C",
    lightTint:
      "radial-gradient(circle at 45% 65%, rgba(251, 146, 60, 0.40) 0%, rgba(244, 63, 94, 0.18) 50%, transparent 75%)",
    lightPosition: "45% 65%",
  },
  night: {
    image: "/assets/night.png",
    fallbackBg: "#16212B",
    lightTint:
      "radial-gradient(circle at 58% 31%, rgba(186, 230, 253, 0.25) 0%, rgba(99, 102, 241, 0.10) 45%, transparent 70%)",
    lightPosition: "58% 31%",
  },
};

const PHASE_KEYS: TimePhase[] = ["sunrise", "day", "sunset", "night"];

export default function WatercolorBackground({ phase, isNight }: WatercolorBackgroundProps) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Preload all 4 images on mount to avoid flicker on initial load and crossfade
  useEffect(() => {
    let loadedCount = 0;
    const total = PHASE_KEYS.length;

    PHASE_KEYS.forEach((key) => {
      const img = new Image();
      img.src = PHASES[key].image;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= total) {
          setImagesPreloaded(true);
        }
      };
      img.onerror = () => {
        // Fallback gracefully even if image load errors
        loadedCount++;
        if (loadedCount >= total) {
          setImagesPreloaded(true);
        }
      };
    });
  }, []);

  const currentCfg = PHASES[phase];

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: currentCfg.fallbackBg }}
      aria-hidden="true"
    >
      {/* ── EMBEDDED CSS FOR DISPLACEMENT & AMBIENT ANIMATION ── */}
      <style>{`
        /* Gentle Drifting Ambient Light Overlay */
        @keyframes driftingLight {
          0% {
            transform: translate(-3%, -2%) scale(1);
          }
          50% {
            transform: translate(3%, 2%) scale(1.08);
          }
          100% {
            transform: translate(-2%, 4%) scale(0.98);
          }
        }

        /* Subtle Star Twinkles (Sky Only) */
        @keyframes starTwinkleGlow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.75);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.35);
          }
        }

        /* Soft Moon Halo Pulse */
        @keyframes moonHaloPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.12);
          }
        }

        /* Foliage & Grass Mask:
           Only affects right-side tree (x > 50%, y < 80%)
           and bottom grass (y > 58%).
           Leaves sky, center horizon, and card area completely still. */
        .foliage-grass-mask {
          mask-image:
            radial-gradient(ellipse 48% 68% at 84% 34%, black 35%, transparent 80%),
            linear-gradient(to top, black 0%, black 22%, transparent 45%);
          -webkit-mask-image:
            radial-gradient(ellipse 48% 68% at 84% 34%, black 35%, transparent 80%),
            linear-gradient(to top, black 0%, black 22%, transparent 45%);
          mask-composite: add;
          -webkit-mask-composite: source-over;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-drift-light,
          .animate-star-twinkle,
          .animate-moon-pulse,
          .displacement-layer {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {/* ── SVG FILTER DEFINITIONS (GENTLE 2-3px WIND DISPLACEMENT) ── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="windSwayDisplacement" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.016"
              numOctaves="2"
              seed="3"
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                dur="18s"
                values="0.010 0.014; 0.015 0.020; 0.012 0.017; 0.010 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="4.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ── BASE IMAGE LAYERS (Stacked, Fixed, Scale 1.04 to hide paper borders) ── */}
      {PHASE_KEYS.map((key) => {
        const isActive = phase === key;
        const cfg = PHASES[key];

        return (
          <div
            key={key}
            className="fixed inset-0 transition-opacity duration-[3000ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              willChange: "opacity",
            }}
          >
            {/* 1. Static crisp base image (ensures card and sky have zero blur or noise) */}
            <img
              src={cfg.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-bottom"
              style={{
                transform: "scale(1.04)",
                transformOrigin: "center bottom",
              }}
              loading="eager"
            />

            {/* 2. Masked duplicate layer with subtle wind displacement filter
                   (Only tree on right & grass at bottom sway 2-3px!) */}
            <div
              className="absolute inset-0 foliage-grass-mask displacement-layer pointer-events-none"
              style={{
                filter: "url(#windSwayDisplacement)",
              }}
            >
              <img
                src={cfg.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-bottom"
                style={{
                  transform: "scale(1.04)",
                  transformOrigin: "center bottom",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* ── SLOW DRIFTING LIGHT / CLOUD OVERLAY (Tints per phase over 75s) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-10 transition-all duration-[3000ms] ease-in-out animate-drift-light"
        style={{
          background: currentCfg.lightTint,
          animation: "driftingLight 75s ease-in-out infinite alternate",
          mixBlendMode: isNight ? "screen" : "soft-light",
          opacity: 0.85,
        }}
      />

      {/* ── NIGHT CELESTIAL AMBIANCE (Stars & Moon Glow) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-[3000ms] ease-in-out"
        style={{ opacity: isNight ? 1 : 0 }}
      >
        {/* Soft Moon Glow (Located at upper right: x: 58.5%, y: 31%) */}
        <div
          className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-moon-pulse"
          style={{
            left: "58.5%",
            top: "31%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(224, 242, 254, 0.20) 45%, transparent 75%)",
            boxShadow: "0 0 40px 18px rgba(255, 255, 255, 0.25)",
            animation: "moonHaloPulse 6s ease-in-out infinite",
          }}
        />

        {/* Twinkling Stars in Sky Area */}
        {[
          { top: "9%", left: "14%", delay: "0s", size: "2px" },
          { top: "14%", left: "24%", delay: "1.4s", size: "2.5px" },
          { top: "8%", left: "38%", delay: "0.6s", size: "2px" },
          { top: "18%", left: "46%", delay: "2.1s", size: "3px" },
          { top: "11%", left: "68%", delay: "1.1s", size: "2px" },
          { top: "16%", left: "76%", delay: "0.3s", size: "2.5px" },
          { top: "25%", left: "84%", delay: "1.8s", size: "2px" },
          { top: "22%", left: "18%", delay: "2.4s", size: "2px" },
          { top: "27%", left: "32%", delay: "0.9s", size: "2.5px" },
          { top: "12%", left: "91%", delay: "1.5s", size: "2px" },
        ].map((st, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-star-twinkle"
            style={{
              top: st.top,
              left: st.left,
              width: st.size,
              height: st.size,
              boxShadow: "0 0 5px 1px rgba(255, 255, 255, 0.85)",
              animation: `starTwinkleGlow 3.5s ease-in-out infinite alternate ${st.delay}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

