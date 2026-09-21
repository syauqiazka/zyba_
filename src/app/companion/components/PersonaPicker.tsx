"use client";

import React from "react";
import { PersonaId, COMPANION_PERSONAS } from "@/backend/ai/personas";

interface Props {
  selected: PersonaId;
  onChange: (p: PersonaId) => void;
}

// Warna kartu tetap palet ZYBA (AGENTS.md 3.1) — bukan skema warna baru per-hewan
const CARD_STYLE = "flex flex-col items-center gap-1 p-3 rounded-2xl cursor-pointer border-2 transition-all text-center";
const ACTIVE = "border-orange-500 bg-orange-100";
const INACTIVE = "border-brown-900/10 bg-white hover:bg-cream";

export default function PersonaPicker({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {(Object.values(COMPANION_PERSONAS) as typeof COMPANION_PERSONAS[PersonaId][]).map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={CARD_STYLE + " " + (selected === p.id ? ACTIVE : INACTIVE)}
          aria-pressed={selected === p.id}
        >
          <span className="text-3xl" role="img" aria-label={p.name}>{p.emoji}</span>
          <span className="text-xs font-bold text-brown-900">{p.name}</span>
          <span className="text-[10px] text-brown-700 leading-tight">{p.description}</span>
        </button>
      ))}
    </div>
  );
}
