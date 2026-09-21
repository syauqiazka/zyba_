const FEATURES = [
  {
    title: "Zyba Companion",
    desc: "Curhat kapan saja ke AI companion yang mendengarkan tanpa menghakimi.",
    icon: "💬",
    href: "/companion",
  },
  {
    title: "Mood Check-In",
    desc: "Catat mood harianmu, ZYBA bantu kenali pola dan beri insight.",
    icon: "🙂",
    href: "/mood-check-in",
  },
  {
    title: "Smart Activity Planner",
    desc: "Program aktivitas fisik sederhana yang disesuaikan kondisimu.",
    icon: "⚡",
    href: "/activity",
  },
  {
    title: "Zyba Community",
    desc: "Ruang aman berbagi cerita dengan sesama Gen Z, privasi terjaga.",
    icon: "🤝",
    href: "/community",
  },
];

export default function LandingFeatures() {
  return (
    <section id="fitur" className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
          Fitur Unggulan
        </span>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-brown-900 mt-1">
          Didesain Khusus Menjawab Kebutuhan Gen Z
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-6 border border-brown-900/10 flex flex-col gap-3 hover:border-orange-500/40 hover:shadow-md transition-all"
          >
            <span className="text-3xl" aria-hidden="true">
              {f.icon}
            </span>
            <h3 className="font-display font-semibold text-lg text-brown-900">
              {f.title}
            </h3>
            <p className="text-sm text-brown-700 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
