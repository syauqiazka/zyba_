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

interface ResourceCardProps {
  item: ResourceItem;
  onClick: () => void;
}

export default function ResourceCard({ item, onClick }: ResourceCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-card glass-card-hover rounded-3xl p-6 border border-brown-900/10 cursor-pointer flex flex-col justify-between bg-white group relative overflow-hidden"
    >
      {item.isPro && (
        <span className="absolute top-4 right-4 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
          PRO ⚡
        </span>
      )}

      <div>
        <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
          {item.coverEmoji}
        </div>
        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
          {item.category} • {item.duration}
        </span>
        <h3 className="font-display font-bold text-base text-brown-900 mt-1 group-hover:text-orange-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-brown-700 mt-2 leading-relaxed">
          {item.desc}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-brown-900/10 text-xs font-bold text-brown-900">
        <span className="text-brown-700 font-medium">Oleh {item.author}</span>
        <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
          {item.type === "COURSE" ? "Mulai Audio →" : "Baca Artikel →"}
        </span>
      </div>
    </div>
  );
}
