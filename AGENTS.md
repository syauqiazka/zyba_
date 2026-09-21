AGENTS.md — ZYBA Web (Desktop)
Dokumen ini adalah satu-satunya sumber acuan untuk coding agent (Hermes+9Router, Antigravity, atau agent lain) yang melanjutkan development ZYBA. Semua keputusan desain, hasil review, dan perbaikan yang wajib dilakukan digabung di sini — agent tidak perlu mencari konteks di tempat lain.

⚠️ Baca urutan ini sebelum coding apa pun:

Bagian 8 — Status Review & Prioritas Perbaikan — 3 isu keamanan yang HARUS diperbaiki duluan.
Bagian 12 — Checklist Final — daftar centang sebelum submit lomba/deploy.
1. Ringkasan Produk
ZYBA — Gen Z Wellness Support. Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Alur inti: Curhat → Solusi → Program → Aksi.

Stack: Next.js 14 (App Router) + Prisma + Neon Postgres, Tailwind CSS.

2. Rename Fitur (Figma → Nama Resmi Pitch Deck)
Figma UI kit awal dibuat dari template generik ("Doctor Freud.AI"). Semua kode, route, dan copy wajib pakai penamaan resmi berikut:

Nama di Figma / template	Nama resmi dipakai di build
Doctor Freud.AI / "Talk to Doctor Freud.AI"	Zyba Companion
Therapy Chat / Chatbot	Zyba Companion Chat
Mood / Mood Edit / Mood Stats	Mood Check-In
Zyba Hours / Zyba Exercise / Activity Tracker	Smart Activity Planner
Health Journal / Zyba Score / Stress Level dashboard gabungan	Wellness Journey
Community / Zyba Community	Zyba Community (nama sudah cocok, pertahankan)
"Logomark" / ikon bunga 4 kelopak oranye-hijau	Logo utama ZYBA, pertahankan sebagai favicon & brand mark
Status: sudah diimplementasikan di repo (dikonfirmasi lewat review langsung ke github.com/syauqiazka/zyba, dashboard tidak lagi menyebut "Freud").

3. Design Tokens
Warna diestimasi dari inspeksi visual Figma. Sudah diimplementasikan sebagai kelas Tailwind kustom di tailwind.config.ts — pakai nama kelas di kolom kanan, bukan hex mentah, supaya konsisten di seluruh kode.

3.1 Palet Warna
Token	Hex (estimasi)	Kelas Tailwind	Dipakai untuk
Cream	#F7F2E7	bg-cream / text-cream	Background utama, card default
Brown 900	#3B2A20	bg-brown-900 / text-brown-900	Teks utama, tombol primer gelap
Brown 700	#5A4636	text-brown-700	Teks sekunder
Green 500	#8FAE5D	bg-green-500 / text-green-500	Elemen "positif/sehat", CTA sekunder
Green 100	#E4EED2	bg-green-100	Background kartu hijau muda, nav item aktif
Orange 500	#F2884B	bg-orange-500 / text-orange-500	CTA utama, alert, upsell/Pro
Orange 100	#FCE3D3	bg-orange-100	Background kartu oranye muda, badge
Mood: Depressed	#A99BE0	bg-mood-depressed	Mood selector
Mood: Sad	#EE8A5E	bg-mood-sad	Mood selector
Mood: Neutral	#6B5645	bg-mood-neutral	Mood selector
Mood: Happy	#E8C24A	bg-mood-happy	Mood selector
Mood: Overjoyed	#8FAE5D	bg-mood-overjoyed	Mood selector
Danger	#D9534F	bg-danger / text-danger	Hanya untuk delete/destructive action, jangan dipakai untuk styling konten krisis pengguna
3.2 Tipografi
Montserrat ExtraBold — judul besar/display (32–40px)
Poppins SemiBold — subjudul/H1-H2 (18–24px)
Poppins Regular — isi/body (14–16px), caption (12px)
3.3 Komponen Inti
Button primer: pill/rounded-full (rounded-pill), background brown-900 atau orange-500, teks putih, ikon panah → di kanan.
Button sekunder: outline atau flat green-100.
Progress ring: lingkaran skor (mis. "Zyba Score 80") — dashboard & hasil assessment.
Mood selector: baris ikon ekspresif, 5 warna berbeda per mood.
Card resource/artikel: thumbnail + judul + meta, dipakai di Resource & Community feed.
Input field: rounded, ikon di kiri, konsisten di semua form.
Bottom nav (mobile) → desktop wajib jadi sidebar kiri.
Streak/stats badge: angka besar + label.
4. Taksonomi Layar (Screen Inventory)
A. Onboarding & Auth
Splash/Loading (4 varian warna brand)
Welcome carousel (5 slide)
Sign In / Sign Up (email, password, Google/social, 2FA)
Forgot Password
B. Profile & Account Setup
Select Avatar, Profile Setup
Password Setup (strength meter)
OTP Setup & Verifikasi (4 digit)
Fingerprint Setup
Notification Setup
Compiling Data (loading state)
"You're All Set Up"
C. Mental Health Assessment (Onboarding — Gate Wajib)
Alur pertanyaan berurutan (goal, gender, usia, berat, mood, riwayat bantuan profesional, gejala fisik, kualitas tidur, level stres, obat, gejala mental lain, AI Expression Analysis).

Alur akses (wajib diimplementasikan di middleware.ts): setelah akun dibuat (User.onboardingCompleted = false), user tidak boleh bisa mengakses fitur lain (/dashboard, /companion, /mood-check-in, /community, /activity, /wellness-journey, /resources) sebelum menyelesaikan assessment ini. Middleware harus redirect otomatis ke /assessment selama onboardingCompleted === false, dan baru mengizinkan akses penuh setelah field ini di-set true (di endpoint terakhir assessment, biasanya di "CompletedState"/"You're All Set Up"). Setelah onboardingCompleted = true, user tidak diarahkan ke /assessment lagi kecuali memang mau mengulang.

⚠️ Layar "Expression Analysis" di source Figma berisi contoh teks krisis/ide bunuh diri sebagai dummy. Wajib diganti — lihat Bagian 8.

D. Resources
Listing (Articles/Courses), detail artikel, detail course, course player, course completed, paywall upsell.

E. Home / Dashboard
Greeting, Mental Health Metrics (Zyba Score + Stress Level), Zyba Tracker checklist, widget Zyba Companion, shortcut Resources.

F. Zyba Community
Lihat spesifikasi redesign lengkap di Bagian 11.

G. Mood Check-In & Tracking
Zyba Score detail, Stress Level detail, Mood Edit, Mood Stats, Health Journal.

H. Zyba Companion (AI Chat)
Lihat spesifikasi redesign lengkap di Bagian 10.

I. Smart Activity Planner
Sleep Quality, breathing exercise, exercise completed, activity target, choose activity, activity tracking, activity completed.

