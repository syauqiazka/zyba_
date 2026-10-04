const partners = [
  { name: "NGALUP.CO", src: "/partners/5-ngalup.png", width: 300 },
  { name: "Garuda Spark", src: "/partners/4-garuda-spark.png", width: 300 },
  { name: "KOMDIGI", src: "/partners/3-komdigi.png", width: 250 },
  { name: "Jagoan Hosting", src: "/partners/2-jagoan-hosting.png", width: 320 },
  { name: "JHIC 2.0", src: "/partners/1-jhic-2.0.png", width: 300 },
];

function PartnerLogo({ name, src, width }: (typeof partners)[number]) {
  return (
    <div className="partner-logo" aria-label={name}>
      <img
        src={src}
        alt={name}
        width={width}
        height={180}
        draggable={false}
      />
    </div>
  );
}

export default function LandingPartners() {
  return (
    <section className="landing-partners" aria-label="Partner dan pendukung ZYBA">
      <div className="landing-container">
        <div className="partners-inner">
          <div className="partners-intro">
            <span className="partners-kicker">Didukung oleh</span>
            <p>
              Kolaborasi yang membantu ZYBA tumbuh dan terus dibangun untuk
              ruang wellness yang lebih dekat dengan Gen Z.
            </p>
          </div>

          <div className="partners-marquee">
            <div className="partners-marquee-track">
              {[...partners, ...partners].map((partner, index) => (
                <PartnerLogo key={`${partner.name}-${index}`} {...partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
