"use client";

import React, { useState } from "react";
import { useCompanion } from "../context/CompanionContext";

export default function CompanionProjectsView() {
  const { setActiveSection, handleSendMessage } = useCompanion();
  const [projects, setProjects] = useState([
    {
      id: "proj-1",
      title: "Mindfulness & Breathing Mastery",
      desc: "Latihan pernapasan 4-4-4 teratur setiap pagi dan menjelang tidur.",
      progress: "5 dari 7 hari",
      tag: "Mental Health",
      lastActive: "Hari ini",
    },
    {
      id: "proj-2",
      title: "Sleep Routine Reset (23:00 Target)",
      desc: "Menghindari layar 30 menit sebelum tidur dan jadwal istirahat konsisten.",
      progress: "3 hari streak",
      tag: "Fisik & Tidur",
      lastActive: "Kemarin",
    },
    {
      id: "proj-3",
      title: "Manajemen Cemas & Ujian Semester",
      desc: "Memecah tugas besar menjadi sub-tugas kecil 25 menit (Pomodoro Wellness).",
      progress: "2 tugas selesai",
      tag: "Akademik",
      lastActive: "2 hari lalu",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    setProjects([
      {
        id: `proj-${Date.now()}`,
        title: newTitle,
        desc: newDesc || "Proyek wellness baru bersama Zyba.",
        progress: "Baru dimulai",
        tag: "Personal",
        lastActive: "Baru saja",
      },
      ...projects,
    ]);
    setNewTitle("");
    setNewDesc("");
    setIsCreating(false);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-6 border-b border-brown-900/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📁</span>
            <h1 className="font-serif font-bold text-2xl text-brown-900">
              Projects
            </h1>
          </div>
          <p className="text-xs text-brown-700/70">
            Kelola fokus wellness, target kebiasaan baik, dan program curhat bertopik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded-xl bg-orange-500 text-white text-xs font-bold px-4 py-2.5 hover:bg-orange-600 transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>+</span>
          <span>New Project</span>
        </button>
      </div>

      {/* Modal / Form create */}
      {isCreating && (
        <div className="my-6 p-5 rounded-2xl bg-white border border-orange-500/20 shadow-md animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-brown-900 mb-3">Buat Proyek Wellness Baru</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nama proyek (misal: Latihan Atasi Overthinking)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-brown-900/10 bg-cream/40 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <textarea
              placeholder="Deskripsi singkat atau tujuan..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-brown-900/10 bg-cream/40 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-brown-700 hover:bg-brown-900/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-500 text-white hover:bg-orange-600"
              >
                Simpan Proyek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-white border border-brown-900/8 shadow-2xs hover:shadow-sm hover:border-brown-900/20 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream text-brown-700">
                  {p.tag}
                </span>
                <span className="text-[10px] text-brown-700/50">{p.lastActive}</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-brown-900 mb-1.5 group-hover:text-orange-600 transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-brown-700/70 leading-relaxed mb-4">
                {p.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-brown-900/5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-green-600">
                ● {p.progress}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveSection("chat");
                  handleSendMessage(`Bantu aku melanjutkan progres pada proyek: "${p.title}"`);
                }}
                className="text-xs font-bold text-brown-900 hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <span>Bahas di Chat</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