5. Panduan Konversi Mobile → Desktop
Navigasi: bottom nav mobile → sidebar kiri fixed (~240–280px): Dashboard, Mood Check-In, Zyba Companion, Smart Activity Planner, Wellness Journey, Zyba Community, Resources, Settings.
Layout grid: container max-width 1200–1280px, grid 12 kolom. Halaman list (Resources, Community, Activity) pakai grid multi-kolom (2–3 kolom).
Assessment: gabung jadi form multi-step — panel kiri progress stepper, panel kanan pertanyaan aktif.
Chat (Zyba Companion): dua panel — kiri daftar percakapan, kanan jendela chat aktif (pola WhatsApp Web/Slack).
Modal vs full page: Delete Conversation, OTP Verification, Forgot Password → jadi modal/dialog di desktop.
Komponen reusable: mood selector & progress ring dipertahankan ukurannya, disusun ulang dalam grid yang lebih lega.
Breakpoint: desktop ≥1024px = sidebar+grid; tablet 768–1023px = sidebar collapse icon-only; <768px = pola mobile asli.
6. Data & State Notes
Semua angka mock (skor 80, stress 3, 2.541 conversations, dll) adalah contoh — implementasikan sebagai data dinamis, jangan hardcode.
Zyba Plus (paywall/"Out of Tokens") harus punya state jelas: free-tier limit vs unlocked.
7. Tech Stack & Scaffold Code
Scaffold awal (zyba-web.zip, sudah di-push ke github.com/syauqiazka/zyba) berisi:

prisma/schema.prisma — data model lengkap (User, Assessment, MoodEntry, JournalEntry, ActivityLog, Conversation/Message, CommunityPost/Comment/Like, Resource), dual-URL Neon (DATABASE_URL pooled + DIRECT_URL direct).
src/lib/prisma.ts — Prisma client singleton.
src/lib/crisisDetection.ts — detectRisk() + CRISIS_RESOURCES, wajib dipanggil di setiap endpoint yang menerima teks bebas dari pengguna.
src/components/Sidebar.tsx — nav sidebar desktop.
src/app/mood-check-in/ + MoodSelector.tsx + api/mood/route.ts — contoh pola implementasi end-to-end, dicontoh/dicopy untuk fitur lain.
src/app/dashboard/page.tsx — contoh layout grid desktop.
Status aktual di repo (per review terakhir): sudah berkembang melampaui scaffold — halaman companion, community, activity, wellness-journey, resources, assessment, onboarding, plus middleware.ts untuk proteksi route dan api/auth/route.ts untuk login/signup/OTP, sudah ada dan strukturnya konsisten dengan Bagian 4.

8. Status Review & Prioritas Perbaikan
Review langsung ke kode di github.com/syauqiazka/zyba menemukan 3 isu keamanan nyata — prioritas di atas isu tampilan apa pun, karena menyangkut data kesehatan mental pengguna:

8.1 Password disimpan plain text (PRIORITAS TERTINGGI)
Lokasi: src/app/api/auth/route.ts — passwordHash: password || "demo_password". Masalah: kalau database bocor, semua password pengguna (dan data assessment kesehatan mental yang terhubung ke akun mereka) langsung terbuka. Perbaikan: hash password dengan bcrypt atau argon2 sebelum disimpan, dan compare() saat login — jangan pernah simpan/bandingkan password mentah.

// contoh perbaikan minimal
import bcrypt from "bcrypt";

// saat signup:
const passwordHash = await bcrypt.hash(password, 12);

// saat login:
const valid = await bcrypt.compare(inputPassword, user.passwordHash);
if (!valid) return NextResponse.json({ error: "Password salah" }, { status: 401 });
8.2 Session token gampang ditebak (PRIORITAS TERTINGGI)
Lokasi: src/app/api/auth/route.ts — sessionToken = \demo_${user.id}`. **Masalah**: siapa pun yang tahu/menebak user.id(angka/string berurutan atau bisa di-enumerasi) bisa memalsukan cookieauth-tokendan login sebagai user lain tanpa password. **Perbaikan**: gunakan token random & ditandatangani server (JWT dengan secret, atau UUID session yang disimpan di tabelSession` terpisah dan divalidasi tiap request), bukan string yang bisa dikonstruksi dari data publik.

8.3 Kode OTP dikembalikan di response API (PRIORITAS TINGGI)
Lokasi: src/app/api/auth/route.ts — field demoCode dikirim balik ke client. Masalah: OTP yang seharusnya jadi bukti kepemilikan email, kalau dikembalikan langsung di response, sama saja tidak ada verifikasi — siapa pun bisa signup atas nama email siapa pun tanpa akses ke email itu. Perbaikan: kirim OTP hanya lewat email/SMS asli (integrasi email service), jangan pernah sertakan di body response, bahkan untuk mode "demo" — ganti demo mode dengan OTP tetap (mis. 000000) yang didokumentasikan di README internal tim, bukan dikirim dinamis di response.

8.4 Landing page publik belum ada (PRIORITAS SEDANG)
Lokasi: src/app/page.tsx — saat ini langsung me-render DashboardPage. Masalah: siapa pun yang membuka domain root langsung melihat data dashboard tanpa login. Perbaikan: ganti dengan landing page publik. Spesifikasi & kode lengkap ada di Bagian 9.

Urutan pengerjaan yang disarankan: 8.1 → 8.2 → 8.3 → 8.4. Keamanan data pengguna lebih prioritas daripada landing page yang belum ada.

8.5 Update Review — Repo zyba_ (setelah perbaikan auth)
Review kedua langsung ke kode (bukan cuma nama folder) di github.com/syauqiazka/zyba_ mengonfirmasi 8.1–8.3 sudah benar diperbaiki: bcrypt (cost 12) untuk password, JWT signed (jose, HS256, expiry 30 hari) untuk session token, dan demoCode sudah tidak lagi dikembalikan di response OTP. Landing page juga sudah dipecah jadi komponen reusable di src/components/landing/ (lebih rapi dari contoh single-file di Bagian 9).

Ditemukan 3 isu baru yang tidak berasal dari spek manapun di dokumen ini — inisiatif sendiri dari agent, perlu diarahkan:

8.5.1 Duplikasi fitur: daily-assessment vs mood-check-in
Catatan: assessment (onboarding, sekali di awal, gating akses fitur) dan daily-assessment (harian, berulang) adalah dua fitur yang memang disengaja berbeda — ini bukan bagian dari temuan duplikasi. Lihat penjelasan alur onboarding gate di bawah. Yang tumpang tindih hanya daily-assessment vs mood-check-in.

Kedua folder ini (daily-assessment dan mood-check-in) sama-sama menangkap mood, stress level, refleksi/catatan bebas, dan crisis detection — hampir seluruhnya tumpang tindih. daily-assessment menambahkan sleep rating & energy tags yang tidak ada di mood-check-in. Keputusan yang harus diambil: gabungkan jadi satu flow. Rekomendasi: jadikan mood-check-in sebagai satu-satunya halaman check-in harian, pindahkan field tambahan dari daily-assessment (sleep rating, energy tags) ke dalamnya sebagai field opsional, lalu hapus folder daily-assessment dan seluruh route/komponennya supaya tidak ada dua sumber data check-in harian yang terpisah.

