import {
  ArrowDownRight,
  LockKeyhole,
  Route,
  ShieldCheck,
} from "lucide-react";

export default function LandingAbout() {
  return (
    <section
      id="cara-kerja"
      className="landing-section journey-section"
    >
      <div className="landing-container">
        <div className="journey-card">
          {/* LEFT */}
          <div className="journey-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Cara kerja ZYBA
            </div>

            <h2>
              Dari yang kamu rasakan,
              <br />
              <span>ke langkah berikutnya.</span>
            </h2>

            <p>
              Tidak perlu mengubah hidup dalam semalam.
              ZYBA dirancang untuk membantu kamu melihat
              keadaan hari ini, lalu memilih satu langkah
              yang masuk akal.
            </p>

            <div className="journey-points">
              <div>
                <span>01</span>

                <strong>
                  Check-in
                </strong>

                <small>
                  Ceritakan keadaanmu hari ini.
                </small>
              </div>

              <div>
                <span>02</span>

                <strong>
                  Pahami
                </strong>

                <small>
                  Lihat pola dan konteks yang relevan.
                </small>
              </div>

              <div>
                <span>03</span>

                <strong>
                  Bergerak
                </strong>

                <small>
                  Pilih aksi kecil yang bisa dilakukan.
                </small>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="journey-visual">
            <div
              className="journey-path"
              aria-hidden="true"
            >
              <span />
              <i />
              <b />
            </div>

            <div className="journey-node node-one">
              <span>
                <Route size={17} />
              </span>

              <strong>
                Check-in
              </strong>

              <small>
                Bagaimana harimu?
              </small>
            </div>

            <div className="journey-node node-two">
              <span>
                <ArrowDownRight size={17} />
              </span>

              <strong>
                Insight
              </strong>

              <small>
                Kenali polanya.
              </small>
            </div>

            <div className="journey-node node-three">
              <span>
                <ShieldCheck size={17} />
              </span>

              <strong>
                Next step
              </strong>

              <small>
                Satu langkah kecil.
              </small>
            </div>

            <div className="journey-lock">
              <LockKeyhole size={15} />
              <span>
                Privat by design
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}