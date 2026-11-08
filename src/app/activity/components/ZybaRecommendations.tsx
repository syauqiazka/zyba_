"use client";

export interface Recommendation {
  id: string;
  icon: string;
  title: string;
  duration: string;
  points: number;
  description: string;
}

interface ZybaRecommendationsProps {
  recommendations: Recommendation[];
  onAdd: (recommendation: Recommendation) => void;
}

export default function ZybaRecommendations({
  recommendations,
  onAdd,
}: ZybaRecommendationsProps) {
  return (
    <div className="xl:col-span-7 rounded-[20px] p-6 md:p-8 border border-brown-900/10 bg-white/95 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-700 bg-green-100 px-3 py-0.5 rounded-full">
            Rekomendasi Pemulihan
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-brown-900 mt-2">
            Pilih aktivitas yang paling nyaman hari ini
          </h2>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-cream text-brown-700 text-[10px] font-bold border border-brown-900/10">
          Saran Adaptif
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-6">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-brown-900/10 bg-cream/40 p-4 flex flex-col"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold text-orange-500">
                +{item.points} pts
              </span>
            </div>
            <h3 className="text-sm font-bold text-brown-900 mt-4">
              {item.title}
            </h3>
            <p className="text-[11px] text-brown-700 mt-1 leading-relaxed min-h-[48px]">
              {item.description}
            </p>
            <div className="flex items-center justify-between gap-2 mt-4">
              <span className="text-[10px] font-bold text-brown-700">
                {item.duration}
              </span>
              <button
                type="button"
                onClick={() => onAdd(item)}
                className="px-3 py-1.5 rounded-full bg-brown-900 text-white text-[10px] font-bold hover:bg-green-500 transition-colors"
              >
                + Tambahkan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
