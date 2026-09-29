"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import BadgeLucideIcon from "./BadgeLucideIcon";

export interface BadgeOption {
  id?: string;
  key: string;
  title: string;
  description?: string;
  icon: string;
  badgeColor: string;
  badgeTextColor: string;
}

interface Props {
  slot: number;
  unlockedAchievements: BadgeOption[];
  currentBadgeKey?: string;
  onSelect: (key: string, customLabel?: string) => void;
  onClose: () => void;
}

const SLOT_LABELS = ["Slot 1", "Slot 2", "Slot 3"];

export default function BadgePickerModal({ slot, unlockedAchievements, currentBadgeKey, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState<string>(currentBadgeKey ?? "");
  const [customLabel, setCustomLabel] = useState("");
  const [search, setSearch] = useState("");

  const filtered = unlockedAchievements.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.key.includes(search)
  );

  const selectedDef = unlockedAchievements.find((a) => a.key === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-brown-900/15" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-brown-900/10 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-brown-900">Pilih Badge</h3>
            <p className="text-xs text-brown-700 mt-0.5">untuk {SLOT_LABELS[slot]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brown-900/8 hover:bg-brown-900/15 flex items-center justify-center text-brown-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-brown-900/8">
          <input
            type="text"
            placeholder="Cari badge…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-cream text-sm text-brown-900 placeholder-brown-700/40 outline-none border border-transparent focus:border-orange-300 transition-colors"
          />
        </div>

        {/* Badge Grid */}
        <div className="overflow-y-auto flex-1 p-4 grid grid-cols-3 gap-2.5 no-scrollbar">
          {filtered.length === 0 && (
            <div className="col-span-3 py-8 text-center text-sm text-brown-700/50">
              Tidak ada badge yang sesuai.
            </div>
          )}
          {filtered.map((ach) => (
            <button
              key={ach.key}
              onClick={() => setSelected(ach.key)}
              className={`rounded-2xl p-3.5 flex flex-col items-center gap-1.5 border-2 transition-all
                ${selected === ach.key
                  ? "border-orange-500 shadow-md scale-[1.02]"
                  : `border-transparent ${ach.badgeColor} hover:border-orange-200`
                } ${ach.badgeColor}`}
            >
              <BadgeLucideIcon name={ach.icon} className={`w-6 h-6 ${ach.badgeTextColor}`} />
              <span className={`text-[10px] font-bold text-center leading-tight ${ach.badgeTextColor}`}>
                {ach.title}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Label + Confirm */}
        {selectedDef && (
          <div className="px-6 py-4 border-t border-brown-900/10 space-y-3">
            <div>
              <label className="text-xs font-semibold text-brown-700 mb-1 block">
                Label kustom (opsional)
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder={selectedDef.title}
                maxLength={30}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream text-sm text-brown-900 placeholder-brown-700/40 outline-none border border-transparent focus:border-orange-300 transition-colors"
              />
            </div>

            {/* Preview */}
            <div className={`rounded-2xl p-3 flex items-center gap-3 ${selectedDef.badgeColor}`}>
              <BadgeLucideIcon name={selectedDef.icon} className={`w-7 h-7 flex-shrink-0 ${selectedDef.badgeTextColor}`} />
              <div>
                <div className={`text-xs font-bold ${selectedDef.badgeTextColor}`}>
                  {customLabel || selectedDef.title}
                </div>
                <div className="text-[10px] text-brown-700/60">{selectedDef.description}</div>
              </div>
            </div>

            <button
              onClick={() => onSelect(selected, customLabel || undefined)}
              className="w-full py-3 rounded-xl bg-brown-900 text-white text-sm font-bold hover:bg-brown-900/90 active:scale-[0.99] transition-all"
            >
              Pasang Badge →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
