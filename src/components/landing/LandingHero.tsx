import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  HeartPulse,
  MessageCircle,
  Sparkles,
  UsersRound,
} from "lucide-react";
import LandingScene from "./LandingScene";

type MiniCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  className: string;
};

function MiniCard({
  icon,
  title,
  text,
  className,
}: MiniCardProps) {
  return (
    <div className={`hero-float-card ${className}`}>
      <span className="hero-float-icon">{icon}</span>

      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

export default function LandingHero() {
  return (
    <section className="landing-hero">
      <div
        className="hero-noise"
        aria-hidden="true"
      />

      <div className="landing-container hero-grid">
        {/* =========================================
            LEFT / CONTENT
        ========================================= */}
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="eyebrow-dot" />
            Wellness companion untuk Gen Z
          </div>

          <h1>
            Pelan-pelan,
            <br />
            tapi <span>tetap jalan.</span>
          </h1>

          <p className="hero-lead">
            ZYBA membantu kamu memahami keseharian,
            merawat diri, dan tetap terhubung dari
            satu ruang yang terasa personal.
          </p>

          <div className="hero-actions">
            <Link
              href="/login"
              className="button-primary"
            >
              Mulai perjalanan
              <ArrowRight
                size={18}
                strokeWidth={2.1}
              />
            </Link>

            <a
              href="#fitur"
              className="button-quiet"
            >
              Lihat cara kerja
            </a>
          </div>

          <div className="hero-proof">
            <div
              className="proof-avatars"
              aria-hidden="true"
            >
              <span>R</span>
              <span>A</span>
              <span>N</span>
              <span>+</span>
            </div>

            <div>
              <strong>
                Ruang untuk cerita sehari-hari
              </strong>

              <small>
                Privat · tidak menghakimi · bukan alat diagnosis
              </small>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT / WORLD
        ========================================= */}
        <div
          className="hero-stage"
          aria-label="Pratinjau pengalaman ZYBA"
        >
          {/* WORLD / PARK */}
          <LandingScene />

          {/* ORBITS */}
          <div
            className="hero-orbit orbit-one"
            aria-hidden="true"
          />

          <div
            className="hero-orbit orbit-two"
            aria-hidden="true"
          />

          {/* FLOATING CARD - LEFT */}
          <MiniCard
            className="float-left"
            icon={
              <MessageCircle
                size={17}
                strokeWidth={2}
              />
            }
            title="Companion"
            text="Aku dengerin."
          />

          {/* FLOATING CARD - RIGHT */}
          <MiniCard
            className="float-right"
            icon={
              <HeartPulse
                size={17}
                strokeWidth={2}
              />
            }
            title="Aktivitas"
            text="12 menit jalan"
          />

          {/* =====================================
              ZYBA APP PREVIEW
          ===================================== */}
          <div className="hero-app-window">
            {/* HEADER */}
            <div className="hero-app-top">
              <div>
                <small>Daily check-in</small>

                <strong>
                  Hai, hari ini gimana?
                </strong>
              </div>

              <div
                className="hero-avatar"
                aria-hidden="true"
              >
                S
              </div>
            </div>

            {/* CHECK-IN */}
            <div className="hero-checkin">
              <div className="checkin-ring">
                <div>
                  <small>Hari ini</small>
                  <strong>72</strong>
                </div>
              </div>

              <div className="checkin-copy">
                <span className="status-chip">
                  Good pace
                </span>

                <h3>
                  Jaga ritme,
                  <br />
                  bukan kesempurnaan.
                </h3>

                <p>
                  Satu langkah kecil
                  tetap dihitung.
                </p>
              </div>
            </div>

            {/* MODULES */}
            <div className="hero-app-grid">
              <div className="hero-app-card">
                <span>
                  <Brain
                    size={16}
                    strokeWidth={2}
                  />
                </span>

                <small>Mind</small>
                <strong>Check-in</strong>
              </div>

              <div className="hero-app-card">
                <span>
                  <HeartPulse
                    size={16}
                    strokeWidth={2}
                  />
                </span>

                <small>Body</small>
                <strong>12 min</strong>
              </div>

              <div className="hero-app-card">
                <span>
                  <UsersRound
                    size={16}
                    strokeWidth={2}
                  />
                </span>

                <small>People</small>
                <strong>Community</strong>
              </div>
            </div>

            {/* TODAY */}
            <div className="hero-today">
              <div>
                <small>Rencana hari ini</small>

                <strong>
                  Jalan santai 15 menit
                </strong>
              </div>

              <span className="hero-check">
                <Check
                  size={15}
                  strokeWidth={2.4}
                />
              </span>
            </div>
          </div>

          {/* DECORATIVE */}
          <div
            className="hero-spark spark-a"
            aria-hidden="true"
          >
            <Sparkles
              size={15}
              strokeWidth={1.8}
            />
          </div>

          <div
            className="hero-spark spark-b"
            aria-hidden="true"
          >
            <Sparkles
              size={11}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="hero-scroll"
        aria-hidden="true"
      >
        <span />
        Scroll untuk mengenal ZYBA
      </div>
    </section>
  );
}