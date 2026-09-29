"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Headphones, Sparkles, Filter } from "lucide-react";
import ResourceCard, { ResourceItem } from "./components/ResourceCard";
import ResourcePlayerModal from "./components/ResourcePlayerModal";
import PaywallModal from "./components/PaywallModal";

const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "r-1",
    type: "COURSE",
    title: "Pengenalan Meditasi Mindfulness & Pernapasan Sadar",
    author: "dr. Amanda Lee, Sp.KJ",
    duration: "5:55 Menit",
    category: "Meditasi",
    isPro: false,
    iconName: "headphones",
    desc: "Panduan audio pernapasan mendalam untuk meredakan ketegangan fisik dan pikiran yang dipenuhi beban akademik serta pekerjaan.",
  },
  {
    id: "r-2",
    type: "ARTICLE",
    title: "Mengapa Kita Sering Overthinking? Memahami Cara Kerja Otak",
    author: "Tim Riset Klinis ZYBA",
    duration: "4 Menit Baca",
    category: "Psikologi",
    isPro: false,
    iconName: "brain",
    desc: "Memahami mekanisme amigdala saat menghadapi ketidakpastian dan cara mengalihkan fokus ke momen saat ini melalui grounding 5-4-3-2-1.",
    articleContent: [
      "Pikiran berlebih (overthinking) bukanlah kegagalan mental, melainkan respons alami evolusi otak ketika mendeteksi ketidakpastian. Amigdala memicu sinyal waspada, sementara korteks prefrontal mencoba menyusun skenario antisipasi secara terus-menerus.",
      "Kunci menghentikan lingkaran ini adalah teknik Grounding 5-4-3-2-1: Sebutkan 5 hal yang bisa kamu lihat, 4 hal yang bisa kamu sentuh, 3 hal yang bisa kamu dengar, 2 aroma yang bisa kamu cium, dan 1 rasa yang ada di mulutmu.",
      "Latihan ini memaksa otak sensorik mengambil alih energi dari lingkaran pikiran cemas, membantumu kembali hadir sepenuhnya di detik ini.",
    ],
  },
  {
    id: "r-3",
    type: "COURSE",
    title: "Pemulihan Insomnia & Relaksasi Deep Sleep Alami",
    author: "Institut Kualitas Tidur Nusantara",
    duration: "12:00 Menit",
    category: "Kualitas Tidur",
    isPro: true,
    iconName: "moon",
    desc: "Teknik gelombang suara Alpha dan relaksasi otot bertahap untuk memandu tubuh masuk ke fase tidur lelap (Deep Sleep) tanpa obat tidur.",
  },
  {
    id: "r-4",
    type: "ARTICLE",
    title: "Menghadapi Burnout & Tekanan Akademik Gen Z",
    author: "Prof. Handoko, M.Psi",
    duration: "6 Menit Baca",
    category: "Akademik & Karir",
    isPro: true,
    iconName: "graduation",
    desc: "Strategi manajemen energi dan teknik Pomodoro adaptif yang dirancang khusus untuk ritme belajar mahasiswa dan profesional muda.",
    articleContent: [
      "Burnout akademik kerap terjadi bukan karena kurangnya kecerdasan, melainkan karena batas antara jam belajar dan istirahat yang kabur di era digital.",
      "Gunakan teknik 50/10 Pomodoro Adaptif: 50 menit fokus tanpa notifikasi ponsel, diikuti 10 menit istirahat penuh tanpa menatap layar (jalan kaki singkat, peregangan, minum air).",
      "Ingatlah bahwa istirahat adalah bagian dari produktivitas itu sendiri, bukan hadiah yang harus kamu tukar dengan kelelahan ekstrem.",
    ],
  },
  {
    id: "r-5",
    type: "ARTICLE",
    title: "Self-Compassion: Berhenti Terlalu Menghakimi Diri Sendiri",
    author: "Rian Suryadi, M.Psi",
    duration: "5 Menit Baca",
    category: "Psikologi",
    isPro: false,
    iconName: "heart",
    desc: "Belajar menerima ketidaksempurnaan dengan kelembutan, serta mengubah suara kritik internal menjadi afirmasi suportif.",
    articleContent: [
      "Banyak dari kita terbiasa berbicara kepada diri sendiri dengan kata-kata yang tidak akan pernah kita ucapkan kepada sahabat terbaik.",
      "Self-compassion bukan berarti menyerah atau membenarkan kesalahan, melainkan memberi diri ruang aman untuk bertumbuh dari kesalahan tanpa rasa malu yang melumpuhkan.",
      "Latihan sederhana: ketika gagal, letakkan satu tangan di dada, rasakan kehangatannya, dan katakan: 'Ini memang saat yang berat, tapi aku sedang belajar dan aku pantas dihargai.'",
    ],
  },
  {
    id: "r-6",
    type: "COURSE",
    title: "Latihan Pernapasan Box Breathing 4-4-4-4 Menenangkan",
    author: "Zyba Wellness Audio Lab",
    duration: "4:30 Menit",
    category: "Meditasi",
    isPro: false,
    iconName: "headphones",
    desc: "Metode pernapasan terbukti klinis untuk menurunkan detak jantung dan meredakan kepanikan secara cepat kapan pun dibutuhkan.",
  },
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ARTICLE" | "COURSE" | "AUDIO">("ALL");
  const [resources, setResources] = useState<ResourceItem[]>(RESOURCES_DATA);
  const [loading, setLoading] = useState(false);
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        const res = await fetch("/api/resources");
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
  }, []);

  const filteredResources = resources.filter(
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
          <button
            type="button"
            onClick={() => setActiveFilter("COURSE")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFilter === "COURSE"
                ? "bg-brown-900 text-white shadow-sm"
                : "text-brown-700 hover:text-brown-900"
            }`}
          >
            <Sparkles size={13} />
            <span>Kursus ({resources.filter((r) => r.type === "COURSE").length})</span>
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

