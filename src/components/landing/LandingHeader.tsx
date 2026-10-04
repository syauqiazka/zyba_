import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara kerja", href: "#cara-kerja" },
  { label: "Kata Mereka", href: "#testimoni" },
];

export default function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-container landing-nav">
        <Link
          href="/"
          className="landing-brand"
          aria-label="ZYBA"
        >
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

          <span>ZYBA</span>
        </Link>

        <nav
          className="landing-nav-links hidden md:flex"
          aria-label="Navigasi utama"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="landing-nav-cta"
        >
          Mulai
          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </header>
  );
}