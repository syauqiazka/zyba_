"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AIModelType } from "@/backend/ai/types";
import { LEGACY_MODEL_ALIAS_MAP } from "@/backend/ai/modelRegistry";

interface Props {
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
  dropDirection?: "up" | "down";
  plan?: "FREE" | "PLUS";
}

interface ModelOption {
  id: AIModelType;
  name: string;
  badge: string;
  desc: string;
  icon: string;
  tier: "FREE" | "PLUS" | "ALL";
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "gemini-flash-lite-latest",
    name: "Gemini Flash Lite",
    badge: "Rekomendasi",
    desc: "Model resmi Google, respons super cepat (sub-detik) & akurat",
    icon: "⚡",
    tier: "ALL",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini Flash",
    badge: "Stabil",
    desc: "Model Google untuk percakapan pendamping harian",
    icon: "✨",
    tier: "ALL",
  },
  {
    id: "openai/gpt-oss-20b",
    name: "Groq OSS 20B",
    badge: "Ultra Fast",
    desc: "Inference super cepat via Groq LPU hardware",
    icon: "⚡",
    tier: "ALL",
  },
  {
    id: "qwen/qwen3.8-27b",
    name: "Groq Qwen 27B",
    badge: "Logika & Code",
    desc: "Penalaran logika, terstruktur & coding via Groq",
    icon: "🧠",
    tier: "ALL",
  },
  {
    id: "ministral-8b-latest",
    name: "Ministral 8B",
    badge: "Reflektif",
    desc: "Model compact Mistral AI, terstruktur untuk refleksi",
    icon: "🌊",
    tier: "ALL",
  },
  {
    id: "gemma-4-31b-free",
    name: "Google Gemma 4 31B",
    badge: "Gratis",
    desc: "Open multimodal via OpenRouter free tier",
    icon: "💎",
    tier: "ALL",
  },
  {
    id: "nemotron-3-ultra-free",
    name: "NVIDIA Nemotron 3 Ultra",
    badge: "Frontier",
    desc: "NVIDIA reasoning frontier via OpenRouter free tier",
    icon: "🟢",
    tier: "ALL",
  },
  {
    id: "openai-premium",
    name: "GPT Premium",
    badge: "Plus",
    desc: "Inference prioritas OpenAI untuk pelanggan Zyba Plus",
    icon: "✨",
    tier: "PLUS",
  },
];

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  dropDirection = "up",
  plan = "FREE",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownPortalRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);

  // Normalisasi model ID lama jika ada di state
  const normalizedModelId: AIModelType = (LEGACY_MODEL_ALIAS_MAP[selectedModel] || selectedModel) as AIModelType;

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !dropdownPortalRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(320, Math.max(260, window.innerWidth - 16));
      const left = Math.min(
        Math.max(8, rect.right - width),
        Math.max(8, window.innerWidth - width - 8)
      );

      if (dropDirection === "up") {
        setDropdownPosition({
          bottom: Math.max(8, window.innerHeight - rect.top + 8),
          left,
          width,
        });
      } else {
        setDropdownPosition({
          top: Math.min(window.innerHeight - 8, rect.bottom + 8),
          left,
          width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    } else {
      setDropdownPosition(null);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, dropDirection]);

  // Pengguna PLUS dapat mengakses seluruh model. Pengguna FREE dapat mengakses model bertier ALL/FREE
  const planOptions = MODEL_OPTIONS.filter((m) =>
    plan === "PLUS" ? true : m.tier !== "PLUS"
  );

  const currentOption =
    planOptions.find((m) => m.id === normalizedModelId) ||
    MODEL_OPTIONS.find((m) => m.id === normalizedModelId) ||
    planOptions[0];

  const filteredOptions = planOptions.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left z-[60]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery("");
        }}
        className="bg-cream/50 border border-brown-900/15 rounded-full px-2.5 sm:px-3 py-1.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium flex items-center justify-between gap-1.5 cursor-pointer hover:bg-cream/80 transition-colors shadow-2xs shrink-0"
        title="Pilih Model AI"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-xs shrink-0">{currentOption.icon}</span>
        <span className="truncate max-w-[70px] xs:max-w-[95px] sm:max-w-[130px] font-bold text-brown-900">
          {currentOption.name}
        </span>
        <span className="text-[9px] text-brown-700/60 shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && dropdownPosition && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownPortalRef}
            style={{
              position: "fixed",
              top: dropdownPosition?.top,
              bottom: dropdownPosition?.bottom,
              left: dropdownPosition?.left,
              width: dropdownPosition?.width,
            }}
            className="fixed max-h-[min(70vh,520px)] overflow-hidden bg-white border-2 border-brown-900/15 rounded-2xl shadow-2xl z-[100] p-2.5 flex flex-col gap-1.5 animate-in fade-in duration-150"
          >
            {/* Header Popover */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-brown-900/10 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⚙️</span>
                <span className="text-[11px] font-extrabold text-brown-900">
                  Pilih Model Kecerdasan AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-brown-700/60 hover:text-brown-900 font-bold p-0.5 rounded-md hover:bg-brown-900/5 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search Filter Input */}
            <div className="relative px-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari model..."
                autoFocus
                className="w-full bg-cream/50 border border-brown-900/15 rounded-xl px-2.5 py-1.5 pl-7 text-xs text-brown-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium placeholder:text-brown-700/40"
              />
              <span className="absolute left-3 top-2 text-[10px] text-brown-700/50">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-[10px] text-brown-700/50 hover:text-brown-900 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto space-y-1 p-0.5 mt-1">
              {filteredOptions.length === 0 ? (
                <p className="text-xs text-brown-700/50 text-center py-4">
                  Model tidak ditemukan.
                </p>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = normalizedModelId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(opt.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-green-100 text-brown-900 font-bold border border-green-300/60 shadow-2xs"
                          : "text-brown-700 hover:bg-cream/70 hover:text-brown-900 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-base shrink-0 mt-0.5">
                          {opt.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-brown-900 truncate">
                              {opt.name}
                            </p>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                                opt.badge === "Plus" || opt.badge === "Rekomendasi"
                                  ? "bg-orange-100 text-orange-600 font-bold"
                                  : "bg-cream text-brown-700/70"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-brown-700/70 line-clamp-1 mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-green-600 font-bold text-sm ml-1 shrink-0 mt-0.5">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
