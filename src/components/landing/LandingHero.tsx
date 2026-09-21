import Link from "next/link";

const STATS = [
  { value: "74,9jt", label: "Total Gen Z di Indonesia" },
  { value: "81,1%", label: "Pernah curhat ke AI" },
  { value: "100rb+", label: "Target pengguna terdaftar" },
  { value: "3", label: "Aspek: Mental, Fisik, Sosial" },
];

export default function LandingHero() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 pb-20 text-center flex flex-col items-center">
      <span className="inline-block rounded-pill bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1.5 mb-6 tracking-wide">
        GEN Z WELLNESS SUPPORT
      </span>

      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight max-w-3xl text-brown-900">
        Pendamping Kesehatan Mental, <span className="text-green-500">Fisik</span>, dan{" "}
        <span className="text-orange-500">Sosial</span> untuk Gen Z
      </h1>

      <p className="mt-6 text-brown-700 text-base md:text-lg max-w-xl leading-relaxed">
        Curhat, dapat solusi, ubah jadi program nyata — semua dalam satu ruang aman, privat, dan bebas dihakimi.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/login"
          className="rounded-pill bg-orange-500 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity shadow-md inline-block"
        >
          Mulai Sekarang →
        </Link>
        <a
          href="#fitur"
          className="rounded-pill border-2 border-brown-900/15 px-8 py-3.5 font-semibold hover:bg-white transition-colors inline-block"
        >
          Lihat Fitur
        </a>
      </div>

      {/* Stat Row */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="font-display font-bold text-3xl md:text-4xl text-brown-900">
              {s.value}
            </span>
            <span className="text-xs md:text-sm text-brown-700 mt-1 text-center font-medium">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
