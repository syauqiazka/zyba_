const testimonials = [
  {
    name: "Ristina",
    role: "Pelajar SMK",
    quote:
      "Aku bisa menulis dan refleksi di ZYBA. Aku jadi lebih sadar sama diri sendiri, dan lebih bisa mengatur mood.",
    mood: "Hidup lebih teratur",
    initials: "R",
  },
  {
    name: "Aditya",
    role: "Mahasiswa",
    quote:
      "Website ini bikin aku lebih sadar sama diri sendiri. Aku bisa menulis, refleksi, dan belajar cara mengelola stres.",
    mood: "Lebih tenang",
    initials: "A",
  },
  {
    name: "Ucup",
    role: "Content creator",
    quote:
      "Website ini sangat mudah digunakan Untuk pengguna baru untuk saya, semoga kedepannya bisa lebih banyak fitur yang bermanfaat untuk kesehatan mental.",
    mood: "Jauh lebih jelas",
    initials: "S",
  },
];

export default function LandingTestimonials() {
  return (
    <section className="landing-section testimonial-section" aria-label="Testimoni pengguna ZYBA" id="testimoni">
      <div className="landing-container">
        <div className="section-heading testimonial-heading">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Testimoni
          </div>

          <h2>
            Kata Mereka.
          </h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card glass-card">
              <div className="testimonial-topbar">
                <div className="testimonial-avatar" aria-hidden="true">
                  {item.initials}
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>

              <p className="testimonial-quote">“{item.quote}”</p>

              <div className="testimonial-meta">
                <span className="testimonial-badge">{item.mood}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
