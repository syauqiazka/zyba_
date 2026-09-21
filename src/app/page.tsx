import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingAbout,
  LandingCta,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-100 selection:text-orange-500">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingAbout />
      </main>
      <LandingCta />
    </div>
  );
}
