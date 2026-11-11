import Link from "next/link";
import { ShieldCheck, PhoneCall, HeartHandshake, ArrowRight, Heart } from "lucide-react";

export default function SidebarInfo() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-5">
      {/* ── Aturan Ruang Aman Komunitas ── */}
      <div className="rounded-[20px] p-5 sm:p-6 border border-brown-900/10 bg-white/95 shadow-xs flex flex-col gap-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-brown-900/5">
          <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900">
              Lingkar Aman Komunitas
            </h3>
            <span className="text-[10px] text-brown-700/60 block">
              Prinsip saling merangkul &amp; menjaga
            </span>
          </div>
        </div>

        <ul className="text-xs text-brown-700/80 flex flex-col gap-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span><strong>Dengarkan tanpa menghakimi:</strong> Setiap perasaan valid dan layak didengar.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span><strong>Beri pelukan empati:</strong> Gunakan tombol <em>Pelukan</em> untuk menguatkan sesama.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span><strong>Bukan pengganti medis:</strong> Untuk diagnosa klinis, hubungi tenaga profesional.</span>
          </li>
        </ul>
      </div>

      {/* ── Hotline Krisis Sejiwa 119 Card (Empathetic Sanctuary Support) ── */}
      <div className="rounded-[20px] p-5 sm:p-6 border border-orange-500/20 bg-orange-100/35 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <PhoneCall size={15} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900">
              Butuh Teman Bicara Segera?
            </h3>
            <span className="text-[10px] text-orange-700 font-medium block">
              Layanan Hotline Resmi 24 Jam
            </span>
          </div>
        </div>

        <p className="text-xs text-brown-700/80 leading-relaxed font-body">
          Jika beban terasa terlalu berat atau kamu membutuhkan pertolongan mendesak, konselor Kemenkes RI siap mendengarkan secara rahasia dan gratis.
        </p>

        <div className="bg-white/90 p-3 rounded-xl border border-orange-500/20 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-brown-700/60 uppercase block">
              Hotline Sejiwa
            </span>
            <span className="font-display text-base font-extrabold text-brown-900">
              119 (ext. 8)
            </span>
          </div>
          <a
            href="tel:119"
            className="px-3.5 py-1.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors shadow-2xs cursor-pointer"
          >
            Hubungi
          </a>
        </div>

        <Link
          href="/guidebook"
          className="text-[11px] font-bold text-orange-600 hover:text-brown-900 transition-colors inline-flex items-center gap-1 self-start mt-0.5 cursor-pointer"
        >
          <span>Buka Direktori Bantuan Krisis Lengkap</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
