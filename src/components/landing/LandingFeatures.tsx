"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Heart,
  HeartPulse,
  MessageCircle,
  Trophy,
  UsersRound,
} from "lucide-react";

const FEATURES = [
  {
    number: "01",
    title: "Assessment Harian",
    desc: "Kenali keadaanmu hari ini dan lihat polanya dari waktu ke waktu.",
    detail:
      "Catat kondisi mental, fisik, dan sosialmu secara rutin. Dari check-in sederhana ini, kamu bisa mulai memahami perubahan dan pola keseharianmu dari waktu ke waktu.",
    icon: Brain,
    tone: "feature-lilac",
    loginPath: "/daily-assessment",
    cta: "Mulai Assessment Harian",
  },
  {
    number: "02",
    title: "Zyba Companion",
    desc: "Tempat untuk menuangkan pikiran tanpa harus mencari kata yang sempurna.",
    detail:
      "Ceritakan apa yang sedang ada di kepalamu tanpa harus menyusunnya dengan sempurna. Companion membantu kamu menuangkan pikiran, memahami apa yang sedang dirasakan, lalu melihat langkah kecil yang bisa dilakukan.",
    icon: MessageCircle,
    tone: "feature-orange",
    loginPath: "/companion",
    cta: "Mulai dengan Companion",
  },
  {
    number: "03",
    title: "Smart Activity Planner",
    desc: "Ubah niat menjadi langkah kecil yang realistis untuk keseharianmu.",
    detail:
      "Activity Planner membantu mengubah niat menjadi tindakan yang lebih realistis. Kamu bisa menemukan aktivitas sederhana yang sesuai dengan kondisi, energi, dan kebutuhanmu hari itu.",
    icon: HeartPulse,
    tone: "feature-green",
    loginPath: "/activity",
    cta: "Mulai Activity Planner",
  },
  {
    number: "04",
    title: "Wellness Journey",
    desc: "Lihat perjalananmu, dari langkah kecil sampai perubahan yang mulai terbentuk.",
    detail:
      "Wellness Journey membantu kamu melihat perjalanan secara lebih utuh melalui Goals, Progress, dan Achievements. Bukan tentang menjadi sempurna, tapi tentang melihat bahwa kamu terus bergerak.",
    icon: Heart,
    tone: "feature-green",
    loginPath: "/wellness-journey",
    cta: "Lihat Wellness Journey",
  },
  {
    number: "05",
    title: "Zyba Community",
    desc: "Terhubung dengan orang lain tanpa harus kehilangan ruang privatmu.",
    detail:
      "Community menjadi ruang untuk berbagi pengalaman, menemukan percakapan yang relevan, dan merasa terhubung dengan orang lain tanpa harus membuka semuanya tentang dirimu.",
    icon: UsersRound,
    tone: "feature-blue",
    loginPath: "/community",
    cta: "Masuk ke Community",
  },
  {
    number: "06",
    title: "Resources",
    desc: "Temukan bacaan dan materi yang bisa membantu memahami dirimu lebih jauh.",
    detail:
      "Resources menyediakan berbagai materi yang bisa kamu gunakan untuk belajar, memahami kondisi diri, dan menemukan informasi yang relevan dengan perjalanan wellness-mu.",
    icon: BookOpen,
    tone: "feature-lilac",
    loginPath: "/resources",
    cta: "Buka Resources",
  },
  {
    number: "07",
    title: "Pencapaian",
    desc: "Lihat langkah-langkah kecil yang sudah berhasil kamu lewati.",
    detail:
      "Pencapaian membantu kamu melihat progres yang sudah terbentuk dari kebiasaan dan aktivitasmu. Setiap langkah kecil tetap layak untuk diperhatikan.",
    icon: Trophy,
    tone: "feature-orange",
    loginPath: "/achievements",
    cta: "Lihat Pencapaian",
  },
];

export default function LandingFeatures() {
  const [openFeature, setOpenFeature] = useState<string | null>(null);

  const toggleFeature = (number: string) => {
    setOpenFeature((current) =>
      current === number ? null : number
    );
  };

  return (
    <section
      id="fitur"
      className="landing-section feature-section"
    >
      <div className="landing-container">
        {/* HEADING */}
        <div className="section-heading split-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Satu tempat, tujuh arah
            </div>

            <h2>
              Bukan sekadar
              <br />
              <span>tempat curhat.</span>
            </h2>
          </div>

          <p>
            ZYBA menghubungkan apa yang kamu
            rasakan dengan hal kecil yang bisa
            kamu lakukan setelahnya.
          </p>
        </div>

        {/* FEATURE LIST */}
        <div className="feature-list">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isOpen =
              openFeature === feature.number;

            return (
              <div
                key={feature.number}
                className={`feature-item ${isOpen ? "is-open" : ""
                  }`}
              >
                {/* ROW */}
                <button
                  type="button"
                  onClick={() =>
                    toggleFeature(feature.number)
                  }
                  className={`feature-row ${feature.tone} w-full text-left`}
                  aria-expanded={isOpen}
                >
                  <span className="feature-number">
                    {feature.number}
                  </span>

                  <span className="feature-icon">
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="feature-content">
                    <strong>
                      {feature.title}
                    </strong>

                    <span>
                      {feature.desc}
                    </span>
                  </span>

                  <span
                    className={`feature-arrow transition-transform duration-300 ${isOpen ? "rotate-90" : ""
                      }`}
                  >
                    <ArrowUpRight
                      size={19}
                      strokeWidth={2}
                    />
                  </span>
                </button>

                {/* DROPDOWN */}
                <div
                  className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-brown-900/10">
                      <div className="feature-detail">
                        <div className="feature-detail-copy">
                          <p>
                            {feature.detail}
                          </p>

                          <Link
                            href={`/login?redirect=${encodeURIComponent(
                              feature.loginPath
                            )}`}
                            className="feature-detail-cta"
                          >
                            {feature.cta}

                            <ArrowRight
                              size={17}
                            />
                          </Link>
                        </div>

                        <div className="feature-detail-meta">
                          <span>
                            ZYBA
                          </span>

                          <span>
                            {feature.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}