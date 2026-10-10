"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Activity,
  ShieldAlert,
  Zap,
  Target,
  Info,
  Flame,
  MessageCircle,
  Lock,
} from "lucide-react";
import { PremiumWellnessInsights } from "@/lib/wellness/insightsService";

export default function PremiumInsightsPage() {
  const [data, setData] = useState<PremiumWellnessInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    setIsFreeUser(false);
    try {
      const res = await fetch("/api/premium/insights", {
        cache: "no-store",
        credentials: "include",
      });

      if (res.status === 403) {
        setIsFreeUser(true);
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal memuat data");
      }

      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-white/70" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-3xl bg-white/70" />
          <div className="h-48 animate-pulse rounded-3xl bg-white/70" />
        </div>
      </main>
    );
  }

  // TAMPILAN EDUKATIF & TRANSPARAN UNTUK PENGGUNA GRATIS
  if (isFreeUser) {
    return (
      <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link
            href="/wellness-journey"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brown-700/60 hover:text-brown-900 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Wellness Journey
          </Link>

          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-600 border border-orange-500/20">
                <Sparkles size={12} /> ZYBA Plus Deep Analytics
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
              Insight Wellness Dasar Sudah Tersedia Gratis
            </h1>

            <p className="mt-2 text-sm leading-6 text-brown-700">
              Di ZYBA, kami percaya kamu berhak melihat ringkasan data milikmu sendiri. Seluruh
              ringkasan skor, tren 7–90 hari, observasi perubahan, dan pengenalan pola kebiasaan
              dasar dapat kamu akses secara <strong>penuh dan gratis</strong> di halaman Wellness
              Journey.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-green-900">
                  Lihat data pribadimu tanpa biaya
                </p>
                <p className="text-[11px] text-green-800/80 mt-0.5">
                  Termasuk ringkasan skor mingguan, evaluasi stres, dan deteksi pola awal.
                </p>
              </div>
              <Link
                href="/wellness-journey"
                className="shrink-0 rounded-xl bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-xs font-bold transition-colors text-center"
              >
                Buka Wellness Journey →
              </Link>
            </div>

            {/* Perbandingan Nilai Tambah ZYBA Plus */}
            <div className="mt-8 pt-6 border-t border-brown-900/10">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-brown-700/60 mb-3">
                Nilai Tambah Eksklusif di ZYBA Plus
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 rounded-2xl bg-cream/70 border border-brown-900/5">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-1">
                    <TrendingUp size={15} />
                    <span>Analisis Longitudinal 90 Hari</span>
                  </div>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Evaluasi trajectory jangka panjang, indeks stabilitas emosi, dan perbandingan
                    multi-periode mendalam.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/70 border border-brown-900/5">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-1">
                    <Zap size={15} />
                    <span>Pemicu Stres & Recovery Boosters</span>
                  </div>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Analisis mendalam mengenai faktor yang memicu lonjakan stres dan kebiasaan yang
                    terbukti memulihkan energimu.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/70 border border-brown-900/5">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-1">
                    <Target size={15} />
                    <span>Adaptive 7-Day Recovery Plan</span>
                  </div>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Panduan terstruktur harian (Day 1 s/d Day 7) yang dirancang khusus menyesuaikan
                    ritme kelemahan dan kekuatanmu.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/70 border border-brown-900/5">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-1">
                    <Brain size={15} />
                    <span>Integrasi Memori Tanya Zyba</span>
                  </div>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Sinkronisasi konteks wellness langsung ke AI Companion sehingga sesi curhat
                    lebih berempati dan mengerti perjalananmu.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/settings/zyba-plus"
                className="w-full sm:w-auto rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-xs font-bold transition-colors text-center shadow-xs"
              >
                Tingkatkan ke ZYBA Plus
              </Link>
              <Link
                href="/wellness-journey"
                className="w-full sm:w-auto rounded-xl border border-brown-900/15 bg-white text-brown-900 hover:bg-cream px-5 py-2.5 text-xs font-bold transition-colors text-center"
              >
                Gunakan Fitur Gratis
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // JIKA TERJADI ERROR NETWORK ATAU SERVER
  if (error || !data) {
    return (
      <main className="min-h-screen bg-cream px-4 py-8">
        <div className="mx-auto max-w-md rounded-3xl border border-brown-900/10 bg-white p-7 text-center">
          <Sparkles className="mx-auto text-orange-500" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-brown-900">
            Kendala Memuat Insight
          </h1>
          <p className="mt-2 text-sm leading-6 text-brown-700">
            Terjadi kendala saat menyinkronkan data analitik. Silakan coba muat ulang.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={load}
              className="flex-1 rounded-xl bg-brown-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-brown-800 transition-colors"
            >
              <RefreshCw size={13} className="mr-1 inline" /> Coba Lagi
            </button>
            <Link
              href="/wellness-journey"
              className="flex-1 rounded-xl border border-brown-900/15 bg-white px-3 py-2.5 text-center text-xs font-bold text-brown-900 hover:bg-cream"
            >
              Wellness Journey
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const metric = (value: number | null, suffix = "") =>
    value === null ? "—" : `${value}${suffix}`;

  const hasPatterns = data.patterns.hasEnoughData && data.patterns.items.length > 0;

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/wellness-journey"
              className="inline-flex items-center gap-1 text-xs font-bold text-brown-700/60 hover:text-brown-900 transition-colors"
            >
              <ArrowLeft size={14} /> Wellness Journey
            </Link>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-500/20">
                ZYBA Plus
              </span>
              <span className="text-[10px] font-bold text-brown-700/50">
                Deep Wellness Analytics
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-brown-900">
              Personalized Wellness Analytics
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-6 text-brown-700">
              Analisis longitudinal mendalam, deteksi pemicu stres, dan rencana pemulihan 7 hari
              adaptif untuk akunmu.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-brown-700 shadow-2xs border border-brown-900/10">
              <CheckCircle2 size={12} className="text-green-600" />
              <span>{data.dataQuality.label} · {data.dataQuality.checkIns} check-in tercatat</span>
            </div>
          </div>

          <button
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brown-900/10 bg-white px-4 py-2.5 text-xs font-bold text-brown-900 hover:bg-cream transition-colors shadow-2xs"
          >
            <RefreshCw size={13} /> Perbarui Data
          </button>
        </header>

        {/* 1. Ringkasan 4 Kartu Metrik Utama */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Zyba Score Rata-rata", metric(data.summary.averageScore)],
            ["Mood Rata-rata", metric(data.summary.averageMood)],
            ["Tingkat Stres", metric(data.summary.averageStress, " / 5")],
            ["Kualitas Tidur", metric(data.summary.averageSleep, " / 5")],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-brown-900/10 bg-white p-4 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brown-700/50">
                {label}
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold text-brown-900">{value}</p>
            </div>
          ))}
        </section>

        {/* 2. Longitudinal Trajectory & Multi-Period Analysis (NILAI TAMBAH UTAMA) */}
        <section className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-brown-900/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <h2 className="font-display text-base font-extrabold text-brown-900 tracking-tight">
                  Longitudinal Trajectory & Evaluasi Periode
                </h2>
                <p className="text-xs text-brown-700/70">
                  Perbandingan tren stabilitas mental dalam rentang 30 hari ke belakang.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
              {data.longitudinalAnalysis.stabilityIndex}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.longitudinalAnalysis.periodBreakdown.map((period) => (
              <div key={period.label} className="p-4 rounded-2xl bg-cream/70 border border-brown-900/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">
                  {period.label}
                </p>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="font-display text-2xl font-extrabold text-brown-900">
                    {metric(period.avgScore)}
                  </span>
                  <span className="text-xs text-brown-700/70">
                    {period.checkIns} sesi tercatat
                  </span>
                </div>
                {period.avgStress !== null && (
                  <p className="text-[11px] text-brown-700/60 mt-1">
                    Rata-rata stres: {period.avgStress} / 5
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-brown-700 bg-cream/40 p-3.5 rounded-2xl border border-brown-900/5">
            {data.longitudinalAnalysis.stabilityDescription}
          </p>
        </section>

        {/* 3. Deep Triggers & Recovery Boosters */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Pemicu Stres */}
          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-brown-900/5">
              <ShieldAlert className="text-red-500" size={18} />
              <h2 className="font-display text-base font-extrabold text-brown-900">
                Deteksi Pemicu Stres (Stress Triggers)
              </h2>
            </div>
            <div className="mt-4 space-y-2.5">
              {data.deepTriggers.stressTriggers.map((trig, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-50/60 border border-red-200/50 text-xs leading-relaxed text-red-950"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>{trig}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Recovery Boosters */}
          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-brown-900/5">
              <Zap className="text-green-600" size={18} />
              <h2 className="font-display text-base font-extrabold text-brown-900">
                Pendorong Pemulihan (Recovery Boosters)
              </h2>
            </div>
            <div className="mt-4 space-y-2.5">
              {data.deepTriggers.recoveryBoosters.map((boost, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-green-50/60 border border-green-200/50 text-xs leading-relaxed text-green-950"
                >
                  <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                  <span>{boost}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* 4. Pattern Detection (DENGAN EMPTY STATE YANG JELAS & TIDAK KOSONG) */}
        <section className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-brown-900/5">
            <div className="flex items-center gap-2">
              <Activity className="text-orange-500" size={18} />
              <h2 className="font-display text-base font-extrabold text-brown-900">
                Pattern Detection
              </h2>
            </div>
            <span className="text-[10px] font-bold text-brown-700/50">
              Analisis Deterministik
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {!hasPatterns ? (
              <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 bg-cream/40 rounded-2xl border border-dashed border-brown-900/15">
                <Info size={20} className="text-orange-600" />
                <h3 className="text-xs font-bold text-brown-900">
                  Belum Cukup Data untuk Mengenali Pola
                </h3>
                <p className="text-xs text-brown-700/70 max-w-md leading-relaxed">
                  {data.patterns.emptyMessage}
                </p>
                <div className="mt-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Tercatat {data.patterns.dataPoints} dari minimal {data.patterns.minRequired} check-in
                </div>
              </div>
            ) : (
              data.patterns.items.map((pattern, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl bg-orange-50/70 border border-orange-200/50 p-3.5 text-xs leading-relaxed text-brown-800"
                >
                  <Sparkles size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>{pattern}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 5. Personalized Adaptive 7-Day Plan (Day 1 s/d Day 7) */}
        <section className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-brown-900/5">
            <Target className="text-orange-500" size={18} />
            <div>
              <h2 className="font-display text-base font-extrabold text-brown-900">
                Adaptive 7-Day Wellness Plan
              </h2>
              <p className="text-xs text-brown-700/70">
                Rencana adaptif bertahap yang disesuaikan dengan pola stres dan energimu.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.adaptivePlan.map((planItem) => (
              <article
                key={planItem.day}
                className="rounded-2xl bg-cream/70 border border-brown-900/5 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700">
                      Hari ke-{planItem.day}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-brown-900 leading-snug">
                    {planItem.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-brown-700">
                    {planItem.detail}
                  </p>
                </div>
                <p className="mt-3 text-[10px] text-brown-700/60 pt-2 border-t border-brown-900/5">
                  Alasan: {planItem.reason}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 6. Personalized Wellness Memory & Integrasi Tanya Zyba */}
        <section className="rounded-3xl border border-brown-900/10 bg-brown-900 p-6 text-white shadow-md">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Brain className="text-orange-400" size={20} />
            <div>
              <h2 className="font-display text-base font-extrabold">
                Integrasi Konteks Tanya Zyba (Companion)
              </h2>
              <p className="text-xs text-white/70">
                Konteks wellness ini siap dipakai oleh AI Companion agar percakapanmu lebih kontekstual.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {data.memory.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-white/90">
                <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-white/80 max-w-md">
              Ingin membahas rencana adaptif ini lebih lanjut? Tanya Zyba siap mendengarkan.
            </p>
            <Link
              href="/companion"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-xs shrink-0"
            >
              <MessageCircle size={14} />
              <span>Buka Tanya Zyba →</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
