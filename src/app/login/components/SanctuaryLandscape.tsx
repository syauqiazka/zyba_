"use client";

import React, { useEffect, useState } from "react";

export type TimePhase = "sunrise" | "day" | "sunset" | "night";

interface SanctuaryLandscapeProps {
  activePhase?: TimePhase;
  onPhaseChange?: (phase: TimePhase) => void;
  isAutoTime?: boolean;
  onToggleAuto?: (auto: boolean) => void;
}

export function getRealTimePhase(): TimePhase {
  if (typeof window === "undefined") return "day";
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "sunrise";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "sunset";
  return "night";
}

export default function SanctuaryLandscape({
  activePhase: controlledPhase,
  onPhaseChange,
  isAutoTime: controlledAuto,
  onToggleAuto,
}: SanctuaryLandscapeProps) {
  const [internalAuto, setInternalAuto] = useState(true);
  const [internalPhase, setInternalPhase] = useState<TimePhase>("day");

  const isAuto = controlledAuto !== undefined ? controlledAuto : internalAuto;
  const currentPhase = controlledPhase !== undefined ? controlledPhase : internalPhase;

  // Real-time synchronization
  useEffect(() => {
    const updateTime = () => {
      const realPhase = getRealTimePhase();
      if (isAuto) {
        if (onPhaseChange) onPhaseChange(realPhase);
        else setInternalPhase(realPhase);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [isAuto, onPhaseChange]);

  const isNight = currentPhase === "night";
  const isSunset = currentPhase === "sunset";
  const isSunrise = currentPhase === "sunrise";

  // Dynamic sky backgrounds
  const skyBackground = isNight
    ? "linear-gradient(180deg, #182229 0%, #222C33 45%, #2B3536 80%, #343E3B 100%)"
    : isSunset
    ? "linear-gradient(180deg, #E0855F 0%, #E9A37A 35%, #F6D6B6 70%, #F7F2E7 100%)"
    : isSunrise
    ? "linear-gradient(180deg, #F8D3B2 0%, #FBE9D4 45%, #FAF2E6 80%, #F7F2E7 100%)"
    : "linear-gradient(180deg, #EDF4EA 0%, #F7F5EE 50%, #F7F2E7 100%)";

  // Botanical Palette for Hills and Foliage
  const distantHillsFill = isNight
    ? "#1D2824"
    : isSunset
    ? "#86624C"
    : isSunrise
    ? "#978368"
    : "#7A9552";

  const midHillsFill = isNight
    ? "#24332D"
    : isSunset
    ? "#765842"
    : isSunrise
    ? "#8BA262"
    : "#8FAE5D";

  const foreHillsFill = isNight
    ? "#2A3C34"
    : isSunset
    ? "#684E3A"
    : isSunrise
    ? "#7E9656"
    : "#7D9D4F";

  const bunkerFill = isNight
    ? "#383633"
    : isSunset
    ? "#C29A78"
    : isSunrise
    ? "#D8C5A8"
    : "#E6D9BF";

  const foliageDark = isNight
    ? "#16221D"
    : isSunset
    ? "#4C3B2E"
    : isSunrise
    ? "#4D6038"
    : "#415529";

  const foliageMid = isNight
    ? "#1F2D26"
    : isSunset
    ? "#6A523C"
    : isSunrise
    ? "#688448"
    : "#597437";

  const foliageLight = isNight
    ? "#2B3C33"
    : isSunset
    ? "#866B4D"
    : isSunrise
    ? "#85A35E"
    : "#769549";

  const trunkColor = isNight
    ? "#24201A"
    : isSunset
    ? "#3B291F"
    : isSunrise
    ? "#423226"
    : "#3B2A20";

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000 ease-in-out"
      style={{ background: skyBackground }}
      aria-hidden="true"
    >
      {/* ── KEYFRAME STYLES (Gentle Botanical Swaying) ── */}
      <style>{`
        @keyframes gentleTreeSway {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(1.2deg); }
          100% { transform: rotate(-0.9deg); }
        }
        @keyframes foliageCanopySwayA {
          0% { transform: rotate(0deg) translate(0px, 0px); }
          50% { transform: rotate(2.4deg) translate(4px, -1px); }
          100% { transform: rotate(-1.8deg) translate(-3px, 1px); }
        }
        @keyframes foliageCanopySwayB {
          0% { transform: rotate(0deg) translate(0px, 0px); }
          50% { transform: rotate(-2.6deg) translate(-4px, 1px); }
          100% { transform: rotate(2deg) translate(3px, -1px); }
        }
        @keyframes windLeafDrift1 {
          0% { transform: translate(-30px, 0px) rotate(0deg); opacity: 0; }
          12% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { transform: translate(110vw, 80px) rotate(640deg); opacity: 0; }
        }
        @keyframes windLeafDrift2 {
          0% { transform: translate(-40px, 70px) rotate(30deg); opacity: 0; }
          15% { opacity: 0.75; }
          82% { opacity: 0.75; }
          100% { transform: translate(115vw, 170px) rotate(800deg); opacity: 0; }
        }
        @keyframes sunPulseSlow {
          0% { transform: scale(1); opacity: 0.92; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.92; }
        }
        @keyframes moonGlow {
          0% { filter: drop-shadow(0 0 16px rgba(244, 238, 223, 0.45)); }
          50% { filter: drop-shadow(0 0 28px rgba(244, 238, 223, 0.75)); }
          100% { filter: drop-shadow(0 0 16px rgba(244, 238, 223, 0.45)); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes fireflyFloat {
          0% { transform: translate(0px, 0px); opacity: 0.3; }
          50% { transform: translate(16px, -22px); opacity: 0.95; }
          100% { transform: translate(-12px, -10px); opacity: 0.4; }
        }
        @keyframes cloudDriftSlow {
          0% { transform: translateX(-5vw); }
          100% { transform: translateX(105vw); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sway-tree,
          .sway-foliage-a,
          .sway-foliage-b,
          .drift-leaf,
          .pulse-sun,
          .twinkle-star,
          .float-firefly,
          .drift-cloud {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── 1. CELESTIAL BODIES (Sun, Moon, Stars) ── */}
      {/* NIGHT SKY */}
      {isNight && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <div
            className="absolute left-[14%] sm:left-[20%] top-16 sm:top-20 z-0"
            style={{ animation: "moonGlow 5s ease-in-out infinite" }}
          >
            <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
              <path
                d="M75 18C52 23 40 44 45 68C48 81 57 91 68 96C42 98 18 80 14 54C10 28 28 6 54 2C62 1 70 6 75 18Z"
                fill="#FDF9ED"
                stroke="#E8DECA"
                strokeWidth="1.5"
              />
              <circle cx="36" cy="48" r="3" fill="#E8DECA" opacity="0.35" />
              <circle cx="48" cy="34" r="2.5" fill="#E8DECA" opacity="0.3" />
              <circle cx="46" cy="62" r="4" fill="#E8DECA" opacity="0.25" />
            </svg>
          </div>

          {[
            { top: "12%", left: "8%", delay: "0s", size: "2px" },
            { top: "16%", left: "35%", delay: "1.2s", size: "3px" },
            { top: "8%", left: "48%", delay: "0.6s", size: "2.5px" },
            { top: "20%", left: "65%", delay: "1.8s", size: "2px" },
            { top: "14%", left: "78%", delay: "0.4s", size: "3px" },
            { top: "26%", left: "88%", delay: "1.5s", size: "2px" },
            { top: "32%", left: "12%", delay: "2.1s", size: "2px" },
          ].map((st, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white twinkle-star"
              style={{
                top: st.top,
                left: st.left,
                width: st.size,
                height: st.size,
                boxShadow: "0 0 6px 1px rgba(255, 255, 255, 0.75)",
                animation: `starTwinkle 3.2s ease-in-out infinite alternate ${st.delay}`,
              }}
            />
          ))}

          {[
            { bottom: "28%", left: "22%", delay: "0s" },
            { bottom: "34%", left: "28%", delay: "1.4s" },
            { bottom: "22%", left: "74%", delay: "0.8s" },
            { bottom: "38%", left: "80%", delay: "2.1s" },
          ].map((ff, i) => (
            <div
              key={i}
              className="absolute rounded-full float-firefly"
              style={{
                bottom: ff.bottom,
                left: ff.left,
                width: "4px",
                height: "4px",
                background: "#E8C24A",
                boxShadow: "0 0 10px 3px rgba(232, 194, 74, 0.85)",
                animation: `fireflyFloat 6s ease-in-out infinite alternate ${ff.delay}`,
              }}
            />
          ))}
        </div>
      )}

      {/* SUNRISE (Fajar Golden Apricot) */}
      {isSunrise && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <div
            className="absolute left-[18%] sm:left-[24%] bottom-[34%] z-0 pulse-sun"
            style={{ animation: "sunPulseSlow 7s ease-in-out infinite" }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full blur-xl"
                style={{ background: "radial-gradient(circle, rgba(242, 136, 75, 0.65) 0%, rgba(248, 194, 74, 0.3) 50%, transparent 80%)" }}
              />
              <div
                className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-orange-400/40"
                style={{ background: "radial-gradient(circle, #FFE4B5 20%, #F2884B 90%)" }}
              />
            </div>
          </div>
          <div
            className="absolute bottom-[24%] left-0 right-0 h-24 opacity-45 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255, 235, 215, 0.55) 60%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* DAY SUN & CLOUDS */}
      {!isNight && !isSunrise && !isSunset && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <div
            className="absolute right-[16%] sm:right-[22%] top-14 sm:top-18 z-0 pulse-sun"
            style={{ animation: "sunPulseSlow 8s ease-in-out infinite" }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(232, 194, 74, 0.55) 0%, rgba(242, 136, 75, 0.18) 55%, transparent 75%)" }}
              />
              <div
                className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-amber-300/40"
                style={{ background: "radial-gradient(circle, #FFF4CC 10%, #E8C24A 85%)", boxShadow: "0 0 24px rgba(232, 194, 74, 0.5)" }}
              />
            </div>
          </div>

          <div
            className="absolute top-12 left-0 opacity-40 drift-cloud"
            style={{ animation: "cloudDriftSlow 75s linear infinite" }}
          >
            <svg width="180" height="45" viewBox="0 0 180 45" fill="none">
              <path
                d="M15 32 C15 22 28 14 42 16 C48 8 68 6 82 14 C92 7 114 8 124 16 C136 12 154 18 158 28 C168 28 174 36 166 42 C150 44 26 44 15 32 Z"
                fill="#FFFFFF"
                stroke="#3B2A20"
                strokeWidth="0.8"
                strokeOpacity="0.15"
              />
            </svg>
          </div>
        </div>
      )}

      {/* SUNSET (Senja) */}
      {isSunset && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
          <div
            className="absolute right-[22%] sm:right-[30%] bottom-[30%] z-0 pulse-sun"
            style={{ animation: "sunPulseSlow 6s ease-in-out infinite" }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(242, 136, 75, 0.8) 0%, rgba(217, 83, 79, 0.45) 55%, transparent 80%)" }}
              />
              <div
                className="absolute w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-orange-300/40"
                style={{ background: "radial-gradient(circle, #FFE7B8 15%, #F2884B 65%, #D9534F 95%)" }}
              />
            </div>
          </div>
          <div
            className="absolute bottom-[28%] left-0 right-0 h-20 opacity-60 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(242, 136, 75, 0.5) 50%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* ── 2. FLOATING WIND LEAVES ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-0 text-orange-500/70 drift-leaf"
          style={{ animation: "windLeafDrift1 14s cubic-bezier(0.25, 0.1, 0.25, 1) infinite" }}
        >
          <svg width="20" height="13" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2 8 C8 2 16 2 22 8 C16 14 8 14 2 8 Z" />
            <path d="M2 8 Q12 7 22 8" stroke="#3B2A20" strokeWidth="0.8" fill="none" opacity="0.4" />
          </svg>
        </div>
        <div
          className="absolute top-1/3 left-0 text-green-700/60 drift-leaf"
          style={{ animation: "windLeafDrift2 18s cubic-bezier(0.25, 0.1, 0.25, 1) 3s infinite" }}
        >
          <svg width="18" height="12" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2 8 C8 3 16 3 22 8 C16 13 8 13 2 8 Z" />
          </svg>
        </div>
      </div>

      {/* ── 3. BOTANICAL SKETCH LANDSCAPE (Hills, Trees, Dunes) ── */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full transition-colors duration-1000"
      >
        <defs>
          <pattern id="soilHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#3B2A20" strokeWidth="0.75" strokeOpacity="0.18" />
          </pattern>
          <pattern id="bunkerHatch" width="6" height="6" patternTransform="rotate(25 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3B2A20" strokeWidth="0.6" strokeOpacity="0.12" />
          </pattern>
          <pattern id="foliageHatch" width="4" height="4" patternTransform="rotate(-30 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#3B2A20" strokeWidth="0.5" strokeOpacity="0.18" />
          </pattern>
        </defs>

        {/* ── HORIZON RIDGE & DISTANT TREE LINE ── */}
        <g className="transition-all duration-1000">
          <path
            d="M0 580 C180 570 340 595 520 585 C700 575 880 590 1060 580 C1240 570 1380 590 1440 585 L1440 900 L0 900 Z"
            fill={distantHillsFill}
            opacity="0.85"
          />
          {[120, 260, 410, 560, 720, 890, 1040, 1190, 1340].map((x, i) => (
            <path
              key={i}
              d={`M${x - 20} 582 C${x - 20} 564 ${x - 8} 550 ${x} 550 C${x + 8} 550 ${x + 20} 564 ${x + 20} 582 Z`}
              fill={foliageDark}
              opacity="0.75"
              stroke="#2E241B"
              strokeWidth="0.75"
            />
          ))}
        </g>

        {/* ── MIDGROUND ROLLING GREEN (Fairway & Pin Flag) ── */}
        <g className="transition-all duration-1000">
          <path
            d="M0 635 C220 615 460 655 720 638 C980 620 1220 660 1440 642 L1440 900 L0 900 Z"
            fill={midHillsFill}
            stroke="#3B2A20"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <path
            d="M0 650 C220 630 460 670 720 653 C980 635 1220 675 1440 657 L1440 710 C1220 730 980 685 720 705 C460 725 220 680 0 700 Z"
            fill="url(#soilHatch)"
          />

          <g transform="translate(860, 600)">
            <line x1="0" y1="0" x2="0" y2="38" stroke="#3B2A20" strokeWidth="1.2" />
            <ellipse cx="0" cy="38" rx="3" ry="1" fill="#2E241B" />
            <path
              d="M0 0 L16 5 L0 10 Z"
              fill={isNight ? "#8B423B" : "#F2884B"}
              stroke="#3B2A20"
              strokeWidth="0.75"
            />
          </g>
        </g>

        {/* ── FOREGROUND CONTOURS & SAND BUNKER ── */}
        <g className="transition-all duration-1000">
          <path
            d="M680 735 C760 715 880 720 980 740 C1080 760 1180 755 1240 775 C1200 815 1080 835 940 830 C800 825 710 805 680 735 Z"
            fill={bunkerFill}
            stroke="#3B2A20"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M680 735 C760 715 880 720 980 740 C1080 760 1180 755 1240 775 C1220 782 1120 768 1020 754 C920 740 800 735 680 735 Z"
            fill="url(#bunkerHatch)"
          />

          <path
            d="M0 710 C180 690 380 725 580 740 C780 755 980 770 1200 765 C1320 762 1400 775 1440 780 L1440 900 L0 900 Z"
            fill={foreHillsFill}
            stroke="#3B2A20"
            strokeWidth="1.8"
            strokeOpacity="0.5"
          />
          <path
            d="M0 750 C180 730 380 765 580 780 C780 795 980 810 1200 805 C1320 802 1400 815 1440 820 L1440 860 L0 860 Z"
            fill="url(#soilHatch)"
          />
        </g>

        {/* ── RIGHT TREE GROVE ── */}
        <g transform="translate(1120, 560)">
          <g
            className="sway-tree"
            style={{
              transformOrigin: "70px 200px",
              animation: "gentleTreeSway 9s ease-in-out 1.2s infinite alternate",
            }}
          >
            <path
              d="M70 180 Q66 120 63 60 Q61 20 60 0"
              stroke={trunkColor}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="60" cy="20" rx="40" ry="24" fill={foliageDark} stroke="#2A2017" strokeWidth="1.2" />
            <ellipse cx="68" cy="2" rx="34" ry="20" fill={foliageMid} stroke="#2A2017" strokeWidth="1.2" />
            <ellipse cx="56" cy="-18" rx="26" ry="16" fill={foliageLight} stroke="#2A2017" strokeWidth="1.2" />
          </g>
        </g>

        {/* ── LEFT ICONIC SCOTCH PINE TREE (Proportioned to Reference Image) ── */}
        <g id="mainTreeContainer">
          {/* 1. Trunk & Branches (Swaying from base at x=230, y=720) */}
          <g
            className="sway-tree"
            style={{
              transformOrigin: "230px 720px",
              animation: "gentleTreeSway 8s ease-in-out infinite alternate",
            }}
          >
            {/* Trunk */}
            <path
              d="M230 720 C234 640 228 560 230 480"
              stroke={trunkColor}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M226 680 Q230 600 228 510"
              stroke="#1D150F"
              strokeWidth="1.4"
              strokeOpacity="0.45"
              fill="none"
            />
            <path
              d="M234 660 Q236 580 232 500"
              stroke="#1D150F"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              fill="none"
            />

            {/* Left Branches */}
            <path
              d="M230 480 C190 450 140 430 100 410"
              stroke={trunkColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M140 435 C115 415 80 405 50 400"
              stroke={trunkColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Branches */}
            <path
              d="M230 480 C270 450 320 430 360 410"
              stroke={trunkColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M310 435 C340 415 375 405 400 400"
              stroke={trunkColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Center Branch */}
            <path
              d="M230 480 C228 420 232 370 230 330"
              stroke={trunkColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M230 380 C210 345 185 325 160 310"
              stroke={trunkColor}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M230 375 C250 345 280 325 305 310"
              stroke={trunkColor}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 2. Foliage Umbrella Canopy Pads (Positioned accurately at branch ends & swaying) */}
          {/* Far Left Pad (at x=60, y=400) */}
          <g transform="translate(60, 400)">
            <g
              className="sway-foliage-a"
              style={{
                transformOrigin: "20px 10px",
                animation: "foliageCanopySwayA 4.8s ease-in-out infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="44" ry="20" fill={foliageDark} stroke="#22180F" strokeWidth="1.3" />
              <ellipse cx="4" cy="-4" rx="38" ry="17" fill={foliageMid} stroke="#22180F" strokeWidth="1.1" />
              <ellipse cx="8" cy="-8" rx="30" ry="13" fill={foliageLight} stroke="#22180F" strokeWidth="0.9" />
            </g>
          </g>

          {/* Lower Mid-Left Pad (at x=130, y=415) */}
          <g transform="translate(130, 415)">
            <g
              className="sway-foliage-b"
              style={{
                transformOrigin: "20px 10px",
                animation: "foliageCanopySwayB 5.2s ease-in-out 0.3s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="52" ry="24" fill={foliageDark} stroke="#22180F" strokeWidth="1.3" />
              <ellipse cx="5" cy="-5" rx="45" ry="20" fill={foliageMid} stroke="#22180F" strokeWidth="1.1" />
              <ellipse cx="10" cy="-10" rx="36" ry="15" fill={foliageLight} stroke="#22180F" strokeWidth="0.9" />
            </g>
          </g>

          {/* Far Right Pad (at x=390, y=400) */}
          <g transform="translate(390, 400)">
            <g
              className="sway-foliage-a"
              style={{
                transformOrigin: "-20px 10px",
                animation: "foliageCanopySwayA 5s ease-in-out 0.6s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="42" ry="19" fill={foliageDark} stroke="#22180F" strokeWidth="1.3" />
              <ellipse cx="4" cy="-4" rx="36" ry="16" fill={foliageMid} stroke="#22180F" strokeWidth="1.1" />
              <ellipse cx="8" cy="-8" rx="28" ry="12" fill={foliageLight} stroke="#22180F" strokeWidth="0.9" />
            </g>
          </g>

          {/* Lower Mid-Right Pad (at x=320, y=415) */}
          <g transform="translate(320, 415)">
            <g
              className="sway-foliage-b"
              style={{
                transformOrigin: "-20px 10px",
                animation: "foliageCanopySwayB 4.6s ease-in-out 0.9s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="50" ry="23" fill={foliageDark} stroke="#22180F" strokeWidth="1.3" />
              <ellipse cx="5" cy="-5" rx="43" ry="19" fill={foliageMid} stroke="#22180F" strokeWidth="1.1" />
              <ellipse cx="10" cy="-10" rx="34" ry="14" fill={foliageLight} stroke="#22180F" strokeWidth="0.9" />
            </g>
          </g>

          {/* Upper Left Dome Pad (at x=170, y=330) */}
          <g transform="translate(170, 330)">
            <g
              className="sway-foliage-a"
              style={{
                transformOrigin: "15px 15px",
                animation: "foliageCanopySwayA 5.4s ease-in-out 0.4s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="60" ry="28" fill={foliageDark} stroke="#22180F" strokeWidth="1.4" />
              <ellipse cx="6" cy="-6" rx="52" ry="24" fill={foliageMid} stroke="#22180F" strokeWidth="1.2" />
              <ellipse cx="12" cy="-12" rx="42" ry="18" fill={foliageLight} stroke="#22180F" strokeWidth="1" />
            </g>
          </g>

          {/* Upper Right Dome Pad (at x=290, y=330) */}
          <g transform="translate(290, 330)">
            <g
              className="sway-foliage-b"
              style={{
                transformOrigin: "-15px 15px",
                animation: "foliageCanopySwayB 5.6s ease-in-out 0.7s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="58" ry="27" fill={foliageDark} stroke="#22180F" strokeWidth="1.4" />
              <ellipse cx="6" cy="-6" rx="50" ry="23" fill={foliageMid} stroke="#22180F" strokeWidth="1.2" />
              <ellipse cx="12" cy="-12" rx="40" ry="17" fill={foliageLight} stroke="#22180F" strokeWidth="1" />
            </g>
          </g>

          {/* Grand Center Umbrella Crown Dome (at x=230, y=290) */}
          <g transform="translate(230, 290)">
            <g
              className="sway-foliage-a"
              style={{
                transformOrigin: "0px 20px",
                animation: "foliageCanopySwayA 6s ease-in-out 0.2s infinite alternate",
              }}
            >
              <ellipse cx="0" cy="0" rx="88" ry="38" fill={foliageDark} stroke="#22180F" strokeWidth="1.6" />
              <ellipse cx="6" cy="-8" rx="76" ry="32" fill={foliageMid} stroke="#22180F" strokeWidth="1.4" />
              <ellipse cx="12" cy="-16" rx="62" ry="25" fill={foliageLight} stroke="#22180F" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="88" ry="38" fill="url(#foliageHatch)" opacity="0.55" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
