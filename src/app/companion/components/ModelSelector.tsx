"use client";

import React, { useState, useRef, useEffect } from "react";
import { AIModelType } from "@/backend/ai/aiModelManager";

interface Props {
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
  dropDirection?: "up" | "down";
}

interface ModelOption {
  id: AIModelType;
  name: string;
  badge: string;
  desc: string;
  icon: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    badge: "Default",
    desc: "Model terbaru Google, cerdas untuk long-horizon tasks",
    icon: "⚡",
  },
  {
    id: "llama-3.3-70b",
    name: "Groq Llama 3.3 70B",
    badge: "Ultra Fast",
    desc: "Inferensi kilat via Groq LPU",
    icon: "🦙",
  },
  {
    id: "nemotron-3-ultra",
    name: "NVIDIA Nemotron 3 Ultra",
    badge: "Gratis",
    desc: "55B MoE, reasoning frontier dari NVIDIA",
    icon: "🟢",
  },
  {
    id: "gemma-4-31b",
    name: "Google Gemma 4 31B",
    badge: "Gratis",
    desc: "Dense multimodal, 256K context",
    icon: "💎",
  },
];

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  dropDirection = "up",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside (sama persis gender/kota di signup)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentOption =
    MODEL_OPTIONS.find((m) => m.id === selectedModel) || MODEL_OPTIONS[0];

  const filteredOptions = MODEL_OPTIONS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button — Style sama persis dropdown gender/kota di signup ProfileSecurityFlow */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery("");
        }}
        className="bg-cream/50 border border-brown-900/15 rounded-full px-3 py-1.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium flex items-center justify-between gap-1.5 cursor-pointer hover:bg-cream/80 transition-colors shadow-2xs"
        title="Pilih Model AI"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-xs">{currentOption.icon}</span>
        <span className="truncate max-w-[130px] font-bold text-brown-900">
          {currentOption.name}
        </span>
        <span className="text-[9px] text-brown-700/60 shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Popover Dropdown (Membuka ke atas atau bawah sesuai posisi) */}
      {isOpen && (
        <div
          className={`absolute ${
            dropDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 w-72 sm:w-80 bg-white border-2 border-brown-900/15 rounded-2xl shadow-2xl z-50 p-2.5 flex flex-col gap-1.5 animate-in fade-in ${
            dropDirection === "up"
              ? "slide-in-from-bottom-2"
              : "slide-in-from-top-2"
          } duration-150`}
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
                const isSelected = selectedModel === opt.id;
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
                              opt.badge === "Pro" || opt.badge === "Rekomendasi"
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
        </div>
      )}
    </div>
  );
}
