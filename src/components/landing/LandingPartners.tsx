const partners = [
  { name: "Jagoan Hosting", mark: "JH", tone: "partner-mark-orange" },
  { name: "KOMDIGI", mark: "K", tone: "partner-mark-blue" },
  { name: "QA UDA SPARK", mark: "Q", tone: "partner-mark-dark" },
  { name: "NGALUP.CO", mark: "N", tone: "partner-mark-blue" },
];

function PartnerItem({ name, mark, tone }: (typeof partners)[number]) {
  return (
    <div className="partner-wordmark" aria-hidden="true">
      <span className={`partner-mark ${tone}`}>{mark}</span>
      <span className="partner-name">{name}</span>
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

          <div className="partners-marquee" aria-label="Partner ZYBA">
            <div className="partners-marquee-track">
              {[...partners, ...partners].map((partner, index) => (
                <PartnerItem key={`${partner.name}-${index}`} {...partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
