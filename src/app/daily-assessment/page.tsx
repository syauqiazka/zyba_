"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyRecord, Pagination, DailyAssessmentForm } from "./components/DailyAssessmentForm";
import DailyAssessmentSummary from "./components/DailyAssessmentSummary";
import DailyAssessmentHistory from "./components/DailyAssessmentHistory";

type PageState = "loading" | "empty" | "form" | "summary";

export default function DailyAssessmentPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Tanggal hari ini dalam Bahasa Indonesia
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const loadData = useCallback(async (page = 1) => {
    try {
      setIsHistoryLoading(true);
      const res = await fetch(`/api/daily-assessment?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setTodayRecord(data.today);
      setHistory(data.history || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });

      // Tentukan state halaman
      if (data.hasCompletedToday) {
        setPageState("summary");
      } else {
        setPageState("empty");
      }
    } catch (err) {
      setPageState("empty");
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSubmit = async (formData: {
    mood: string;
    stressLevel: number;
    sleepRating: number | null;
    energyTags: string[];
    reflection: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/daily-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      if (data.isRisk) setCrisisAlert(true);

      // Reload data setelah submit
      await loadData(1);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Daily assessment submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadData(page);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream via-white to-orange-100/30 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-500 uppercase tracking-wider">
                Assessment Harian
              </span>
              <span className="text-xs text-brown-700">{todayFormatted}</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-brown-900">
              Evaluasi Kondisiku Hari Ini
            </h1>
            <p className="text-sm text-brown-700 mt-1 max-w-xl">
              Rekam kondisi harianmu secara lengkap — mood, stres, tidur, energi, dan refleksi — untuk memantau tren kesehatanmu dari waktu ke waktu.
            </p>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold shrink-0 ${
            pageState === "summary"
              ? "bg-green-100/60 border-green-500/30 text-green-600"
              : "bg-orange-100/60 border-orange-500/30 text-orange-600"
          }`}>
            <span>{pageState === "summary" ? "✅ Selesai hari ini" : "⏳ Belum diisi"}</span>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {savedSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-100/70 border border-green-500/30 rounded-2xl animate-in fade-in duration-300">
          <span className="text-xl">✅</span>
          <p className="text-sm font-bold text-brown-900">Assessment Harian berhasil disimpan!</p>
        </div>
      )}

      {/* Crisis alert */}
      {crisisAlert && (
        <div className="rounded-2xl p-5 bg-orange-50 border border-orange-500/30 flex items-start gap-4">
          <span className="text-2xl shrink-0">💛</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-brown-900 mb-1">Kami mendengarmu</p>
            <p className="text-xs text-brown-700 leading-relaxed">
              Sepertinya kamu sedang mengalami hal yang berat. Kamu tidak sendirian. Jika kamu butuh bantuan segera,
              hubungi <strong>Into The Light Indonesia di 119 ext 8</strong> (Hotline Kemenkes, 24 jam).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCrisisAlert(false)}
            className="text-brown-700 hover:text-brown-900 text-lg cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form or Summary */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-white">
            {pageState === "loading" && (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-6 w-48 bg-cream rounded" />
                <div className="grid grid-cols-5 gap-3">
                  {[1,2,3,4,5].map((i) => <div key={i} className="h-24 bg-cream rounded-2xl" />)}
                </div>
              </div>
            )}

            {pageState === "empty" && (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className="text-5xl">📋</div>
                <div>
                  <h2 className="font-display text-lg font-bold text-brown-900">Belum Ada Assessment Hari Ini</h2>
                  <p className="text-sm text-brown-700 mt-1">Mulai evaluasi harianmu sekarang.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPageState("form")}
                  className="bg-orange-500 hover:bg-brown-900 text-white font-bold text-sm px-8 py-3 rounded-full transition-colors shadow-md cursor-pointer"
                >
                  Mulai Assessment Harian →
                </button>
              </div>
            )}

            {pageState === "form" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-bold text-brown-900">
                    {todayRecord ? "Edit Assessment Harian" : "Assessment Harian Baru"}
                  </h2>
                  {pageState === "form" && todayRecord && (
                    <button
                      type="button"
                      onClick={() => setPageState("summary")}
                      className="text-xs text-brown-700 hover:text-brown-900 cursor-pointer"
                    >
                      ← Batal
                    </button>
                  )}
                  {pageState === "form" && !todayRecord && (
                    <button
                      type="button"
                      onClick={() => setPageState("empty")}
                      className="text-xs text-brown-700 hover:text-brown-900 cursor-pointer"
                    >
                      ← Batal
                    </button>
                  )}
                </div>
                <DailyAssessmentForm
                  isEdit={!!todayRecord}
                  initialValues={todayRecord || undefined}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {pageState === "summary" && todayRecord && (
              <div>
                <h2 className="font-display text-lg font-bold text-brown-900 mb-5">Ringkasan Hari Ini</h2>
                <DailyAssessmentSummary
                  record={todayRecord}
                  onEdit={() => setPageState("form")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 bg-white">
            <DailyAssessmentHistory
              history={history}
              pagination={pagination}
              onPageChange={handlePageChange}
              isLoading={isHistoryLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
