"use client";

interface TactilePebbleProps {
  type: "agate" | "jade" | "amber";
  className?: string;
}

export default function TactilePebble({ type, className = "w-16 h-14" }: TactilePebbleProps) {
  if (type === "agate") {
    // Red Agate / Terracotta pebble (Mood Sad / Warmth)
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`filter drop-shadow-[0_8px_16px_rgba(238,138,94,0.35)] select-none pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="agate-glow"
            cx="35%"
            cy="30%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFF2EB" />
            <stop offset="25%" stopColor="#F5A37A" />
            <stop offset="60%" stopColor="#EE8A5E" />
            <stop offset="85%" stopColor="#C45A2C" />
            <stop offset="100%" stopColor="#873514" />
          </radialGradient>
          <linearGradient id="agate-band" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="15%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="90%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
          <linearGradient id="agate-specular" x1="20%" y1="10%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Organic pebble body */}
        <path
          d="M20 45 C15 25, 32 10, 60 12 C82 14, 94 30, 88 52 C83 70, 62 76, 38 74 C24 72, 17 60, 20 45 Z"
          fill="url(#agate-glow)"
        />
        {/* Internal agate bands */}
        <path
          d="M24 43 C22 28, 36 16, 58 17 C76 19, 86 32, 82 48 C78 63, 60 69, 40 67 C28 65, 23 55, 24 43 Z"
          fill="url(#agate-band)"
          opacity="0.8"
        />
        <path
          d="M32 40 C30 28, 42 22, 56 23 C68 25, 74 34, 72 45 C69 55, 54 60, 42 58 C34 56, 31 49, 32 40 Z"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Soft specular light reflection */}
        <ellipse cx="42" cy="24" rx="14" ry="7" transform="rotate(-15 42 24)" fill="url(#agate-specular)" />
      </svg>
    );
  }

  if (type === "jade") {
    // Green Jade pebble (Vitality / Overjoyed)
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`filter drop-shadow-[0_8px_16px_rgba(40,70,45,0.4)] select-none pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="jade-glow"
            cx="40%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#E5F3D8" />
            <stop offset="30%" stopColor="#9EBE6C" />
            <stop offset="65%" stopColor="#55783A" />
            <stop offset="88%" stopColor="#2F4C20" />
            <stop offset="100%" stopColor="#1B3111" />
          </radialGradient>
          <linearGradient id="jade-specular" x1="25%" y1="15%" x2="60%" y2="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Organic rounded jade stone */}
        <path
          d="M26 38 C20 20, 42 12, 65 14 C86 16, 92 34, 88 54 C84 72, 58 75, 38 71 C22 67, 18 52, 26 38 Z"
          fill="url(#jade-glow)"
        />
        {/* Silky deep mineral textures */}
        <path
          d="M32 36 C30 24, 46 18, 62 20 C76 22, 82 35, 78 48 C74 61, 54 64, 40 61 C30 58, 28 46, 32 36 Z"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          fill="none"
        />
        {/* Polished highlight */}
        <ellipse cx="48" cy="25" rx="16" ry="8" transform="rotate(-10 48 25)" fill="url(#jade-specular)" />
      </svg>
    );
  }

  // Golden Amber / Tiger eye pebble (Mood Happy / Sun Warmth)
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_8px_16px_rgba(180,130,40,0.35)] select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="amber-glow"
          cx="38%"
          cy="32%"
          r="65%"
          fx="32%"
          fy="25%"
        >
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="25%" stopColor="#F5D86E" />
          <stop offset="55%" stopColor="#D99B26" />
          <stop offset="85%" stopColor="#9C620F" />
          <stop offset="100%" stopColor="#5E3804" />
        </radialGradient>
        <linearGradient id="amber-specular" x1="20%" y1="15%" x2="55%" y2="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Organic amber pebble */}
      <path
        d="M22 42 C16 24, 38 12, 62 13 C84 14, 91 32, 86 52 C81 70, 56 76, 36 71 C22 66, 17 56, 22 42 Z"
        fill="url(#amber-glow)"
      />
      {/* Warm mineral reflections */}
      <path
        d="M28 40 C25 28, 42 20, 58 21 C72 22, 79 34, 76 47 C72 58, 52 63, 38 60 C28 57, 26 48, 28 40 Z"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
      />
      {/* Specular highlight */}
      <ellipse cx="44" cy="24" rx="14" ry="7" transform="rotate(-12 44 24)" fill="url(#amber-specular)" />
    </svg>
  );
}

