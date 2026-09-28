import Link from "next/link";
import {
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
    icon: MessageCircle,
    href: "/fitur/companion",
    tone: "feature-orange",
  },
  {
    number: "02",
    title: "Daily Check-in",
    desc: "Kenali keadaanmu hari ini dan lihat polanya dari waktu ke waktu.",
    icon: Brain,
    href: "/fitur/daily-check-in",
    tone: "feature-lilac",
  },
  {
    number: "03",
    title: "Activity",
    desc: "Ubah niat menjadi langkah kecil yang realistis untuk tubuhmu.",
    icon: HeartPulse,
    href: "/fitur/activity",
    tone: "feature-green",
  },
  {
    number: "04",
    title: "Community",
    desc: "Terhubung dengan orang lain tanpa harus kehilangan ruang privatmu.",
    icon: UsersRound,
    href: "/fitur/community",
    tone: "feature-blue",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="fitur"
      className="landing-section feature-section"
    >
      <div className="landing-container">
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

        <div className="feature-list">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.number}
                href={feature.href}
                className={`feature-row ${feature.tone}`}
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

                <span className="feature-arrow">
                  <ArrowUpRight
                    size={19}
                    strokeWidth={2}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}