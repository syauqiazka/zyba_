const partners = [
  {
    name: "Jagoan Hosting",
    mark: "JH",
    tone: "partner-mark-orange",
  },
  {
    name: "KOMDIGI",
    mark: "K",
    tone: "partner-mark-blue",
  },
  {
    name: "QA UDA SPARK",
    mark: "Q",
    tone: "partner-mark-dark",
  },
  {
    name: "NGALUP.CO",
    mark: "N",
    tone: "partner-mark-blue",
  },
];

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

          <div className="partners-list">
            {partners.map((partner) => (
              <div className="partner-wordmark" key={partner.name}>
                <span className={`partner-mark ${partner.tone}`} aria-hidden="true">
                  {partner.mark}
                </span>
                <span className="partner-name">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
