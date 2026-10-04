"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Headphones, Sparkles, Filter } from "lucide-react";
import ResourceCard, { ResourceItem } from "./components/ResourceCard";
import { useFreshDataSignal } from "@/hooks/useFreshData";
import ResourcePlayerModal from "./components/ResourcePlayerModal";
import PaywallModal from "./components/PaywallModal";

const RESOURCES_DATA: ResourceItem[] = [];


export default function ResourcesPage() {
  const dataRefreshSignal = useFreshDataSignal();
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ARTICLE" | "COURSE" | "AUDIO">("ALL");
  const [resources, setResources] = useState<ResourceItem[]>(RESOURCES_DATA);
  const [loading, setLoading] = useState(false);
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [userPlan, setUserPlan] = useState<"FREE" | "PLUS">("FREE");

  useEffect(() => {
    async function loadUserPlan() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.user?.plan === "PLUS" ? "PLUS" : "FREE");
        }
      } catch {}
    }
    loadUserPlan();

    async function loadResources() {
      try {
        setLoading(true);
        const res = await fetch("/api/resources", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.resources && data.resources.length > 0) {
            const mapped: ResourceItem[] = data.resources.map((r: any) => {
              const paragraphs = r.body ? r.body.split("\n\n").filter(Boolean) : [];
              let iconName: any = "book";
              if (r.type === "COURSE") iconName = "headphones";
              if (r.type === "AUDIO") iconName = "music";
              if (r.title.toLowerCase().includes("tidur") || r.title.toLowerCase().includes("sleep")) iconName = "moon";
              if (r.title.toLowerCase().includes("akademik") || r.title.toLowerCase().includes("belajar")) iconName = "graduation";
              if (r.title.toLowerCase().includes("overthinking") || r.title.toLowerCase().includes("otak")) iconName = "brain";
              if (r.title.toLowerCase().includes("grounding") || r.title.toLowerCase().includes("napas")) iconName = "heart";

              let cat = "Edukasi";
              if (r.type === "AUDIO") cat = "Audio Ambient";
              else if (r.type === "COURSE") cat = "Kursus Audio";
              else if (r.title.toLowerCase().includes("akademik")) cat = "Akademik";
              else if (r.title.toLowerCase().includes("tidur")) cat = "Kualitas Tidur";
              else if (r.title.toLowerCase().includes("overthinking")) cat = "Psikologi";
              else if (r.title.toLowerCase().includes("grounding")) cat = "Relaksasi";
              else if (r.title.toLowerCase().includes("profesional")) cat = "Bantuan Klinis";
              else if (r.title.toLowerCase().includes("journaling")) cat = "Mindfulness";

              return {
                id: r.id,
                type: r.type,
                title: r.title,
                author: r.author || "Tim Zyba Wellness",
                duration: r.type === "ARTICLE" ? `${r.durationMin || 5} Menit Baca` : `${r.durationMin || 4}:00 Menit`,
                category: cat,
                isPro: r.isPro || false,
                iconName,
                desc: paragraphs[0] ? paragraphs[0].slice(0, 140) + "..." : "Sumber daya kesehatan mental ZYBA.",
                audioUrl: r.audioUrl,
                articleContent: paragraphs,
              };
            });
            setResources(mapped);
          }
        }
      } catch (err) {
        console.warn("[ResourcesPage] Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [dataRefreshSignal]);

  const filteredResources = resources.filter(
    (r) => activeFilter === "ALL" || r.type === activeFilter
  );

  const handleOpenResource = (r: ResourceItem) => {
    if (r.isPro && userPlan !== "PLUS") {
      setShowPaywallModal(true);
    } else {
      setActiveResource(r);
      setIsAudioPlaying(false);
      setCourseCompleted(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider">
              Koleksi Sumber Daya
            </span>
            <span className="text-xs text-brown-700 font-medium">
              Audio Meditasi & Artikel Mindfulness
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-brown-900 leading-snug">
            Sumber Daya Mindfulness untuk Ketenanganmu
          </h1>
          <p className="text-xs text-brown-700 mt-1.5 max-w-xl leading-relaxed">
            Perluas wawasan kesehatan mental dan tenangkan pikiran dengan koleksi artikel ilmu psikologi dan panduan audio dari pakar terpercaya.
          </p>
        </div>

        {/* Filter Tabs with Lucide Icons */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10 overflow-x-auto max-w-full no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFilter === "ALL"
                ? "bg-brown-900 text-white shadow-sm"
                : "text-brown-700 hover:text-brown-900"
            }`}
          >
            <Filter size={13} />
            <span>Semua ({resources.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("ARTICLE")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFilter === "ARTICLE"
                ? "bg-brown-900 text-white shadow-sm"
                : "text-brown-700 hover:text-brown-900"
            }`}
          >
            <BookOpen size={13} />
            <span>Artikel ({resources.filter((r) => r.type === "ARTICLE").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("AUDIO")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFilter === "AUDIO"
                ? "bg-brown-900 text-white shadow-sm"
                : "text-brown-700 hover:text-brown-900"
            }`}
          >
            <Headphones size={13} />
            <span>Audio Ambient ({resources.filter((r) => r.type === "AUDIO").length})</span>
          </button>
        </div>
      </div>

      {/* Resources Cards Grid (Multi-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredResources.map((item) => (
          <ResourceCard
            key={item.id}
            item={item}
            onClick={() => handleOpenResource(item)}
          />
        ))}
      </div>

      {/* RESOURCE PLAYER / DETAIL MODAL */}
      {activeResource && (
        <ResourcePlayerModal
          resource={activeResource}
          isAudioPlaying={isAudioPlaying}
          courseCompleted={courseCompleted}
          onPlayToggle={() => setIsAudioPlaying(!isAudioPlaying)}
          onComplete={() => {
            setIsAudioPlaying(false);
            setCourseCompleted(true);
          }}
          onClose={() => setActiveResource(null)}
        />
      )}

      {/* PRO PAYWALL MODAL */}
      <PaywallModal
        open={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgrade={() => {
          alert("Selamat! Kamu berhasil mengaktifkan fitur Zyba Plus.");
          setShowPaywallModal(false);
        }}
      />
    </div>
  );
}

