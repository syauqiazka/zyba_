import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function LandingCta() {
  return (
    <footer
      id="komunitas"
      className="landing-footer"
    >
      <div className="landing-container">
        <div className="footer-cta">
          <div>
            <div className="eyebrow footer-eyebrow">
              <span className="eyebrow-dot" />
              Ruang untuk mulai
            </div>

            <h2>
              Kamu tidak harus
              <br />
              <span>punya semuanya.</span>
            </h2>

            <p>
              Mulai dari satu check-in.
              Sisanya bisa menyusul.
            </p>
          </div>

          <Link
            href="/login"
            className="button-light"
          >
            Mulai gratis
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="footer-contact">
          <span className="footer-contact-label">Hubungi kami</span>
          <a href="https://wa.me/6281281345246">
            <Phone size={15} />
            +62 812-8134-5246
          </a>
          <a href="mailto:zyba@gmail.com">
            <Mail size={15} />
            zyba@gmail.com
          </a>
        </div>

        <div className="footer-bottom">
          <div className="landing-brand footer-brand">
            <span
              className="landing-mark"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <b />
            </span>

            <span>
              ZYBA
            </span>
          </div>

          <span className="footer-note">
            <ShieldCheck size={14} />
            Wellness support, bukan diagnosis medis.
          </span>

          <span className="footer-copy">
            © 2026 ZYBA
          </span>
        </div>
      </div>
    </footer>
  );
}