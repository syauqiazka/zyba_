import Link from "next/link";

export default function LandingCta() {
  return (
    <section id="komunitas" className="bg-green-100 py-16 px-6 md:px-10 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-brown-900 leading-snug">
          Kamu nggak sendirian. ZYBA ada untuk dengarkan ceritamu.
        </h2>
        <p className="text-sm text-brown-700 mt-3 max-w-md">
          Mulai langkah kecilmu menuju kesehatan mental, fisik, dan sosial yang lebih seimbang hari ini.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 rounded-pill bg-brown-900 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          Gabung Gratis →
        </Link>
      </div>
    </section>
  );
}
