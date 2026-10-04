import type { Metadata } from "next";
import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingAbout,
  LandingTestimonials,
  LandingCta,
} from "@/components/landing";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jhic.zyba.my.id";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ZYBA",
      alternateName: "ZYBA Wellness",
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "ZYBA",
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "id-ID",
    },
  ],
};

export default function LandingPage() {
  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />

    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-100 selection:text-orange-500">
      <LandingHeader />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingAbout />
        <LandingTestimonials />
      </main>

      <LandingCta />
    </div>
  </>
);
}
