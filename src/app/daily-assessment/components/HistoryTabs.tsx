"use client";

import React, { useState } from "react";

interface HistoryTabsProps {
    assessment: React.ReactNode;
    journal: React.ReactNode;
}

type Tab = "assessment" | "journal";

const TABS: { key: Tab; label: string }[] = [
    { key: "assessment", label: "Riwayat Assessment Harian" },
    { key: "journal", label: "Riwayat Health Journal" },
];

export default function HistoryTabs({ assessment, journal }: HistoryTabsProps) {
    const [tab, setTab] = useState<Tab>("assessment");

    return (
        <div className="glass-card rounded-3xl p-6 border border-brown-900/10 bg-white flex flex-col gap-5">
            <div role="tablist" className="flex gap-1 p-1 rounded-2xl bg-brown-900/5">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === t.key
                            ? "bg-white text-brown-900 shadow-sm"
                            : "text-brown-700/70 hover:text-brown-900"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel">{tab === "assessment" ? assessment : journal}</div>
        </div>
    );
}