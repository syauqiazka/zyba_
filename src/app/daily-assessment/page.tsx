"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyRecord, Pagination, DailyAssessmentForm } from "./components/DailyAssessmentForm";
import DailyAssessmentSummary from "./components/DailyAssessmentSummary";
import DailyAssessmentHistory from "./components/DailyAssessmentHistory";
import MoodBanner from "./components/MoodBanner";
import CalendarWidget from "./components/CalendarWidget";
import JournalHistory from "./components/JournalHistory";
import { useMoodOverview } from "./useMoodOverview";
import { MOODS } from "@/lib/moods";

type PageState = "loading" | "empty" | "form" | "summary";

export default function DailyAssessmentPage() {
  const { selectedMood, streak, calendarData, journalList, reload } = useMoodOverview();
  const [previewMood, setPreviewMood] = useState<(typeof MOODS)[number] | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saat mengisi form, banner mengikuti mood yang sedang dipilih.
  // Setelah tersimpan, banner memakai mood dari record hari ini.
  const bannerMood = pageState === "summary" ? selectedMood : previewMood ?? selectedMood;

  const handleMoodChange = (value: string) => {
    setPreviewMood(MOODS.find((m) => m.value === String(value).toUpperCase()) ?? null);
  };

  const loadData = useCallback(async (page = 1) => {
    try {
      setIsHistoryLoading(true);
      const clientDate = new Intl.DateTimeFormat("en-CA").format(new Date());
      const res = await fetch(`/api/daily-assessment?page=${page}&limit=10&date=${clientDate}`);
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

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const clientDate = new Intl.DateTimeFormat("en-CA").format(new Date());
      const res = await fetch("/api/daily-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, clientDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      if (data.isRisk) setCrisisAlert(true);

      // Reload data setelah submit
      await Promise.all([loadData(1), reload()]);
      setPreviewMood(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      console.error("Daily assessment submit error:", err);
      alert(err.message || "Gagal menyimpan assessment harian");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadData(page);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Banner gabungan: header + mood, warnanya ikut mood yang dipilih */}
      <MoodBanner
        selectedMood={bannerMood}
        streak={streak}
        status={pageState === "loading" ? undefined : { done: pageState === "summary" }}
      />

      {/* Success toast */}
      {savedSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-100/70 border border-green-500/30 rounded-2xl animate-in fade-in duration-300">
          <span className="text-xl">✅</span>
          <p className="text-sm font-bold text-brown-900">Assessment Harian berhasil disimpan dan skor ZYBA diperbarui!</p>
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
                  {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 bg-cream rounded-2xl" />)}
                </div>
              </div>
            )}

            {pageState === "empty" && (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className="text-5xl">📋</div>
                <div>
                  <h2 className="font-display text-lg font-bold text-brown-900">Belum Ada Assessment Hari Ini</h2>
                  <p className="text-sm text-brown-700 mt-1">Mulai evaluasi harian lengkapmu sekarang.</p>
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
                    Assessment Harian Hari Ini
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewMood(null);
                      setPageState("empty");
                    }}
                    className="text-xs text-brown-700 hover:text-brown-900 cursor-pointer"
                  >
                    ← Batal
                  </button>
                </div>
                <DailyAssessmentForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onMoodChange={handleMoodChange}
                />
              </div>
            )}

            {pageState === "summary" && todayRecord && (
              <div>
                <h2 className="font-display text-lg font-bold text-brown-900 mb-5">Ringkasan Hari Ini</h2>
                <DailyAssessmentSummary
                  record={todayRecord}
                  onEdit={() => { }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Calendar + History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CalendarWidget moodEntries={calendarData} />

          {/* Dua riwayat berdampingan dalam satu kartu, tepat di bawah kalender */}
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="min-w-0">
                <DailyAssessmentHistory
                  history={history}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  isLoading={isHistoryLoading}
                />
              </div>
              <div className="min-w-0 border-t pt-6 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6 border-brown-900/10">
                <JournalHistory embedded journalList={journalList} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}