"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara kerja", href: "#cara-kerja" },
  { label: "Komunitas", href: "#komunitas" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const target = document.querySelector(href);

    if (!target) return;

    const headerOffset = 88;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", href);
  };

  return (
    <header
      className={`landing-header ${scrolled
          ? "landing-header-scrolled"
          : ""
        }`}
    >
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
              onClick={(e) =>
                handleNavClick(
                  e,
                  item.href
                )
              }
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