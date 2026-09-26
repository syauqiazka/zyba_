"use client";

import { useState } from "react";
import ResourceCard from "./components/ResourceCard";
import ResourcePlayerModal from "./components/ResourcePlayerModal";
import PaywallModal from "./components/PaywallModal";

interface ResourceItem {
  id: string;
  type: "ARTICLE" | "COURSE";
  title: string;
  author: string;
  duration: string;
  category: string;
  isPro: boolean;
  coverEmoji: string;
  desc: string;
}

const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "r-1",
    type: "COURSE",
    title: "Mindfulness Meditation Intro",
    author: "Dr. Amanda Lee, M.Psi",
    duration: "05:55 Min",
    category: "Meditation",
    isPro: false,
    coverEmoji: "🧘‍♀️",
    desc: "Panduan audio pernapasan mendalam untuk meredakan ketegangan fisik dan pikiran yang dipenuhi beban akademik.",
  },
  {
    id: "r-2",
    type: "ARTICLE",
    title: "What is Life? Why Overthinking Occurs?",
    author: "Zyba Wellness Team",
    duration: "4 Min Read",
    category: "Psychology",
    isPro: false,
    coverEmoji: "📖",
    desc: "Memahami mekanisme biologis otak saat menghadapi ketidakpastian dan cara mengalihkan fokus ke momen saat ini.",
  },
  {
    id: "r-3",
    type: "COURSE",
    title: "Deep Sleep & Insomnia Recovery",
    author: "Sleep Specialist Inst.",
    duration: "12:00 Min",
    category: "Sleep",
    isPro: true,
    coverEmoji: "🌙",
    desc: "Teknik gelombang suara Alpha untuk membantu otak masuk ke fase tidur lelap (Deep Sleep) secara alami.",
  },
  {
    id: "r-4",
    type: "ARTICLE",
    title: "Navigating Gen Z Academic Pressure",
    author: "Prof. Handoko",
    duration: "6 Min Read",
    category: "Academic",
    isPro: true,
    coverEmoji: "🎓",
    desc: "Strategi manajemen waktu dan teknik Pomodoro adaptif yang dirancang khusus untuk ritme kerja mahasiswa.",
  },
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ARTICLE" | "COURSE">("ALL");
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const filteredResources = RESOURCES_DATA.filter(
    (r) => activeFilter === "ALL" || r.type === activeFilter
  );

  const handleOpenResource = (r: ResourceItem) => {
    if (r.isPro) {
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
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider">
              Our Resources
            </span>
            <span className="text-xs text-brown-700">Mindful Audio & Articles</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Mindful Resources That Make You Happy
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Perluas wawasan dan tenangkan pikiran dengan koleksi artikel ilmu psikologi dan audio meditasi dari pakar terpercaya.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10 overflow-x-auto max-w-full no-scrollbar shrink-0">
          {[
            { id: "ALL", label: "Semua" },
            { id: "ARTICLE", label: "Artikel 📖" },
            { id: "COURSE", label: "Audio Courses 🎧" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeFilter === tab.id
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid (Multi-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredResources.map((item) => (
          <ResourceCard key={item.id} item={item} onClick={() => handleOpenResource(item)} />
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
          alert("Selamat! Kamu mengaktifkan Zyba Plus.");
          setShowPaywallModal(false);
        }}
      />
    </div>
  );
}
