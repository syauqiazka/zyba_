export default function LandingAbout() {
  return (
    <section id="tentang" className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-brown-900/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
            Tentang ZYBA
          </span>
          <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-brown-900">
            Alur Inti: Curhat → Solusi → Program → Aksi
          </h2>
          <p className="mt-4 text-sm text-brown-700 leading-relaxed">
            ZYBA memadukan AI empatik dan rencana aksi terstruktur. Mulai dari obrolan curhat harian yang aman tanpa stigma, pelacakan suasana hati harian, penyusunan kebiasaan positif dan aktivitas fisik terukur, hingga ruang komunitas yang saling menguatkan.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl border border-brown-900/10">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="font-bold text-sm text-brown-900">100% Privat & Aman</p>
              <p className="text-xs text-brown-700">Data kesehatan mentalmu tersimpan aman</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl border border-brown-900/10">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold text-sm text-brown-900">Bebas Dihakimi</p>
              <p className="text-xs text-brown-700">Ruang bercerita terbuka dan suportif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
