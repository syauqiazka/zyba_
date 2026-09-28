"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  HeartPulse,
  MessageCircle,
  UsersRound,
} from "lucide-react";

const FEATURES = [
  {
    number: "01",
    title: "Companion",
    desc: "Tempat untuk menuangkan pikiran tanpa harus mencari kata yang sempurna.",
    detail:
      "Ceritakan apa yang sedang ada di kepalamu tanpa harus menyusunnya dengan sempurna. Companion membantu kamu memahami apa yang sedang kamu rasakan dan menemukan langkah kecil yang bisa dilakukan.",
    icon: MessageCircle,
    tone: "feature-orange",
    loginPath: "/companion",
    cta: "Mulai dengan Companion",
  },
  {
    number: "02",
    title: "Daily Check-in",
    desc: "Kenali keadaanmu hari ini dan lihat polanya dari waktu ke waktu.",
    detail:
      "Catat keadaan mental, fisik, dan sosialmu secara rutin. Dari check-in ini, kamu bisa mulai melihat perubahan dan pola keseharianmu dari waktu ke waktu.",
    icon: Brain,
    tone: "feature-lilac",
    loginPath: "/daily-assessment",
    cta: "Mulai Daily Check-in",
  },
  {
    number: "03",
    title: "Activity",
    desc: "Ubah niat menjadi langkah kecil yang realistis untuk tubuhmu.",
    detail:
      "Nggak perlu langsung mengubah semuanya. Activity membantu kamu menemukan aktivitas kecil yang realistis dan sesuai dengan kondisi serta energimu hari itu.",
    icon: HeartPulse,
    tone: "feature-green",
    loginPath: "/activity",
    cta: "Mulai Activity",
  },
  {
    number: "04",
    title: "Community",
    desc: "Terhubung dengan orang lain tanpa harus kehilangan ruang privatmu.",
    detail:
      "Temukan ruang untuk berbagi pengalaman dan terhubung dengan orang lain tanpa harus membuka semuanya tentang dirimu. Kamu tetap punya kendali atas apa yang ingin dibagikan.",
    icon: UsersRound,
    tone: "feature-blue",
    loginPath: "/community",
    cta: "Masuk ke Community",
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
              Satu tempat, empat arah
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

        {/* FEATURES */}
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
                {/* MAIN ROW */}
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