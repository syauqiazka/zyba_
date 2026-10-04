"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Heart,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const sections = [
  {
    title: "Mulai di ZYBA",
    description: "Pahami alur dasar setelah kamu masuk ke aplikasi.",
    icon: Sparkles,
    items: [
      ["Dashboard", "Tempat melihat ringkasan wellness, Zyba Score, aktivitas, dan akses cepat."],
      ["Profil", "Lengkapi informasi dasar agar pengalaman wellness di ZYBA lebih relevan."],
      ["Initial Assessment", "Assessment awal membantu ZYBA mendapatkan gambaran kondisi wellness kamu."],
    ],
  },
  {
    title: "Assessment & Zyba Score",
    description: "Ketahui bagaimana check-in kamu digunakan.",
    icon: CheckCircle2,
    items: [
      ["Daily Assessment", "Isi check-in harian untuk memperbarui gambaran kondisi wellness kamu."],
      ["Zyba Score", "Gunakan skor sebagai gambaran umum, bukan sebagai diagnosis medis."],
      ["Stress & Mood", "Pantau perubahan mood dan stress dari waktu ke waktu."],
    ],
  },
  {
    title: "Wellness Journey",
    description: "Bangun kebiasaan wellness secara bertahap.",
    icon: Heart,
    items: [
      ["Goals", "Tentukan tujuan wellness yang ingin kamu capai."],
      ["Progress", "Lihat perkembangan aktivitas dan kebiasaanmu."],
      ["Achievements", "Kumpulkan pencapaian dari perjalanan wellness kamu."],
    ],
  },
  {
    title: "Fitur Wellness",
    description: "Gunakan fitur harian untuk mendukung rutinitasmu.",
    icon: BookOpen,
    items: [
      ["Smart Activity Planner", "Temukan aktivitas yang sesuai dengan kebutuhan dan kondisi kamu."],
      ["Zyba Hours", "Gunakan latihan seperti breathing untuk membantu membuat jeda dalam rutinitas."],
      ["Health Journal", "Catat pengalaman dan refleksi wellness kamu secara pribadi."],
      ["Resources", "Temukan materi dan sumber yang dapat membantu proses belajar wellness."],
    ],
  },
  {
    title: "Zyba Companion",
    description: "Gunakan AI Companion sebagai pendamping percakapan.",
    icon: Bot,
    items: [
      ["Cara menggunakan", "Ceritakan apa yang sedang kamu rasakan atau tanyakan hal yang ingin kamu pahami."],
      ["Konteks", "Semakin relevan konteks yang kamu berikan, semakin membantu respons Companion."],
      ["Batasan AI", "Companion adalah AI dan bukan pengganti tenaga profesional atau layanan darurat."],
    ],
  },
  {
    title: "Community",
    description: "Berinteraksi dengan komunitas ZYBA dengan aman.",
    icon: MessageCircle,
    items: [
      ["Posting", "Bagikan pengalaman atau pemikiran yang ingin kamu diskusikan dengan komunitas."],
      ["Interaksi", "Berikan respons yang suportif dan tetap menghargai pengguna lain."],
      ["Report", "Laporkan konten yang melanggar aturan komunitas."],
    ],
  },
  {
    title: "Privasi & Keamanan",
    description: "Kenali pengaturan akun dan data kamu.",
    icon: ShieldCheck,
    items: [
      ["Account & Settings", "Kelola profil, keamanan, notifikasi, preferensi, dan data akun."],
      ["Data & Privacy", "Periksa pengaturan privasi dan gunakan fitur pengelolaan data yang tersedia."],
      ["Community Guidelines", "Ikuti aturan komunitas agar ruang ZYBA tetap aman dan suportif."],
    ],
  },
];

export default function GuidebookPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-12">
      <section className="overflow-hidden rounded-[32px] border border-brown-900/10 bg-gradient-to-br from-cream via-white to-green-100/40 p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brown-900 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
            <BookOpen size={13} />
            Panduan ZYBA
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em] text-brown-900 sm:text-4xl">
            Guidebook ZYBA
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brown-700 sm:text-base">
            Panduan singkat untuk memahami fitur ZYBA dan mengetahui apa yang bisa kamu lakukan di setiap bagian aplikasi.
          </p>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.title}
              className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cream text-brown-900">
                  <Icon size={19} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-extrabold text-brown-900">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-brown-700">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-brown-900/10">
                {section.items.map(([title, description]) => (
                  <div key={title} className="py-3 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-bold text-brown-900">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-brown-700/80">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <HelpCircle size={19} />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-brown-900">
              Masih bingung mulai dari mana?
            </h2>
            <p className="mt-1 text-xs leading-5 text-brown-700">
              Mulai dari Dashboard, lalu lakukan Daily Assessment dan gunakan hasilnya untuk mengikuti Wellness Journey kamu.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brown-900 px-4 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-orange-500"
        >
          Kembali ke Dashboard
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
