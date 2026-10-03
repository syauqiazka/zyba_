`use client`;

import { useEffect, useState } from `react`;
import Link from `next/link`;
import { ArrowLeft, Brain, CheckCircle2, RefreshCw, Sparkles, TrendingUp } from `lucide-react`;

interface Insights {
  summary: {
    averageScore: number | null;
    averageMood: number | null;
    averageStress: number | null;
    averageSleep: number | null;
    checkIns: number;
    journals: number;
    completedActivities: number;
  };
  weekly: {
    score: number | null;
    scoreDelta: number | null;
    stress: number | null;
    stressDelta: number | null;
    strongestDay: string | null;
    focus: string;
  };
  patterns: string[];
  recommendations: string[];
  memory: string[];
}

export default function PremiumInsightsPage() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/premium/insights`, {
        cache: `no-store`,
        credentials: `include`,
      });
      if (!res.ok) throw new Error(`Premium required`);
      setData(await res.json());
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
          <div className="h-8 w-48 animate-pulse rounded-xl bg-white" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-cream px-4 py-8">
        <div className="mx-auto max-w-md rounded-3xl border border-brown-900/10 bg-white p-7 text-center">
          <Sparkles className="mx-auto text-orange-500" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-brown-900">Premium Insight</h1>
          <p className="mt-2 text-sm leading-6 text-brown-700">
            Fitur ini tersedia untuk Zyba Premium. Kalau kamu sudah berlangganan, coba muat ulang data.
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={load} className="flex-1 rounded-xl bg-brown-900 px-3 py-2.5 text-xs font-bold text-white">
              <RefreshCw size={13} className="mr-1 inline" /> Coba lagi
            </button>
            <Link href="/settings/zyba-plus" className="flex-1 rounded-xl bg-orange-500 px-3 py-2.5 text-center text-xs font-bold text-white">
              Upgrade
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const metric = (value: number | null, suffix = "") => value === null ? "—" : value + suffix;

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/wellness-journey" className="inline-flex items-center gap-1 text-xs font-bold text-brown-700/60 hover:text-brown-900">
              <ArrowLeft size={14} /> Wellness Journey
            </Link>
            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">Zyba Premium</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brown-900 sm:text-4xl">Wellness Insight</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brown-700">
              Ringkasan personal dari check-in, kebiasaan, jurnal, dan perkembangan wellness-mu.
            </p>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brown-900/10 bg-white px-4 py-2.5 text-xs font-bold text-brown-900">
            <RefreshCw size={13} /> Perbarui
          </button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Zyba Score", metric(data.summary.averageScore)],
            ["Mood", metric(data.summary.averageMood)],
            ["Stres", metric(data.summary.averageStress, " / 5")],
            ["Tidur", metric(data.summary.averageSleep, " / 5")],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-brown-900/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brown-700/50">{label}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-brown-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-700" size={18} />
              <h2 className="font-display text-lg font-extrabold text-brown-900">Weekly Insight</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-cream p-4">
                <p className="text-[10px] text-brown-700/50">Score 7 hari</p>
                <p className="mt-1 text-xl font-extrabold text-brown-900">{metric(data.weekly.score)}</p>
                <p className="text-[10px] text-brown-700/60">
                  {data.weekly.scoreDelta === null ? "Belum cukup data" : (data.weekly.scoreDelta >= 0 ? "+" : "") + data.weekly.scoreDelta + " vs minggu sebelumnya"}
                </p>
              </div>
              <div className="rounded-2xl bg-cream p-4">
                <p className="text-[10px] text-brown-700/50">Stres 7 hari</p>
                <p className="mt-1 text-xl font-extrabold text-brown-900">{metric(data.weekly.stress, " / 5")}</p>
                <p className="text-[10px] text-brown-700/60">
                  {data.weekly.stressDelta === null ? "Belum cukup data" : (data.weekly.stressDelta >= 0 ? "+" : "") + data.weekly.stressDelta + " vs minggu sebelumnya"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-brown-700">
              Fokus minggu ini: <strong>{data.weekly.focus}</strong>
              {data.weekly.strongestDay ? " · Hari dengan skor tertinggi: " + data.weekly.strongestDay : ""}
            </p>
          </article>

          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Brain className="text-purple-600" size={18} />
              <h2 className="font-display text-lg font-extrabold text-brown-900">Personalized Wellness Memory</h2>
            </div>
            <div className="mt-4 space-y-2.5">
              {data.memory.map((item) => (
                <div key={item} className="flex gap-2.5 rounded-2xl bg-cream p-3 text-xs leading-5 text-brown-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-green-700" size={15} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-brown-700/50">
              Memory ini diringkas dari data wellness di akunmu, bukan diagnosis medis.
            </p>
          </article>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-brown-900">Pattern Detection</h2>
            <div className="mt-4 space-y-3">
              {data.patterns.map((pattern) => (
                <p key={pattern} className="rounded-2xl bg-orange-50 p-3 text-xs leading-5 text-brown-700">{pattern}</p>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-brown-900">Personalized Recommendations</h2>
            <div className="mt-4 space-y-3">
              {data.recommendations.length ? data.recommendations.map((item) => (
                <div key={item} className="flex gap-2.5 rounded-2xl bg-green-50 p-3 text-xs leading-5 text-brown-700">
                  <Sparkles className="mt-0.5 shrink-0 text-green-700" size={15} />
                  <span>{item}</span>
                </div>
              )) : (
                <p className="rounded-2xl bg-cream p-3 text-xs leading-5 text-brown-700">
                  Tambahkan beberapa check-in lagi agar rekomendasi lebih personal.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-4 rounded-3xl border border-brown-900/10 bg-brown-900 p-5 text-white sm:p-6">
          <h2 className="font-display text-lg font-extrabold">Personalized Plan</h2>
          <p className="mt-1 text-xs leading-5 text-white/60">
            Gunakan insight ini sebagai konteks saat meminta rencana personal dari Companion.
          </p>
          <Link href="/companion" className="mt-4 inline-flex rounded-2xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-400">
            Buat rencana lewat Companion →
          </Link>
        </section>
      </div>
    </main>
  );
}
