import Image from "next/image";

export default function LandingSupport() {
  return (
    <section className="landing-support" aria-label="Dukungan">
      <div className="landing-container landing-support-inner">
        <p>Didukung oleh</p>
        <Image
          src="/support.png"
          alt="Logo pihak pendukung ZYBA"
          width={280}
          height={100}
          className="landing-support-logo"
        />
      </div>
    </section>
  );
}