8.5.2 Data sensitif ter-commit ke git (data/*.json)
data/users.json, data/assessments.json, data/community_posts.json adalah fallback storage lokal (dipakai runWithPrisma() di backend/db/prisma.ts saat Neon timeout >250ms) — niatnya bagus untuk keandalan demo, tapi:

File ini berisi bcrypt hash password asli dan sudah ter-commit ke repository publik. Hash password tidak boleh pernah ada di git history, walau untuk data demo.
Di kebanyakan platform hosting (Vercel dkk.), filesystem lokal tidak persistent — data yang "diselamatkan" lewat fallback ini akan hilang saat redeploy, memberi rasa aman palsu.
Perbaikan:

Tambahkan data/*.json ke .gitignore, hapus dari git history (git rm --cached lalu commit).
Dokumentasikan mekanisme fallback ini secara eksplisit di README (saat ini tidak disebut sama sekali) — termasuk peringatan bahwa data fallback tidak persistent di production.
Pertimbangkan ganti strategi fallback: kalau tujuannya cuma untuk demo tetap jalan saat Neon cold-start, gunakan in-memory cache dengan retry, bukan file lokal yang ter-commit.
8.5.3 Komponen bernama "Discord" (src/components/discord/)
DiscordProfilePopover.tsx dan DiscordSettingsModal.tsx — diimpor langsung ke Sidebar.tsx utama — meniru sistem presence Discord (status online/idle/dnd/invisible + custom status teks). Ini masalah yang sama kategorinya dengan isu "Doctor Freud.AI" di Bagian 2: nama file & konsep UI menempel ke brand/produk lain, bukan ZYBA. Perbaikan:

Rename folder & file: discord/ → profile/, DiscordProfilePopover.tsx → ProfilePopover.tsx, DiscordSettingsModal.tsx → ProfileSettingsModal.tsx.
Evaluasi ulang fitur presence status (online/idle/dnd/invisible): ini konsep chat-app/gaming, pertimbangkan apakah relevan untuk app wellness — kalau dipertahankan, ganti label jadi lebih sesuai konteks (mis. "Aktif" / "Sedang Fokus" / "Jangan Ganggu") bukan istilah gamer "DND"/"Invisible".
8.6 Fitur Tambahan yang Ditemukan (di luar spek awal, dokumentasikan saja)
Agent menambahkan beberapa hal yang tidak diminta tapi cukup masuk akal — didokumentasikan di sini supaya tidak dianggap "penyimpangan" oleh agent berikutnya:

Google OAuth login (api/auth/google/route.ts + callback) — di luar spek awal (spek awal cuma email/password + OTP), tapi merupakan penambahan yang wajar. Pastikan dummy password hash untuk akun Google (google_${Date.now()}_oauth) tidak bisa dipakai untuk login manual via form password biasa.
src/app/welcome/ — terpisah dari onboarding/, isinya WelcomeTour.tsx. Ini oke sebagai tur fitur setelah signup, tapi pastikan tidak tumpang tindih dengan Welcome carousel di Bagian 4.A (yang harusnya tampil sebelum signup, bukan sesudah).
9. Spesifikasi Landing Page (Publik, Sebelum Login)
Referensi gaya: layout hero besar + stat row + grid fitur di bawah (mirip halaman marketing OpenRouter), tapi seluruh warna diganti ke palet ZYBA (cream/coklat/hijau/oranye) — bukan dark/neon.

Struktur halaman (ganti isi src/app/page.tsx, pindahkan render DashboardPage supaya hanya bisa diakses setelah auth):

Nav bar: logo ZYBA kiri, menu tengah (Fitur/Tentang/Komunitas) hidden di mobile, tombol "Masuk/Daftar" kanan → /onboarding.
Hero: badge kecil "GEN Z WELLNESS SUPPORT" (bg orange-100, teks orange-500), headline besar (font-display, 5xl–6xl) dengan kata kunci "Fisik" di-highlight text-green-500 dan "Sosial" di text-orange-500, subteks 1 kalimat, dua CTA ("Mulai Sekarang →" solid orange, "Lihat Fitur" outline).
Stat row: 4 angka besar (mis. dari Market Size pitch deck: 74,9jt Gen Z Indonesia, 81,1% pernah curhat ke AI, target 100rb+ pengguna, 3 aspek Mental/Fisik/Sosial).
Grid fitur (4 kartu, 1 baris di desktop): Zyba Companion, Mood Check-In, Smart Activity Planner, Zyba Community — tiap kartu: emoji/ikon, judul, deskripsi singkat.
CTA footer: section dengan bg green-100, headline ajakan, tombol "Gabung Gratis →".
Kode React lengkap siap pakai:

// src/app/page.tsx — GANTI isi file ini (yang lama hanya me-render Dashboard)
import Link from "next/link";

const STATS = [
  { value: "74,9jt", label: "Total Gen Z di Indonesia" },
  { value: "81,1%", label: "Pernah curhat ke AI" },
  { value: "100rb+", label: "Target pengguna terdaftar" },
  { value: "3", label: "Aspek: Mental, Fisik, Sosial" },
];

const FEATURES = [
  { title: "Zyba Companion", desc: "Curhat kapan saja ke AI companion yang mendengarkan tanpa menghakimi.", icon: "💬" },
  { title: "Mood Check-In", desc: "Catat mood harianmu, ZYBA bantu kenali pola dan beri insight.", icon: "🙂" },
  { title: "Smart Activity Planner", desc: "Program aktivitas fisik sederhana yang disesuaikan kondisimu.", icon: "⚡" },
  { title: "Zyba Community", desc: "Ruang aman berbagi cerita dengan sesama Gen Z, privasi terjaga.", icon: "🤝" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900">
      <header className="flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500" aria-hidden />
          <span className="font-display font-bold text-lg">ZYBA</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brown-700">
          <a href="#fitur">Fitur</a>
          <a href="#tentang">Tentang</a>
          <a href="#komunitas">Komunitas</a>
        </nav>
        <Link href="/onboarding" className="rounded-pill bg-brown-900 text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
          Masuk / Daftar
        </Link>
      </header>

      <section className="max-w-[1280px] mx-auto px-10 pt-16 pb-20 text-center flex flex-col items-center">
        <span className="inline-block rounded-pill bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1.5 mb-6">
          GEN Z WELLNESS SUPPORT
        </span>
        <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight max-w-3xl">
          Pendamping Kesehatan Mental, <span className="text-green-500">Fisik</span>, dan{" "}
          <span className="text-orange-500">Sosial</span> untuk Gen Z
        </h1>
        <p className="mt-6 text-brown-700 text-lg max-w-xl">
          Curhat, dapat solusi, ubah jadi program nyata — semua dalam satu ruang aman, privat, dan bebas dihakimi.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/onboarding" className="rounded-pill bg-orange-500 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity">
            Mulai Sekarang →
          </Link>
          <a href="#fitur" className="rounded-pill border-2 border-brown-900/15 px-8 py-3.5 font-semibold hover:bg-white transition-colors">
            Lihat Fitur
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display font-bold text-3xl text-brown-900">{s.value}</span>
              <span className="text-sm text-brown-700 mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="max-w-[1280px] mx-auto px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-brown-900/10 flex flex-col gap-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-brown-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="komunitas" className="bg-green-100 py-16 px-10 text-center">
        <h2 className="font-display font-bold text-3xl max-w-lg mx-auto">
          Kamu nggak sendirian. ZYBA ada untuk dengarkan ceritamu.
        </h2>
        <Link href="/onboarding" className="inline-block mt-6 rounded-pill bg-brown-900 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity">
          Gabung Gratis →
        </Link>
      </section>
    </div>
  );
}
Penting: dashboard yang sebelumnya dirender di / harus tetap bisa diakses di /dashboard (sudah ada, sudah dilindungi middleware.ts) — cukup hapus baris yang me-render DashboardPage langsung dari page.tsx root.

10. Spesifikasi Redesign Zyba Companion (AI Chat)
Halaman AI chat saat ini dinilai masih kurang matang secara visual. Spesifikasi berikut menggantikan implementasi tampilan yang ada — struktur data/API (Conversation, Message di Prisma) tetap dipakai, ini murni perbaikan UI.

10.1 Layout Utama
⚠️ Update penting: layout "dua panel" yang tadinya dijelaskan di sini digantikan sepenuhnya oleh Contextual Sidebar di Bagian 10.7. Jangan render ConversationList sebagai kolom terpisah di page.tsx — daftar percakapan hanya boleh muncul di dalam CompanionSidebar.tsx (lewat companion/layout.tsx). Kalau keduanya di-render bersamaan, hasilnya dua panel percakapan nempel dobel (bug yang pernah terjadi — lihat catatan di commit history). page.tsx untuk /companion hanya berisi jendela chat aktif: ChatHeader + ChatMessages + ChatInput, full-width, tanpa sidebar/list apa pun di dalamnya.

10.2 Bubble Chat
Pesan user: rata kanan, bg brown-900, teks putih, rounded-2xl dengan sudut kanan-bawah lebih kecil (efek "ekor" chat bubble khas).
Pesan AI: rata kiri, bg putih/cream, teks brown-900, border tipis brown-900/10, avatar mascot kecil di kiri bubble.
Timestamp kecil (text-xs text-brown-700) di bawah tiap bubble, hanya muncul saat hover atau di pesan terakhir grup.
Typing indicator: 3 titik animasi berdenyut di dalam bubble AI kosong, dipakai selagi menunggu respons.
10.3 Empty/Intro State (perbaikan utama dari kesan "jelek")
Alih-alih layar kosong, tampilkan:

Ilustrasi mascot ZYBA di tengah.
Judul ramah: "Cerita apa hari ini?"
3–4 chip prompt starter yang bisa diklik langsung, mis. "Aku lagi stres tugas", "Butuh teman ngobrol aja", "Susah tidur akhir-akhir ini" — bg orange-100, teks brown-900, rounded-pill, klik langsung mengisi & mengirim pesan pertama. Ini pola umum yang bikin AI chat terasa "hidup" dan bukan kotak kosong menakutkan.
10.4 Input Area
Sticky di bawah panel kanan, bg putih, border atas brown-900/10.
Rounded-pill input full-width, placeholder "Ketik pesan ke Zyba...".
Ikon attachment (kertas klip) dan voice/mic di dalam input, kiri.
Tombol kirim: lingkaran orange-500, ikon panah putih, disabled state abu-abu saat input kosong.
10.5 Banner Krisis (jangan dilewatkan)
Jika detectRisk() mendeteksi risiko pada pesan user (lihat src/lib/crisisDetection.ts):

Tampilkan banner tenang di atas jendela chat (bukan di dalam bubble, bukan popup mengagetkan), bg lembut netral (bukan orange-500 yang terkesan promosi), berisi pesan singkat + kontak hotline dari CRISIS_RESOURCES.
Banner tidak boleh auto-dismiss — user harus sadar melihatnya, tapi tetap bisa ditutup manual.
Styling tidak boleh memakai warna/animasi playful (lihat catatan di Bagian 12).
10.6 State "Out of Chat Limit" (Free tier)
Modal overlay (bukan halaman baru), bg orange-100, ilustrasi kecil, teks "Kuota chat harian habis", tombol "Upgrade ke Zyba Plus →" (orange-500) dan link kecil "Nanti saja" untuk menutup modal.
10.7 Companion Sidebar — Spek Final (Satu-satunya Sumber Kebenaran)
Ini menggantikan seluruh penjelasan sidebar di Bagian 10.1 sebelumnya. CompanionSidebar.tsx adalah satu-satunya komponen yang menampilkan navigasi + daftar percakapan untuk section /companion. ConversationList.tsx boleh tetap ada sebagai sub-komponen, tapi hanya dipanggil dari dalam CompanionSidebar.tsx, tidak pernah dari page.tsx secara langsung.

Gaya visual: niru struktur sidebar Claude.ai (minimal, list bersih, tanpa card/border berat per item) — bukan gaya card dengan avatar bulat + preview teks + badge mood yang sempat diimplementasikan (itu yang bikin sidebar terasa berat/dobel secara visual). Detail:

Header kecil: tombol "← Kembali ke ZYBA" (teks text-brown-700, bukan tombol solid — kesan "keluar", bukan aksi utama).
Tombol "+ Percakapan Baru" — full-width, rounded-xl (bukan pill penuh), bg orange-500, teks putih, satu-satunya tombol "baru" di seluruh sidebar (jangan ada tombol "+ Baru" kedua di tempat lain).
Search input tipis di bawahnya, placeholder "Cari percakapan...", hanya satu search box (bukan dobel).
Label section kecil huruf kapital abu-abu: "RIWAYAT PERCAKAPAN" — mengikuti pola label "Pinned"/"Chats and tasks" di Claude.ai.
List item: teks-minimal, TANPA avatar bulat berinisial dan TANPA cuplikan pesan (preview text). Cukup: judul percakapan 1 baris (truncate), waktu relatif kecil di kanan (text-xs text-brown-700), dan satu titik kecil (bukan badge/chip) warna sesuai mood dominan percakapan, ditaruh di depan judul — subtle, bukan elemen visual utama.
Hover state: bg-green-100 tipis, tanpa border/shadow.
Item aktif: bg-green-100 + garis kiri 3px border-orange-500 (bukan card terpisah dengan padding beda).
Kode referensi implementasi:

// src/app/companion/components/CompanionSidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type ConversationSummary = {
  id: string;
  title: string;
  relativeTime: string;
  mood?: "depressed" | "sad" | "neutral" | "happy" | "overjoyed";
  isActive?: boolean;
};

const MOOD_DOT: Record<string, string> = {
  depressed: "bg-mood-depressed",
  sad: "bg-mood-sad",
  neutral: "bg-mood-neutral",
  happy: "bg-mood-happy",
  overjoyed: "bg-mood-overjoyed",
};

export default function CompanionSidebar({
  conversations,
}: {
  conversations: ConversationSummary[];
}) {
  const [query, setQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="w-72 shrink-0 border-r border-brown-900/10 bg-cream min-h-screen flex flex-col">
      <div className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-brown-700 hover:text-brown-900 mb-4"
        >
          ← Kembali ke ZYBA
        </Link>

        <button
          type="button"
          className="w-full rounded-xl bg-orange-500 text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
        >
          + Percakapan Baru
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari percakapan..."
          className="w-full mt-3 rounded-lg border border-brown-900/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="px-4 pb-2">
        <span className="text-xs font-semibold text-brown-700/60 tracking-wide">
          RIWAYAT PERCAKAPAN
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/companion/${c.id}`}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
              c.isActive
                ? "bg-green-100 border-l-[3px] border-orange-500 pl-[9px]"
                : "hover:bg-green-100 border-l-[3px] border-transparent pl-[9px]"
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              {c.mood && (
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${MOOD_DOT[c.mood]}`}
                  aria-hidden
                />
              )}
              <span className="truncate text-brown-900">{c.title}</span>
            </span>
            <span className="text-xs text-brown-700 shrink-0">
              {c.relativeTime}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
Header jendela chat (dipindah dari Bagian 10.1 lama, tetap berlaku, dirender di dalam ChatHeader.tsx — bukan bagian dari sidebar): avatar maskot ZYBA, nama "Zyba Companion", status "● Online" (titik green-500), chip emosi di kanan (bg sesuai token mood, rounded-pill kecil), ikon pengaturan (gear) → modal "Chatbot Settings" (Casual/Formal/Fun).

Wajib dicek saat implementasi: pastikan companion/layout.tsx me-render <CompanionSidebar /> satu kali, dan companion/page.tsx (atau companion/[id]/page.tsx) tidak mengimpor/merender ConversationList atau sidebar apa pun secara langsung — hanya ChatHeader + ChatMessages + ChatInput.

10.8 Aturan Bobot Visual (Kenapa Masih "Beda Banget" dari Claude.ai)
Implementasi pertama sudah benar secara struktur (posisi sidebar, list, input), tapi masih terasa jauh dari Claude.ai karena bobot visualnya kebanyakan — border berwarna, background solid, dan toolbar yang berat. Aturan berikut wajib diikuti supaya kesan "minimal/lapang" tercapai, bukan cuma posisi elemen:

Tidak ada toolbar penuh di bagian paling atas halaman. Model selector ("Gemini 1.5 Flash") dan toggle gaya ("Casual/Formal/Fun") tidak boleh jadi baris terpisah di atas semua konten — pindahkan ke dalam/tepat di bawah kotak input chat, persis seperti posisi "Sonnet 5 · Medium" + toggle "Chat/Cowork" di Claude.ai yang menempel ke input, bukan mengambang di header halaman. Satu-satunya elemen yang boleh tetap di pojok kanan atas adalah badge plan ("Zyba Free"/tombol upgrade), setara posisi "Free plan · Upgrade" di Claude.ai.
Item sidebar aktif/hover TIDAK memakai border berwarna atau background solid mencolok. Ganti dari bg-green-100 border-l-[3px] border-orange-500 (terlalu berat) menjadi background abu-abu/cream sedikit lebih gelap dari base (bg-brown-900/5 misalnya) tanpa border sama sekali — subtle, hampir tidak terlihat kalau tidak diperhatikan, sama seperti hover state di Claude.ai.
Kotak input chat TIDAK memakai border/outline berwarna. Hapus border-orange-500 di sekeliling input box. Cukup bg-white atau bg-cream dengan sedikit shadow halus (shadow-sm), tanpa border warna — fokus state boleh sedikit ring tipis netral, bukan oranye tebal.
Chip emosi di chat header dibuat lebih ringan. Bukan background solid hijau/oranye penuh dengan teks putih tebal — pakai versi lebih muted: teks warna sesuai mood, background sangat tipis/transparan (bg-green-500/10 misalnya), tanpa terlihat seperti tombol/CTA.
Prinsip umum: kalau ragu apakah suatu elemen "terlalu ramai", bandingkan ke referensi Claude.ai — Claude.ai nyaris tidak punya elemen dengan background warna solid selain tombol aksi utama ("+ New" dan tombol kirim). Semua elemen lain (list, header, badge) memakai warna netral/transparan tipis.
Aturan yang sama berlaku untuk Community Sidebar (Bagian 11.5) — bandingkan ke bobot visual Threads yang juga minim border, mengandalkan whitespace dan divider tipis, bukan card/box berwarna.

11. Spesifikasi Redesign Zyba Community (Gaya Threads)
Referensi: layout feed ala Threads — sidebar kiri untuk navigasi, kolom feed di tengah, compose box di atas, tiap post berupa card dengan avatar+nama+waktu, teks, opsional gambar, dan action row (like, comment, repost, share). Struktur diikuti, tapi seluruh warna diganti ke palet ZYBA (Threads pakai dark/monokrom; ZYBA pakai cream/putih/coklat/hijau/oranye) — jangan bikin Community jadi dark-mode terpisah dari sisa app.

11.1 Layout
Sidebar kiri: pakai sidebar utama ZYBA yang sudah ada (Bagian 5.1) — tidak perlu sidebar terpisah khusus Community seperti di Threads, supaya navigasi tetap konsisten satu sistem di seluruh app.
Kolom feed (tengah, max-width ~600px, center di sisa ruang setelah sidebar): daftar post vertikal.
Tab sekunder di atas feed: "For You" / "Following" — style pill toggle, aktif = bg brown-900 teks putih, non-aktif = teks brown-700.
11.2 Compose Box (di atas feed, sebelum list post)
Card putih rounded-2xl, avatar user kiri, input placeholder "Ada cerita apa hari ini?", tombol "Post" kanan (bg orange-500, rounded-pill, disabled abu-abu kalau kosong).
Ikon attachment kecil di bawah input (foto, tag mood) — opsional, mengikuti pola "Add An Attachment" dari Figma asli.
11.3 Post Card
Struktur per-post (mengikuti pola Threads di referensi, dengan penyesuaian):

Header: avatar bulat, nama pengguna (bold, brown-900), badge "Terverifikasi" kecil kalau relevan (centang hijau green-500, bukan biru), waktu relatif (text-brown-700 text-sm), ikon "..." (menu: report/hapus) di ujung kanan.
Body: teks post (text-brown-900), hashtag di-style text-orange-500 (mis. #zybarocks, #gratefulness — ganti semua contoh hashtag lama yang menyebut "freud" jadi "zyba", lihat Bagian 2).
Gambar (opsional): rounded-xl, max-height terbatas, object-cover.
Action row (ikon outline, bukan solid, ukuran konsisten ~20px, gap merata):
❤️ Like — icon outline brown-700, saat aktif jadi solid orange-500 (bukan merah, supaya tetap dalam palet brand) + jumlah.
💬 Comment — buka thread balasan (inline expand di bawah post atau halaman detail).
🔁 Repost/Share ulang ke feed sendiri — icon panah melingkar.
➤ Share/kirim — icon kertas terbang, untuk share link post keluar app.
Semua angka count di sebelah kanan tiap ikon, text-sm text-brown-700.
Divider tipis border-brown-900/10 antar post, bukan card terpisah dengan shadow — supaya feed terasa mengalir seperti Threads, bukan tumpukan kartu terputus-putus.
11.4 Interaksi Tambahan
Comment: klik ikon comment → expand inline textarea kecil di bawah post (pola Threads: reply langsung di feed, tidak selalu pindah halaman) — untuk thread panjang, baru buka halaman detail post.
Empty state (belum follow siapa pun / feed kosong): ilustrasi ramah + headline "Belum ada cerita di sini" + CTA "Jelajahi komunitas →".
Privasi: tetap tampilkan indikator kecil di compose box "Postingan ini terlihat oleh komunitas" — mengingatkan bahwa ini beda dari curhat privat ke Zyba Companion (poin dari catatan privasi di Bagian 12).
11.5 Contextual Sidebar & Transisi Masuk/Keluar
Pakai pola yang sama seperti Bagian 10.7 (Zyba Companion), tapi isi sidebar-nya mengikuti struktur nav Threads (referensi: "For you", "New thread", "Search", "Messages", "Activity", "Profile", "Insights", lalu section "Other feeds": Following/Saved/Liked/Archive) — struktur navigasinya diikuti, warnanya tetap palet ZYBA.

⚠️ Pelajaran dari bug di Zyba Companion: pastikan CommunitySidebar.tsx adalah satu-satunya komponen navigasi yang dirender di community/layout.tsx. Jangan sampai ada komponen nav/tab lain yang dirender terpisah di community/page.tsx sehingga muncul dobel (dua tombol "Postingan Baru", dua search box, dst.) — gaya visual list juga ikuti prinsip minimal ala Claude.ai (Bagian 10.7): teks bersih, tanpa card berat per item nav.

⚠️ Update dari Bagian 10.8: item nav "Untuk Kamu" (dan item lain) tidak boleh pakai background pill solid bg-green-100 penuh sebagai active state — itu aturan versi lama sebelum Bagian 10.8 ditulis. Ganti ke aturan bobot visual terbaru: background sangat tipis (bg-brown-900/5), tanpa border warna, teks tetap bold untuk menandakan aktif. Terapkan ke semua item sidebar (Untuk Kamu, Postingan Baru, Cari, Notifikasi, Profil, dan section Feed Lain) secara konsisten — jangan cuma item pertama yang di-style ulang.

11.6 Modal "Postingan Baru" (trigger dari tombol + mengambang)
⚠️ Temuan review (penting): CreatePostModal.tsx saat ini tidak pernah dirender di community/page.tsx — file-nya ada tapi dead code, tidak ada import/mount sama sekali. Tombol "+" mengambang dan "Postingan Baru" di sidebar saat ini terhubung ke handleScrollToCompose (scroll ke ComposeBox inline di atas feed + fokus textarea), bukan membuka modal. Selain itu, styling di dalam CreatePostModal.tsx masih pakai bg-black/40 backdrop-blur-sm + flex items-center justify-center (dark overlay, centered modal) — bukan floating card sesuai spek di bawah. Klaim "sudah floating card style" di laporan sebelumnya tidak akurat, sudah diverifikasi langsung ke kode.

Keputusan desain: pertahankan ComposeBox inline di atas feed untuk posting cepat (ini sudah bagus, sesuai Bagian 11.2) — tapi tombol "+" mengambang harus membuka CreatePostModal sebagai floating card terpisah (bukan cuma scroll ke compose box), karena modal punya fitur lebih lengkap (attachment row, dst.) yang tidak muat di compose box inline. Dua entry point ini memang berbeda fungsi, persis seperti Threads (ada compose box inline "What's new?" DAN tombol + yang buka modal terpisah).

Saat user klik tombol "+" mengambang (pojok kanan bawah), munculkan modal compose mengambang (bukan halaman baru, bukan modal full-screen gelap yang menutup seluruh layar) — persis pola "New thread" di Threads: sisa feed di belakang tetap terlihat, cuma ada card compose yang muncul di atas.

Posisi & perilaku: floating card muncul dari kanan bawah (dekat tombol +), TIDAK ada backdrop gelap penuh layar menutupi seluruh konten di belakangnya — beda dari modal biasa yang mem-blur/menggelapkan semua. Klik "Batal" atau ikon X di pojok kiri atas card untuk menutup.

Struktur card, urutan top-to-bottom:

Header: "Batal" (teks link, kiri) — judul "Postingan Baru" (tengah/kiri, bold) — ikon "..." opsi lain (kanan).
Baris identitas: avatar bulat kecil user + nama + (opsional) breadcrumb "Komunitas atau topik" kalau fitur topik/kategori sudah ada, kalau belum jangan dipaksakan.
Textarea placeholder "Ada cerita apa hari ini?"
Baris ikon attachment (outline, text-brown-700, ukuran kecil sejajar horizontal): gambar, GIF, emoji, stiker, polling, dokumen, lokasi, musik — sesuaikan mana yang relevan/sudah ada backend-nya, jangan tambah ikon untuk fitur yang belum diimplementasikan.
Footer: kiri "Opsi Postingan" (teks kecil, opsional), kanan tombol "Post" (bg-orange-500, teks putih, rounded-pill).
Warna: card bg-white, border tipis border-brown-900/10, shadow halus (shadow-lg) supaya kesan "mengambang" di atas feed — bukan dark card ala Threads asli, dan bukan bg-black/40 full backdrop.

Wajib dicek sebelum lapor "selesai":

CreatePostModal diimpor dan dirender di community/page.tsx, dengan state isOpen/showModal yang benar-benar mengontrol tampil/tidaknya.
Tombol "+" mengambang → onClick mengubah state itu jadi true (bukan lagi onClick={handleScrollToCompose}).
Style di dalam CreatePostModal.tsx diganti dari bg-black/40 backdrop-blur-sm flex items-center justify-center (centered dark modal) menjadi floating card kanan-bawah sesuai spek di atas.
Test manual: klik tombol "+" di browser (bukan cuma baca kode), pastikan card benar-benar muncul di layar.
Urutan interaksi: sama seperti Bagian 10.7 — klik "Zyba Community" di sidebar utama → animasi transisi (fade+slide) sambil src/app/community/loading.tsx tampil → sidebar utama diganti Community Sidebar (komponen CommunitySidebar.tsx yang sudah ada di repo, sesuaikan isinya) berupa:

Tombol "← Kembali ke ZYBA" paling atas (sama seperti 10.7, permanen & beda style dari item lain).
Nav utama: "Untuk Kamu" (For You), "Postingan Baru" (New Thread → buka CreatePostModal.tsx yang sudah ada), "Cari", "Notifikasi" (Activity).
Section "Feed Lain": Mengikuti, Disimpan, Disukai — pakai istilah Indonesia, bukan literal terjemahan Threads.
Warna aktif nav item: bg-green-100 (konsisten sama sidebar utama), bukan putih/dark solid ala Threads asli.
Klik "← Kembali ke ZYBA" → transisi balik → sidebar utama & /dashboard muncul kembali, sama seperti 10.7.

Implementasi: src/app/community/layout.tsx (buat kalau belum ada) me-render Community Sidebar menggantikan <Sidebar /> utama, mengikuti pola yang sama dengan /companion.

13. Performa & Skalabilitas
13.1 Database & Query
Semua endpoint list/feed wajib pakai pagination (take/skip atau cursor-based) — terutama api/community (feed bisa jadi ribuan post), riwayat MoodEntry, dan Message per Conversation. Jangan findMany() tanpa take di data yang bisa tumbuh besar.
Hindari N+1 query: kalau butuh data user + posts + likes sekaligus, pakai include/select Prisma dalam satu query, jangan loop query per item di dalam .map().
Pertahankan pola index yang sudah ada (@@index([userId, createdAt])) secara konsisten di semua model yang di-query per-user+waktu (MoodEntry, JournalEntry, ActivityLog, Message, CommunityPost) — cek schema.prisma, tambahkan index yang belum ada.
DATABASE_URL (pooled/PgBouncer) dipakai untuk semua query runtime; DIRECT_URL hanya untuk migrate/db push. Jangan sampai ada kode yang connect pakai DIRECT_URL saat runtime — itu bikin koneksi cepat habis saat traffic naik.
13.2 Caching & Data Fetching
Halaman dengan data yang jarang berubah (Resources, statistik agregat Dashboard) pakai Next.js caching/ISR (revalidate), bukan cache: "no-store" di semua fetch tanpa alasan.
Community feed & Companion chat (data yang sering berubah) boleh tetap dinamis, tapi tetap dipaginate — dinamis ≠ boleh fetch semua data sekaligus.
Ambil data awal lewat Server Component saat halaman pertama dimuat; fetch di client-side cukup untuk aksi interaktif (kirim pesan baru, post baru), bukan untuk re-fetch seluruh list setiap render.
13.3 Performa Frontend
Semua gambar (avatar, attachment post, ilustrasi) wajib pakai next/image, bukan <img> — otomatis lazy-load, resize, dan format modern.
Modal yang berat (CreatePostModal, Chatbot Settings) di-load dengan next/dynamic (ssr: false kalau tidak butuh SEO) supaya tidak masuk bundle awal halaman.
Input pencarian (Cari percakapan..., Cari... di Community) wajib di-debounce (~300ms) — jangan filter/fetch di setiap keystroke tanpa jeda.
Animasi transisi (Bagian 10.7/11.5) pakai transform/opacity (GPU-accelerated), hindari animasi pada width/height yang memicu reflow/layout thrashing.
13.4 Rate Limiting & Proteksi Beban
Endpoint yang menerima teks bebas dan/atau memanggil AI provider (companion chat, detectRisk, community post) idealnya dibatasi rate per user (mis. maksimal N request/menit) — mencegah spam sekaligus mencegah biaya API AI membengkak tak terkendali.
OTP endpoint (api/auth/otp) harus punya batas percobaan + cooldown (kalau belum ada) — ini juga bagian dari keamanan (Bagian 8), bukan cuma performa.
14. Hapus Semua Data Dummy — Ganti ke Data Real
Audit berikut wajib dilakukan sebelum submit final — banyak bagian masih memakai data contoh dari tahap awal development:

INITIAL_POSTS (array hardcoded) di community/page.tsx → ganti jadi fetch dari /api/community yang sudah ada, jangan ada lagi seed data tertulis langsung di komponen frontend.
Contoh percakapan dummy (mis. "Overthinking Seputar Tugas Akhir", "Evaluasi Kualitas Tidur") di CompanionSidebar → pastikan ini hanya tampil kalau memang tersimpan di database milik user yang sedang login, bukan default yang selalu muncul untuk user baru.
Angka statistik contoh (mis. "2.541 Conversations", "34/365") di Dashboard (Bagian 4.E) → pastikan berasal dari query agregat real (_count, aggregate), bukan angka yang ditulis manual di JSX.
Nama user contoh ("Alex Rivera", "Shinomiya") boleh tetap ada sebagai seed data development di prisma/seed.ts, tapi tidak boleh jadi fallback default yang tampil diam-diam kalau fetch data user asli gagal — pastikan ada loading state/empty state yang jelas, bukan menampilkan data orang lain.
Setelah data/*.json dibersihkan dari git (Bagian 8.5.2), pastikan juga tidak lagi jadi sumber data yang secara keliru dianggap "data real" saat demo — beri log/warning yang jelas kalau app sedang jalan di mode fallback.
Cara audit cepat: cari string literal berupa nama orang, angka statistik, atau isi percakapan yang ditulis langsung di file .tsx (bukan dari props, fetch, atau useState yang diawali kosong/null) — itu kandidat dummy data yang harus ditelusuri satu per satu.
15. Responsif di Mobile (Perluasan Bagian 5)
Bagian 5 sudah menetapkan breakpoint dasar (desktop ≥1024px, tablet 768–1023px, mobile <768px). Detail tambahan per halaman:

Sidebar utama & sidebar kontekstual (Companion/Community): di <768px, sidebar tidak boleh selalu terbuka menutupi konten. Ubah jadi off-canvas drawer yang di-toggle lewat ikon hamburger, default tertutup saat halaman dibuka.
Dashboard grid (3-kolom di desktop, Bagian 4.E) → 1 kolom stack penuh di mobile.
Community feed (max-width 600px center di desktop) → full-width dengan padding kiri-kanan kecil di mobile.
Companion chat: pastikan font tidak mengecil di bawah 14px, dan tap target (tombol kirim, ikon attachment/mic) minimal 44×44px sesuai standar aksesibilitas mobile.
Modal (CreatePostModal, Chatbot Settings, dll.): di desktop floating card kanan-bawah → di mobile jadi bottom-sheet full-width (slide dari bawah), bukan card kecil yang terpotong di layar sempit.
Wajib dites minimal di breakpoint 375px (iPhone SE), 390px (iPhone standar), dan 768px (tablet) sebelum dianggap "responsif" — bukan cuma di-resize browser sekilas.
16. Kebersihan Repo — Audit File/Folder Duplikat
⚠️ Klarifikasi penting: file seperti src/components/GoogleAuthProfileModal.tsx yang isinya cuma export { default } from "@/components/ui/GoogleAuthProfileModal" bukan bloat/dummy — itu re-export shim yang disengaja untuk backward compatibility import path (pola yang sama seperti lib/*.ts yang sudah dibahas di Bagian 8). Jangan dihapus, kecuali sudah dipastikan tidak ada satu pun file lain yang masih meng-import dari path lama itu.

Yang beneran perlu diaudit dan dibersihkan:

Folder daily-assessment/ — kalau merge ke mood-check-in (Bagian 8.5.1) sudah dieksekusi, pastikan foldernya beneran terhapus dari filesystem, bukan cuma di-unlink dari sidebar tapi file-nya masih nyangkut di repo.
Komponen yang jadi dead code (tidak pernah di-import di mana pun) — misalnya kasus CreatePostModal.tsx sebelum diperbaiki (Bagian 11.6), yang sempat ada tapi tidak pernah dirender. Cara cek: grep -r "NamaComponent" di seluruh src/; kalau cuma muncul di file definisinya sendiri, itu kandidat dead code.
data/*.json — sudah dibahas di Bagian 8.5.2, harus keluar dari git history sepenuhnya.
Cara aman melakukan pembersihan: jangan hapus file secara manual tanpa cek referensi dulu. Jalankan grep -r "NamaComponent" atau grep -r "from.*NamaFile" di seluruh src/ sebelum menghapus apa pun — kalau masih ada referensi aktif (bukan cuma shim backward-compat), jangan dihapus, cari dulu kenapa masih dipakai.
17. Checklist Final Sebelum Submit/Deploy
Gabungan semua item wajib dari seluruh dokumen ini — centang satu-satu sebelum dianggap selesai:

Konsistensi Fitur & Repo Hygiene (temuan review kedua, Bagian 8.5–8.6):

 daily-assessment dan mood-check-in sudah digabung jadi satu flow, folder yang tidak dipakai sudah dihapus.
 middleware.ts memblokir akses ke semua fitur lain sampai onboardingCompleted = true (gate assessment awal, lihat Bagian 4.C).
 data/*.json sudah masuk .gitignore dan dihapus dari git history (tidak ada lagi bcrypt hash password di repo).
 Mekanisme fallback storage (kalau dipertahankan) sudah didokumentasikan di README.
 Folder/komponen discord/ sudah di-rename jadi nama yang sesuai ZYBA, label status presence (kalau dipertahankan) sudah disesuaikan konteks wellness, bukan istilah gamer.
Keamanan (prioritas tertinggi, lihat Bagian 8):

 Password di-hash pakai bcrypt/argon2, tidak ada lagi plain text di mana pun.
 Session token acak & ditandatangani server, tidak bisa ditebak dari user.id.
 OTP tidak pernah dikembalikan di response API.
 Landing page publik sudah menggantikan render dashboard langsung di /.
Konten & Safety (kesehatan mental):

 Konten placeholder di layar "Expression Analysis" (Bagian 4.C) sudah diganti dari contoh krisis/ide bunuh diri ke contoh netral.
 detectRisk() dari crisisDetection.ts dipanggil di semua endpoint yang menerima teks bebas (journal, expression analysis, chat companion, post community).
 Banner/CTA terkait krisis tidak memakai styling playful/marketing (lihat 10.5) — tenang dan jelas.
 Semua branding "Doctor Freud.AI" sudah diganti "Zyba Companion" di seluruh kode, termasuk contoh hashtag di Community (Bagian 11.3).
Desain & UX:

 Zyba Companion pakai layout dua-panel + empty state dengan prompt starter (Bagian 10).
 Zyba Community pakai struktur feed ala Threads dengan palet ZYBA, bukan dark mode terpisah (Bagian 11).
 /companion dan /community masing-masing punya contextual sidebar sendiri (bukan sidebar utama) dengan tombol "← Kembali ke ZYBA" permanen di atas, plus animasi transisi masuk/keluar (Bagian 10.7 & 11.5).
 page.tsx di /companion dan /community tidak merender sidebar/nav/list apa pun secara langsung — itu semua hanya di dalam layout.tsx masing-masing (cegah bug dobel panel, lihat Bagian 10.7).
 Tidak ada toolbar full-width di atas halaman Companion (model selector menempel ke input, bukan header terpisah); sidebar item aktif tidak pakai border/bg solid mencolok; input box tanpa outline warna (Bagian 10.8).
 Semua item Community Sidebar (bukan cuma item pertama) konsisten pakai hover/active state tipis sesuai Bagian 10.8, bukan pill solid bg-green-100 versi lama.
 CreatePostModal benar-benar di-import & dirender di community/page.tsx dengan state kontrol yang valid, tombol "+" mengambang mengubah state itu (bukan lagi handleScrollToCompose), dan sudah dites klik langsung di browser — bukan cuma dibaca dari kode (Bagian 11.6).
 Semua warna pakai kelas Tailwind dari Bagian 3.1, tidak ada hex baru yang keluar dari palet.
 Layout desktop konsisten: sidebar kiri fixed, container max-width 1200–1280px (Bagian 5).
Performa & Skalabilitas (Bagian 13):

 Semua endpoint list/feed pakai pagination, tidak ada findMany() tanpa take di data yang bisa tumbuh besar.
 Semua gambar pakai next/image, bukan <img>.
 Input pencarian di-debounce (~300ms).
 Rate limiting sudah ada di endpoint chat/companion, community post, dan OTP.
Hapus Data Dummy (Bagian 14):

 INITIAL_POSTS dan hardcoded lain di community/page.tsx sudah diganti fetch dari API asli.
 Statistik dashboard (conversations count, streak, dll.) berasal dari query agregat real, bukan angka manual di JSX.
 Tidak ada data user contoh ("Alex Rivera") yang tampil sebagai fallback diam-diam kalau fetch user asli gagal.
Responsif Mobile (Bagian 15):

 Sidebar (utama, Companion, Community) jadi off-canvas drawer di <768px, bukan selalu terbuka.
 Dashboard grid, Community feed, dan Modal sudah dites di breakpoint 375px, 390px, dan 768px.
Kebersihan Repo (Bagian 16):

 Folder daily-assessment/ benar-benar terhapus dari filesystem (bukan cuma di-unlink dari nav) — kalau merge sudah dieksekusi.
 Sudah di-grep dulu sebelum menghapus file apa pun — tidak ada referensi aktif yang ikut rusak.
 Re-export shim (lib/*.ts, components/*.tsx yang isinya cuma export { default } from ...) dipertahankan, tidak ikut terhapus karena dikira dummy/bloat.
Dokumen ini konsolidasi dari: review visual Figma UI kit awal, review langsung ke kode github.com/syauqiazka/zyba / zyba_, dan referensi gaya (landing page ala OpenRouter, Companion ala Claude.ai, Community ala Threads) — semua warna referensi eksternal disesuaikan ke palet ZYBA, bukan ditiru mentah-mentah.