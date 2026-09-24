AGENTS.md — ZYBA Web (Desktop)
Dokumen ini adalah satu-satunya sumber acuan untuk coding agent (Hermes+9Router, Antigravity, atau agent lain) yang melanjutkan development ZYBA. Semua keputusan desain, hasil review, dan perbaikan yang wajib dilakukan digabung di sini — agent tidak perlu mencari konteks di tempat lain.

⚠️ Baca urutan ini sebelum coding apa pun:

Bagian 8 — Status Review & Prioritas Perbaikan — 3 isu keamanan yang HARUS diperbaiki duluan.
Bagian 28 — Checklist Final — daftar centang sebelum submit lomba/deploy.
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
⚠️ Update (menggantikan spek font sebelumnya): rekomendasi font awal dari pitch deck (Montserrat + Poppins) tidak dipakai di implementasi akhir — tim memutuskan pakai DM Sans + Manrope, sudah terpasang di tailwind.config.ts dan globals.css. Ini font resmi yang berlaku sekarang.

Manrope (weight 500/600/700/800) — font-display, dipakai untuk judul besar/display (32–40px), H1-H2 (18–24px).
DM Sans (weight 400/500/600/700) — font-body, dipakai untuk isi/body (14–16px), caption (12px).
Kelas Tailwind: font-display dan font-body (sudah dikonfigurasi, tinggal pakai langsung di className).
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
B & C. Profile Setup + Mental Health Assessment — Satu Flow di /assessment
⚠️ Klarifikasi arsitektur: /assessment bukan cuma kuisioner kesehatan mental — itu route gabungan yang mencakup profile setup DAN assessment, dijalankan sebagai satu flow berurutan tepat setelah login/signup pertama kali. Sebelumnya kedua hal ini (B dan C) terlihat seperti dua bagian terpisah di taksonomi — ini diperjelas jadi satu flow tunggal. Dicek langsung ke kode: step profile setup (avatar, OTP, notifikasi) belum ada sama sekali baik di /assessment maupun /onboarding saat ini — ini gap nyata yang perlu diisi, bukan cuma soal penamaan ulang.

Urutan step di dalam /assessment (satu flow, progress bar berjalan dari awal sampai akhir):

Select Avatar, Profile Setup (nama, bio, dll.)
Password Setup (strength meter) — kalau belum diisi saat signup di /onboarding
OTP Setup & Verifikasi (4 digit)
Fingerprint Setup (opsional, skip kalau device tidak support)
Notification Setup (toggle companionNotif/wellnessNotif/communityNotif — langsung terhubung ke model NotificationPref, Bagian 17)
Kuisioner kesehatan mental: goal, gender, usia, berat, mood, riwayat bantuan profesional, gejala fisik, kualitas tidur, level stres, obat, gejala mental lain, AI Expression Analysis
Compiling Data (loading state)
"You're All Set Up" — di titik inilah User.onboardingCompleted di-set true
Pembagian tanggung jawab route (biar tidak tumpang tindih):

/onboarding — Welcome carousel + Sign Up/In + pembuatan akun (email/password/Google) saja. Berakhir begitu akun berhasil dibuat.
/assessment — semua langkah setelah akun dibuat sampai user benar-benar siap pakai app (profile setup + kuisioner kesehatan mental digabung, 8 step di atas). Ini satu-satunya tempat kedua hal itu terjadi.
/settings — tempat user mengubah kembali data yang sama (avatar, notifikasi, dll.) setelah onboarding selesai — bukan tempat pengisian pertama kali.
Alur akses (wajib diimplementasikan di middleware.ts): setelah akun dibuat (User.onboardingCompleted = false), user tidak boleh bisa mengakses fitur lain (/dashboard, /companion, /mood-check-in, /community, /activity, /wellness-journey, /resources) sebelum menyelesaikan seluruh flow /assessment (8 step di atas). Middleware harus redirect otomatis ke /assessment selama onboardingCompleted === false, dan baru mengizinkan akses penuh setelah field ini di-set true (di step terakhir, "You're All Set Up"). Setelah onboardingCompleted = true, user tidak diarahkan ke /assessment lagi kecuali memang mau mengulang assessment kesehatan mentalnya (fitur terpisah, opsional, dipicu manual dari /settings).

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
14.1 Bug Hydration Mismatch — Penyebab Layout "Konten Terdorong ke Bawah"
⚠️ Temuan review kode: dashboard/page.tsx (dan kemungkinan halaman sidebar lain dengan pola serupa) membaca localStorage langsung di dalam initializer useState(() => { if (typeof window !== "undefined") {...} }). Pola ini menyebabkan hydration mismatch — server merender versi kosong (karena localStorage tidak ada di server), lalu client langsung merender ulang dengan data cache yang berbeda begitu hydrate. Gejala yang dilaporkan user: halaman menampilkan area kosong besar di bagian atas viewport dan konten utama (card "Welcome Back", dst.) seperti "terdorong" ke bawah, disertai indikator "beberapa errors" di overlay dev Next.js — kemungkinan besar berasal dari bug ini, dikombinasikan dengan animasi slide-in-from-bottom-3 di template.tsx yang terganggu prosesnya.

Perbaikan: pindahkan pembacaan localStorage dari initializer useState ke dalam useEffect yang jalan setelah mount, dengan state awal yang selalu konsisten antara server dan client (mis. semua field null/default kosong), baru di-update lewat setUserData(...) di useEffect. Pola aman:

// SALAH — baca localStorage di initializer useState (beda antara server & client)
const [userData, setUserData] = useState(() => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("zyba_user_cache");
    // ...
  }
});

// BENAR — state awal konsisten, localStorage dibaca setelah mount di useEffect
const [userData, setUserData] = useState(DEFAULT_USER_DATA); // sama persis di server & client

useEffect(() => {
  try {
    const cached = localStorage.getItem("zyba_user_cache");
    if (cached) setUserData(JSON.parse(cached));
  } catch {}
}, []);
Terapkan pola ini ke semua halaman yang punya kode serupa (cek dengan grep -rn "typeof window" src/app/*/page.tsx), bukan cuma Dashboard — karena user melaporkan gejala ini muncul di semua halaman yang pakai sidebar utama.

15. Responsif di Mobile (Perluasan Bagian 5)
Bagian 5 sudah menetapkan breakpoint dasar (desktop ≥1024px, tablet 768–1023px, mobile <768px). Detail tambahan per halaman:

Sidebar utama & sidebar kontekstual (Companion/Community): di <768px, sidebar tidak boleh selalu terbuka menutupi konten. Ubah jadi off-canvas drawer yang di-toggle lewat ikon hamburger, default tertutup saat halaman dibuka.
Dashboard grid (3-kolom di desktop, Bagian 4.E) → 1 kolom stack penuh di mobile.
Community feed (max-width 600px center di desktop) → full-width dengan padding kiri-kanan kecil di mobile.
Companion chat: pastikan font tidak mengecil di bawah 14px, dan tap target (tombol kirim, ikon attachment/mic) minimal 44×44px sesuai standar aksesibilitas mobile.
Modal (CreatePostModal, Chatbot Settings, dll.): di desktop floating card kanan-bawah → di mobile jadi bottom-sheet full-width (slide dari bawah), bukan card kecil yang terpotong di layar sempit.
Wajib dites minimal di breakpoint 375px (iPhone SE), 390px (iPhone standar), dan 768px (tablet) sebelum dianggap "responsif" — bukan cuma di-resize browser sekilas.
15.1 Regresi Desktop Akibat Implementasi Off-Canvas Sidebar (Bug Aktif)
⚠️ Dilaporkan user: setelah sidebar dibuat responsif untuk mobile (off-canvas drawer + tombol hamburang fixed top-4 left-4 md:hidden), tampilan desktop jadi rusak — konten utama terdorong turun, ada area kosong besar di bagian atas viewport (gejala sama seperti Bagian 14.1, tapi kali ini penyebabnya bukan hydration, melainkan regresi dari perubahan sidebar responsif).

Pola bug yang paling umum untuk kasus ini (cek satu-satu di kode sidebar/layout terbaru):

Spacing/margin khusus mobile yang lupa di-reset di desktop. Kalau ada pt-16 atau sejenisnya di <main>/wrapper konten untuk menghindari tombol hamburger fixed menutupi konten di mobile, pastikan itu ditulis pt-16 md:pt-0 (atau breakpoint yang sesuai) — bukan pt-16 polos yang kebawa ke semua ukuran layar.
Wrapper sidebar fixed md:sticky ... h-screen — cek apakah ada elemen sibling di <div class="flex"> (level yang sama dengan spacer w-64 dan <main>) yang ikut memengaruhi tinggi/posisi vertikal parent flex container-nya karena perubahan structural saat menambahkan drawer mobile.
align-items pada parent flex container (<div class="flex"> yang membungkus spacer sidebar + <main>) — kalau berubah dari default stretch jadi center (sengaja atau tidak sengaja saat refactor), <main> akan menyusut ke tinggi kontennya sendiri dan ke-center vertikal di tengah tinggi sidebar yang h-screen, menyisakan ruang kosong di atas.
Instruksi verifikasi: buka DevTools di desktop, inspect elemen <div class="flex"> yang membungkus sidebar-spacer + <main>, cek tab Computed untuk align-items — kalau nilainya center, itu penyebabnya, ubah balik ke default (hapus class items-center yang tidak sengaja ketambahan) atau eksplisit items-stretch.

Prinsip pencegahan ke depan: setiap kali menambah class khusus mobile (padding, margin, position, height) untuk kebutuhan responsif, selalu pikirkan apakah itu perlu di-reset eksplisit di breakpoint md: ke atas — jangan asumsikan default Tailwind akan "otomatis benar" di desktop kalau sudah override sesuatu di mobile.

16. Kebersihan Repo — Audit File/Folder Duplikat
⚠️ Klarifikasi penting: file seperti src/components/GoogleAuthProfileModal.tsx yang isinya cuma export { default } from "@/components/ui/GoogleAuthProfileModal" bukan bloat/dummy — itu re-export shim yang disengaja untuk backward compatibility import path (pola yang sama seperti lib/*.ts yang sudah dibahas di Bagian 8). Jangan dihapus, kecuali sudah dipastikan tidak ada satu pun file lain yang masih meng-import dari path lama itu.

Yang beneran perlu diaudit dan dibersihkan:

Folder daily-assessment/ — kalau merge ke mood-check-in (Bagian 8.5.1) sudah dieksekusi, pastikan foldernya beneran terhapus dari filesystem, bukan cuma di-unlink dari sidebar tapi file-nya masih nyangkut di repo.
Komponen yang jadi dead code (tidak pernah di-import di mana pun) — misalnya kasus CreatePostModal.tsx sebelum diperbaiki (Bagian 11.6), yang sempat ada tapi tidak pernah dirender. Cara cek: grep -r "NamaComponent" di seluruh src/; kalau cuma muncul di file definisinya sendiri, itu kandidat dead code.
data/*.json — sudah dibahas di Bagian 8.5.2, harus keluar dari git history sepenuhnya.
Cara aman melakukan pembersihan: jangan hapus file secara manual tanpa cek referensi dulu. Jalankan grep -r "NamaComponent" atau grep -r "from.*NamaFile" di seluruh src/ sebelum menghapus apa pun — kalau masih ada referensi aktif (bukan cuma shim backward-compat), jangan dihapus, cari dulu kenapa masih dipakai.
17. Arsitektur Multi-Database (3 Neon Terpisah)
Keputusan arsitektur baru: database dipecah dari 1 Neon menjadi 3 Neon terpisah per domain: Companion, Community, dan Akun/Core. Ini mengganti seluruh setup di Bagian 7 yang tadinya 1 schema.prisma + 1 DATABASE_URL.

17.1 Konsekuensi Teknis (Wajib Dipahami Sebelum Implementasi)
Prisma tidak mendukung relasi (@relation) lintas database berbeda — satu schema.prisma cuma bisa punya satu datasource. Untuk 3 database beneran terpisah, dibutuhkan 3 skema Prisma + 3 Prisma Client yang berdiri sendiri-sendiri. Konsekuensinya:

Tidak ada foreign key/relasi native antar DB. Field seperti Conversation.userId atau CommunityPost.userId tetap ada sebagai String biasa, tanpa @relation ke model User (karena User ada di database lain). Integritas data (memastikan userId itu valid) jadi tanggung jawab kode aplikasi, bukan database lagi.
Tidak ada transaksi atomik lintas DB. prisma.$transaction() cuma berlaku dalam satu koneksi/database. Kalau ada aksi yang perlu update ke 2 DB sekaligus, tidak ada garansi keduanya sukses bareng — harus ditangani manual (retry/kompensasi), bukan dianggap "aman" seperti transaksi biasa.
Tidak ada JOIN SQL lintas domain. Untuk menampilkan post komunitas lengkap dengan nama & avatar user, dibutuhkan 2 query terpisah: satu ke Community DB (ambil post), satu ke Account DB (ambil data user berdasarkan userId yang tersimpan di post), lalu digabung manual di kode aplikasi. Ini lebih lambat dan lebih rawan bug dibanding 1 query JOIN — pastikan ini memang trade-off yang diterima.
3x connection pool. Tiga database berarti tiga connection pool terpisah dari Neon. Kalau masih pakai tier gratis Neon, perhatikan limit koneksi masing-masing project/database.
17.2 Struktur File
prisma/
  account/
    schema.prisma      → datasource: DATABASE_URL_ACCOUNT / DIRECT_URL_ACCOUNT
  companion/
    schema.prisma      → datasource: DATABASE_URL_COMPANION / DIRECT_URL_COMPANION
  community/
    schema.prisma      → datasource: DATABASE_URL_COMMUNITY / DIRECT_URL_COMMUNITY
Tiap schema.prisma punya generator client dengan output berbeda supaya tidak saling menimpa:

// prisma/account/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../src/generated/account-client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL_ACCOUNT")
  directUrl = env("DIRECT_URL_ACCOUNT")
}

model User { /* ...sama seperti sebelumnya... */ }
model NotificationPref { /* ... */ }
model Assessment { /* ... */ }
model MoodEntry { /* ... */ }
model JournalEntry { /* ... */ }
model ActivityLog { /* ... */ }
model Resource { /* ... */ }
// prisma/companion/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../src/generated/companion-client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL_COMPANION")
  directUrl = env("DIRECT_URL_COMPANION")
}

model Conversation {
  id        String   @id @default(cuid())
  userId    String   // TANPA @relation — user ada di DB lain
  title     String   @default("New Conversation")
  emotionTag String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Message[]
  @@index([userId])
  @@map("conversations")
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String
  content        String
  flaggedForRisk Boolean      @default(false)
  createdAt      DateTime     @default(now())
  @@index([conversationId, createdAt])
  @@map("messages")
}
// prisma/community/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../src/generated/community-client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL_COMMUNITY")
  directUrl = env("DIRECT_URL_COMMUNITY")
}

model CommunityPost {
  id        String   @id @default(cuid())
  userId    String   // TANPA @relation — user ada di DB lain
  content   String
  imageUrl  String?
  createdAt DateTime @default(now())
  comments  CommunityComment[]
  likes     CommunityLike[]
  @@index([createdAt])
  @@map("community_posts")
}

model CommunityComment {
  id        String        @id @default(cuid())
  postId    String
  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String        // TANPA @relation
  content   String
  createdAt DateTime      @default(now())
  @@map("community_comments")
}

model CommunityLike {
  id     String        @id @default(cuid())
  postId String
  post   CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId String
  @@unique([postId, userId])
  @@map("community_likes")
}
17.3 Environment Variables
# Account / Core DB
DATABASE_URL_ACCOUNT="postgresql://...-pooler.../account?sslmode=require"
DIRECT_URL_ACCOUNT="postgresql://.../account?sslmode=require"

# Companion DB
DATABASE_URL_COMPANION="postgresql://...-pooler.../companion?sslmode=require"
DIRECT_URL_COMPANION="postgresql://.../companion?sslmode=require"

# Community DB
DATABASE_URL_COMMUNITY="postgresql://...-pooler.../community?sslmode=require"
DIRECT_URL_COMMUNITY="postgresql://.../community?sslmode=require"
Tiga database ini boleh berupa 3 database berbeda dalam satu Neon project (lebih murah/simpel di free tier) atau 3 Neon project terpisah — itu keputusan biaya/isolasi, bukan keharusan teknis. Prisma-nya tidak peduli selama URL-nya valid dan berbeda per skema.

17.4 Client Singleton per Domain
Ganti src/backend/db/prisma.ts (satu client) jadi tiga file singleton terpisah, pola sama seperti sebelumnya:

// src/backend/db/accountClient.ts
import { PrismaClient } from "@/generated/account-client";

const globalForPrisma = globalThis as unknown as { accountDb: PrismaClient | undefined };
export const accountDb = globalForPrisma.accountDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.accountDb = accountDb;
// src/backend/db/companionClient.ts
import { PrismaClient } from "@/generated/companion-client";

const globalForPrisma = globalThis as unknown as { companionDb: PrismaClient | undefined };
export const companionDb = globalForPrisma.companionDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.companionDb = companionDb;
// src/backend/db/communityClient.ts
import { PrismaClient } from "@/generated/community-client";

const globalForPrisma = globalThis as unknown as { communityDb: PrismaClient | undefined };
export const communityDb = globalForPrisma.communityDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.communityDb = communityDb;
Setiap route API memilih client sesuai domainnya: api/mood/*, api/auth/*, api/journal/* → accountDb. api/companion/* → companionDb. api/community/* → communityDb.

17.5 Contoh Query Gabungan Lintas DB
Karena tidak ada JOIN, gabungkan manual di kode — contoh untuk community feed yang butuh nama user:

// src/backend/community/communityRepository.ts
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";

export async function getFeedWithAuthors(take = 20, cursor?: string) {
  const posts = await communityDb.communityPost.findMany({
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
  });

  const userIds = [...new Set(posts.map((p) => p.userId))];
  const users = await accountDb.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, avatarUrl: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return posts.map((post) => ({
    ...post,
    author: userMap.get(post.userId) ?? null, // null kalau user sudah dihapus — handle di UI
  }));
}
17.6 Package.json Scripts
"db:push:account": "prisma db push --schema=prisma/account/schema.prisma",
"db:push:companion": "prisma db push --schema=prisma/companion/schema.prisma",
"db:push:community": "prisma db push --schema=prisma/community/schema.prisma",
"db:push:all": "npm run db:push:account && npm run db:push:companion && npm run db:push:community"
17.7 Langkah Migrasi dari 1 DB ke 3 DB
Buat 3 database di Neon (dalam 1 project atau 3 project terpisah — keputusan biaya).
Pecah prisma/schema.prisma yang lama jadi 3 file sesuai struktur di 17.2.
Ganti semua import backend/db/prisma.ts di seluruh route API (api/mood, api/auth, api/community, api/companion, dll.) ke client yang sesuai domainnya (17.4).
Karena app masih tahap demo dan belum ada data user asli yang signifikan (lihat Bagian 14 — audit dummy data), aman untuk push schema baru dari nol ke 3 DB baru tanpa migrasi data lama. Kalau ternyata sudah ada data user asli yang penting, itu harus di-export dulu manual sebelum DB lama di-drop.
Sekalian nonaktifkan/hapus data/*.json fallback storage (Bagian 8.5.2) di tahap ini — jangan sampai ada fallback lama yang campur aduk dengan 3 DB baru dan bikin data jadi tidak konsisten sumbernya.
Update .env.example dan README.md dengan 6 environment variable baru (17.3), hapus DATABASE_URL/DIRECT_URL lama.
19. Multi-Provider AI — Teks & Suara (Gratis)
19.1 Provider Teks (LLM): Gemini, Mistral, OpenRouter, Groq
⚠️ Temuan review langsung ke kode: ModelSelector.tsx saat ini berisi array statis MODEL_OPTIONS yang sepenuhnya hardcoded dan tidak terhubung ke API apa pun — isinya "Gemini 1.5 Flash", "Gemini 1.5 Pro", "Claude 3.5 Sonnet", "OpenAI GPT-4o", dan "Groq Llama 3.3 70B". Dua di antaranya (Claude, OpenAI GPT-4o) tidak ada dalam rencana provider gratis (tabel di bawah) dan harus dihapus dari daftar — Claude/OpenAI tidak punya free tier standing seperti 4 provider yang dipilih. Sebaliknya, Mistral dan OpenRouter belum muncul sama sekali di daftar padahal keduanya bagian dari rencana. Memilih item di picker ini saat ini juga tidak memanggil provider apa pun secara nyata — ini murni UI kosong.

Empat provider ini dipilih karena semuanya punya free tier standing (bukan cuma trial credit yang expired), per pengecekan terbaru (2026):

Provider	Free Tier	Model Andalan	Catatan
Google Gemini (AI Studio)	Tanpa kartu kredit, ~15 RPM, model Flash gratis (model Pro biasanya cuma trial terbatas)	Gemini Flash (versi terbaru yang tersedia gratis)	Paling generous untuk pemakaian harian, jadi kandidat default/utama.
Groq	Free forever, 30 RPM, ~14.4k request/hari	Llama 3.3 70B, Qwen, dll — plus Whisper Large v3 (dipakai juga untuk voice, lihat 19.2)	Inference tercepat (LPU hardware), cocok untuk chat real-time. Satu API key dipakai untuk teks dan suara.
Mistral (La Plateforme)	Gratis, perlu verifikasi nomor telepon saat daftar, ~1 request/detik	Mistral Small, Mistral Nemo, Mixtral	Verifikasi telepon itu satu kali saat setup akun, bukan per-request.
OpenRouter	Model dengan suffix :free, ~50 request/hari, tanpa kartu kredit	Beberapa model open-source (Llama, Qwen, dll, bervariasi)	Berguna sebagai router/fallback ke banyak model sekaligus lewat satu API.
⚠️ Angka RPM/limit di atas berubah-ubah (provider sering revisi free tier tanpa banyak pengumuman) — sebelum implementasi final, cek ulang halaman pricing resmi masing-masing provider. Jangan hardcode asumsi limit ke dalam logic tanpa validasi runtime (tangani error 429 dengan graceful fallback ke provider lain, bukan crash).

Pola implementasi: bikin satu interface AIProvider di src/backend/ai/ dengan method seragam (generateResponse(messages, options)), lalu masing-masing provider (GeminiProvider, GroqProvider, MistralProvider, OpenRouterProvider) implement interface itu. ModelSelector.tsx (sudah ada di Companion) memilih provider mana yang dipakai per percakapan — ini juga base yang sudah cocok dengan fitur "Model: Gemini 1.5 Flash" yang sudah ada di UI, tinggal disambungkan ke implementasi multi-provider yang sesungguhnya (bukan dummy/hardcoded response).

Perbaikan konkret untuk ModelSelector.tsx:

Hapus entry "claude-3-5-sonnet" dan "gpt-4o" dari MODEL_OPTIONS.
Tambah entry untuk Mistral (mis. "mistral-small") dan OpenRouter (mis. salah satu model :free yang tersedia).
Ganti default dari gemini-1.5-flash kalau nama model itu sudah tidak akurat — cek nama model Gemini Flash yang aktif saat ini di free tier (nama model berubah dari waktu ke waktu, jangan hardcode nama versi lama).
Sambungkan onSelect/onChange di komponen ini supaya benar-benar mengubah provider yang dipanggil saat handleSendMessage jalan — bukan cuma mengubah label yang ditampilkan.
Fallback chain: kalau provider utama kena rate limit (429), otomatis coba provider berikutnya dalam urutan prioritas (mis. Gemini → Groq → Mistral → OpenRouter), bukan langsung gagal ke user. Beri tahu user secara halus kalau sedang pakai provider cadangan (opsional, tidak wajib ditampilkan).

19.2 AI Voice — Speech-to-Text & Text-to-Speech (Gratis)
Speech-to-Text (STT — suara user jadi teks):

Groq Whisper Large v3 — gratis, dalam paket free tier Groq yang sama dengan LLM (19.1), jadi tidak perlu API key terpisah. Rekomendasi utama karena satu provider dua fungsi.
Text-to-Speech (TTS — balasan Zyba jadi suara):

Edge TTS (edge-tts) — reverse-engineered dari fitur Read Aloud Microsoft Edge, 200+ suara neural, tanpa API key, tanpa limit terdokumentasi. Ini opsi paling murah-meriah, tapi sifatnya tidak resmi (unofficial) — ada risiko stabilitas jangka panjang kalau Microsoft mengubah endpoint internalnya. Cocok untuk demo/kompetisi, kurang cocok untuk produksi jangka panjang tanpa fallback.
Web Speech API browser native (SpeechSynthesis) — bawaan browser, benar-benar gratis, tanpa API key, tanpa setup — tapi kualitas suara tergantung OS/browser user (bisa terdengar robotik di sebagian perangkat), dan Chrome punya bug append 15 detik per-utterance (perlu di-chunk manual kalau teksnya panjang). Cocok sebagai fallback terakhir kalau Edge TTS/provider lain gagal.
ElevenLabs free tier (opsional, kualitas terbaik) — ~10.000 karakter/bulan gratis, suara paling natural. Karena limitnya kecil, pakai ini hanya untuk momen penting (mis. pesan pertama Zyba ke user baru), bukan semua respons chat.
Rekomendasi susunan: STT pakai Groq Whisper (satu-satunya opsi, sudah cukup bagus & gratis). TTS pakai Edge TTS sebagai default, Web Speech API sebagai fallback kalau Edge TTS gagal, ElevenLabs (kalau mau) untuk momen spesial saja karena limitnya ketat.

19.3 Template .env.example (Lengkap, Ganti yang Lama)
# ── Database (Bagian 17 — 3 Neon terpisah) ──
DATABASE_URL_ACCOUNT="postgresql://<user>:<password>@<endpoint>-pooler.<region>.aws.neon.tech/account?sslmode=require"
DIRECT_URL_ACCOUNT="postgresql://<user>:<password>@<endpoint>.<region>.aws.neon.tech/account?sslmode=require"

DATABASE_URL_COMPANION="postgresql://<user>:<password>@<endpoint>-pooler.<region>.aws.neon.tech/companion?sslmode=require"
DIRECT_URL_COMPANION="postgresql://<user>:<password>@<endpoint>.<region>.aws.neon.tech/companion?sslmode=require"

DATABASE_URL_COMMUNITY="postgresql://<user>:<password>@<endpoint>-pooler.<region>.aws.neon.tech/community?sslmode=require"
DIRECT_URL_COMMUNITY="postgresql://<user>:<password>@<endpoint>.<region>.aws.neon.tech/community?sslmode=require"

# ── AI Text Providers (Bagian 19.1) — daftar gratis di masing-masing dashboard ──
GEMINI_API_KEY=""          # https://aistudio.google.com/apikey
GROQ_API_KEY=""            # https://console.groq.com/keys — dipakai juga untuk STT (19.2)
MISTRAL_API_KEY=""         # https://console.mistral.ai/ (butuh verifikasi no. telepon saat daftar)
OPENROUTER_API_KEY=""      # https://openrouter.ai/keys

# ── AI Voice (Bagian 19.2) ──
# STT: pakai GROQ_API_KEY di atas, tidak perlu key terpisah.
# TTS Edge TTS: tidak perlu API key sama sekali.
ELEVENLABS_API_KEY=""      # opsional, https://elevenlabs.io — hanya untuk momen spesial (limit 10k karakter/bulan)

# ── Object Storage untuk media attachment (Bagian 20) ──
BLOB_READ_WRITE_TOKEN=""   # Vercel Blob — dari Vercel Dashboard > Storage > Create > Blob

# ── Auth ──
NEXTAUTH_SECRET="ganti-dengan-random-string-panjang"
NEXTAUTH_URL="http://localhost:3000"
20. Media Lampiran (Suara, Gambar, Stiker) — Companion & Community
20.1 Prinsip Umum
Semua file media (gambar, audio) tidak boleh disimpan sebagai base64/binary langsung di Postgres (Neon) — itu bikin ukuran database membengkak cepat dan query jadi lambat. Simpan file di object storage terpisah, database cuma menyimpan URL string-nya.

Storage yang direkomendasikan: Vercel Blob — cocok karena project ini di Next.js dan kemungkinan deploy di Vercel. Free tier mencakup penyimpanan dasar + bandwidth bulanan yang cukup untuk skala demo/kompetisi (cek dashboard Vercel untuk angka pasti, karena batas free tier bisa berubah). Alternatif kalau tidak pakai Vercel: Cloudinary atau ImageKit (fokus gambar), keduanya juga punya free tier.

20.2 Update Skema — Message (Companion DB)
model Message {
  id               String       @id @default(cuid())
  conversationId   String
  conversation     Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role             String
  content          String?      // teks pesan — opsional kalau isinya cuma media
  attachmentType   String?      // "image" | "audio" | "sticker" | null
  attachmentUrl    String?      // URL dari Vercel Blob, BUKAN base64
  audioDurationSec Int?         // khusus attachmentType = "audio"
  stickerId        String?      // khusus attachmentType = "sticker", lihat 20.4
  flaggedForRisk   Boolean      @default(false)
  createdAt        DateTime     @default(now())
  @@index([conversationId, createdAt])
  @@map("messages")
}
⚠️ Penting untuk safety (Bagian 8.5.2 & crisis detection): detectRisk() cuma bisa membaca teks. Kalau user kirim pesan suara (voice note) ke Zyba Companion, wajib transkrip dulu lewat Groq Whisper (19.2) sebelum dianggap "aman" — jangan biarkan pesan suara lolos tanpa dicek risk-nya sama sekali hanya karena bukan teks.

20.3 Update Skema — CommunityPost & CommunityComment (Community DB)
model CommunityPost {
  id               String   @id @default(cuid())
  userId           String
  content          String?  // opsional kalau post cuma gambar/stiker
  imageUrl         String?  // sudah ada sebelumnya
  audioUrl         String?  // NEW — voice note di post
  audioDurationSec Int?     // NEW
  stickerId        String?  // NEW
  createdAt        DateTime @default(now())
  comments         CommunityComment[]
  likes            CommunityLike[]
  @@index([createdAt])
  @@map("community_posts")
}

model CommunityComment {
  id        String        @id @default(cuid())
  postId    String
  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  content   String?       // opsional kalau komentar cuma stiker
  stickerId String?       // NEW — komentar-cuma-stiker itu pola umum medsos
  createdAt DateTime      @default(now())
  @@map("community_comments")
}
20.4 Stiker — Aset Statis, Bukan Tabel Database
Untuk v1, stiker tidak perlu tabel Prisma sendiri — cukup set stiker kurasi yang di-bundle di frontend (public/stickers/*.png atau SVG), masing-masing punya stickerId unik (mis. "zyba_hug", "zyba_proud", "zyba_calm"). Field stickerId di Message/CommunityPost/CommunityComment cuma menyimpan string key ini, lalu frontend me-lookup asetnya dari daftar statis. Baru bikin tabel DB kalau nanti ada fitur upload stiker custom oleh user — jangan over-engineer di awal.

20.5 Upload Flow (Ringkas)
⚠️ Temuan review: tombol lampiran (📎) di ChatInput.tsx saat ini murni dekoratif — <button> tanpa onClick sama sekali, tidak membuka file picker, tidak melakukan apa-apa saat diklik. Ini harus disambungkan ke flow di bawah, bukan cuma dibiarkan sebagai ikon.

User pilih file (gambar/rekam audio) di client — attach onClick ke tombol 📎 yang membuka <input type="file" accept="image/*,audio/*" /> tersembunyi, atau trigger UI upload sejenis.
Client upload langsung ke Vercel Blob lewat client-upload token (bukan lewat server dulu, biar server tidak jadi bottleneck untuk file besar) — ikuti pola @vercel/blob client upload.
Blob URL yang didapat dikirim ke API route (/api/companion/message atau /api/community/post) sebagai attachmentUrl, disimpan ke DB.
Kalau attachment-nya audio dan dikirim ke Companion: server transkrip dulu via Groq Whisper, jalankan detectRisk() ke hasil transkrip, baru proses seperti pesan teks biasa.
21. Persona Companion — Karakter Hewan (Ganti "Gaya" Casual/Formal/Fun)
Perubahan desain: toggle "Gaya: CASUAL/FORMAL/FUN" (teks polos) di Companion diganti jadi pemilihan karakter hewan — tiap karakter punya nama, kepribadian, dan gaya bicara sendiri, bukan cuma label gaya bahasa. Ini menggantikan seluruh referensi "Gaya"/toggle Casual-Formal-Fun di Bagian 10 sebelumnya.

⚠️ Temuan review: ChatHeader.tsx saat ini masih literally menampilkan {selectedModel} • Gaya: {commStyle} sebagai teks polos — belum ada implementasi persona hewan sama sekali di kode, masih 100% sistem lama. Ini juga penyebab gejala "hewan-hewan muncul di luar tab slug tapi hilang di dalam tab slug" — karena elemen visual apa pun yang terkait "hewan" (kemungkinan mascot ilustrasi di empty state, Bagian 10.3) hanya dirender di halaman /companion dasar, sedangkan /companion/[slug] merender cabang JSX yang berbeda (saat ini masih salah isi dengan Projects/Artifacts/Code/Customize — lihat Bagian 23.1). Perbaikan Bagian 23.1 (hapus scope creep, repurpose slug jadi per-percakapan dengan komponen chat yang sama persis seperti halaman dasar) otomatis akan menyelesaikan ketidakkonsistenan ini juga — jangan perbaiki dua-duanya secara terpisah, satu akar masalah.

21.1 Set Persona (4 karakter, mencakup rentang tona yang sama seperti 3 gaya lama + 1 tambahan)
Karakter	Emoji/Maskot	Kepribadian	Gaya Bicara	Setara Gaya Lama
Kina (Kelinci)	🐰	Lembut, penuh empati, banyak validasi perasaan	Bahasa hangat, banyak kata-kata penenang, jarang menghakimi	~Casual (versi lebih lembut)
Ollie (Burung Hantu)	🦉	Bijaksana, reflektif, suka menggali lebih dalam	Bahasa lebih terstruktur, banyak pertanyaan reflektif, sedikit lebih formal	~Formal
Rubi (Rubah)	🦊	Santai, jenaka, kayak teman deket yang asik diajak curhat	Bahasa gaul, sesekali bercanda ringan (tetap sensitif kalau user lagi berat)	~Fun
Bruno (Beruang)	🐻	Tenang, protektif, menenangkan — cocok saat user lagi cemas berat	Bahasa pelan, banyak jeda, teknik grounding (napas, dsb) diselipkan natural	Tambahan baru — dulu tidak ada padanan
21.2 Implementasi
Update enum Prisma (User.communicationStyle, DB Account):

enum CompanionPersona {
  KINA    // dulu CASUAL
  OLLIE   // dulu FORMAL
  RUBI    // dulu FUN
  BRUNO   // baru
}
Butuh migration untuk rename data lama: CASUAL → KINA, FORMAL → OLLIE, FUN → RUBI (mapping 1:1, BRUNO jadi opsi baru yang belum ada sebelumnya).

System prompt per persona — simpan di src/backend/ai/personas.ts:

export const COMPANION_PERSONAS = {
  KINA: {
    name: "Kina", emoji: "🐰",
    systemPrompt: "Kamu adalah Kina, kelinci pendamping yang lembut dan penuh empati. Validasi perasaan user dulu sebelum kasih saran. Gunakan bahasa hangat, hindari terkesan menghakimi.",
  },
  OLLIE: {
    name: "Ollie", emoji: "🦉",
    systemPrompt: "Kamu adalah Ollie, burung hantu yang bijaksana dan reflektif. Ajukan pertanyaan yang membantu user menggali perasaannya lebih dalam, gunakan bahasa yang lebih terstruktur.",
  },
  RUBI: {
    name: "Rubi", emoji: "🦊",
    systemPrompt: "Kamu adalah Rubi, rubah yang santai dan asik diajak ngobrol kayak teman deket. Boleh sesekali bercanda ringan, tapi tetap peka kalau user sedang serius/berat.",
  },
  BRUNO: {
    name: "Bruno", emoji: "🐻",
    systemPrompt: "Kamu adalah Bruno, beruang yang tenang dan menenangkan. Bicara pelan, sering selipkan teknik grounding (tarik napas, dsb) secara natural, cocok untuk user yang sedang cemas.",
  },
} as const;
UI picker: ganti toggle pill "Casual/Formal/Fun" jadi grid 4 kartu kecil (avatar hewan + nama), dipilih sekali di awal onboarding Companion atau bisa diganti kapan saja dari Chatbot Settings (modal yang sudah ada, Bagian 10.1). Warna kartu tetap ikut palet ZYBA (Bagian 3.1), bukan warna baru per-hewan yang di luar palet — cukup ilustrasi/emoji hewan yang membedakan, bukan skema warna berbeda-beda.

⚠️ Prinsip safety tetap berlaku di semua persona, tanpa kecuali: kalau detectRisk() mendeteksi krisis, banner krisis (Bagian 10.5) tetap tampil dengan nada tenang standar — persona manapun yang aktif tidak boleh mengubah/melunakkan respons terhadap sinyal bahaya diri.

22. Konsistensi Warna Identitas — Brown-900 seperti Dashboard
⚠️ Asumsi (koreksi kalau meleset): instruksi "kasih coklat yang kayak di dashboard" ditafsirkan sebagai — elemen identitas utama (avatar/chip user, header sapaan) di halaman lain masih pakai orange-500 (mis. avatar "AL" di compose box Community), padahal di Dashboard elemen sejenis (header sapaan "Hi, [Nama]!", avatar profil) konsisten pakai bg-brown-900. Kalau maksudnya bukan ini, kasih tahu elemen spesifik mana yang dimaksud.

Aturan konsistensi: avatar/chip identitas user (bukan tombol aksi) di seluruh halaman (Community compose box, Companion sidebar bottom-profile, Community post card) pakai bg-brown-900 + teks putih untuk inisial — bukan bg-orange-500. orange-500 disisakan khusus untuk tombol aksi (Post, Kirim, CTA utama), supaya ada pembeda jelas: coklat = identitas, oranye = aksi.

23. Routing Slug — Percakapan & Halaman Akun
23.1 Companion — Slug per Percakapan
⚠️ Temuan review langsung ke kode (penting): src/app/companion/[slug]/page.tsx sudah ada, tapi dipakai untuk sub-section ala Claude.ai — /companion/projects, /companion/artifacts, /companion/code, /companion/customize (ada CompanionProjectsView.tsx, CompanionArtifactsView.tsx, CompanionCodeView.tsx). Ini scope creep yang harus dihapus — di Bagian 10.7 sudah eksplisit ditulis "LEWATI bagian Projects/Artifacts/Code/Customize ala Claude — itu tidak relevan untuk Companion", tapi tetap dibangun. Fitur-fitur ini tidak ada gunanya untuk app pendamping kesehatan mental dan cuma nambah kompleksitas tanpa manfaat.

Sementara itu, percakapan individual (activeConvId) masih murni React state di CompanionContext.tsx (useState<string>("conv-1")), sama sekali tidak tercermin di URL. Klik item percakapan di sidebar cuma ganti state, bukan navigasi ke route baru. Default value "conv-1" juga terindikasi data dummy (lihat Bagian 14) — perlu dicek apakah conversations array di context itu benar-benar fetch dari Companion DB atau masih hardcoded.

Perbaikan yang harus dilakukan:

Hapus CompanionProjectsView.tsx, CompanionArtifactsView.tsx, CompanionCodeView.tsx, dan seluruh routing /companion/projects, /companion/artifacts, /companion/code, /companion/customize — cek dulu dengan grep -r sebelum hapus, pastikan tidak ada bagian lain yang bergantung ke ini.
Repurpose [slug] yang sudah ada (setelah dibersihkan dari poin 1) untuk fungsi yang benar: /companion/[slug] sebagai route per-percakapan, di mana slug = conversationId (atau slug singkat yang di-generate dari conversationId).
Klik item di CompanionSidebar → ganti dari update state langsung menjadi <Link href={/companion/${conversation.id}}> atau router.push(), supaya activeConvId di CompanionContext di-derive dari URL param (useParams()), bukan useState yang berdiri sendiri.
Pastikan conversations di CompanionContext benar-benar di-fetch dari Companion DB (Bagian 17) via API, bukan array hardcoded dengan "conv-1" sebagai default — ini bagian dari audit dummy data di Bagian 14.
companion/page.tsx (root, tanpa slug) tetap jadi halaman default — redirect ke percakapan terbaru kalau ada, atau tampilkan empty state (Bagian 10.3) kalau user belum punya percakapan sama sekali.
23.2 Community — Sudah Benar, Tidak Perlu Diubah
✅ Konfirmasi dari review kode: src/app/community/[slug]/page.tsx sudah diimplementasikan dengan benar — dipakai untuk sub-view nav (/community/search, /community/messages, /community/activity, /community/profile, /community/insights), sesuai spek Bagian 11.5. Tidak ada perbaikan yang diperlukan di sini.

23.3 Dashboard — Slug untuk Account Info / Profil
"Account info" yang ditampilkan di Dashboard (avatar, nama, plan) seharusnya bukan cuma tampilan statis tanpa link — itu harus mengarah ke halaman Settings/Profil yang sudah py route sendiri:

Pastikan src/app/settings/page.tsx (sudah ada di struktur folder) dipakai sebagai tujuan klik dari avatar/nama user di Dashboard maupun di sidebar manapun (Companion, Community) — satu halaman akun terpusat, bukan info akun yang duplikat/terpisah tampilannya di tiap section.
Kalau butuh sub-halaman (mis. /settings/privacy, /settings/notifications), gunakan nested route dengan slug jelas, bukan modal-only yang tidak punya URL sendiri — supaya user bisa link langsung ke pengaturan tertentu.
24. Fitur Settings yang Wajib Dilengkapi — Privasi Data & Lainnya
Halaman Settings (Bagian 23.2) saat ini kemungkinan belum lengkap. Fitur minimum yang wajib ada:

24.1 Privasi Data
Ekspor data saya — tombol yang generate & download semua data user (mood entries, journal, percakapan, post komunitas) dalam format JSON/CSV. Ini juga selaras dengan prinsip transparansi yang disebut di Visi ZYBA (Bagian 1/6 pitch deck: "memastikan rasa aman, terjaga").
Hapus akun saya — alur konfirmasi (bukan tombol sekali klik langsung hapus) yang benar-benar menghapus data user dari ketiga database (Account, Companion, Community — Bagian 17), bukan cuma dari satu DB dan meninggalkan data yatim di DB lain.
Kontrol visibilitas Community — toggle per-post atau default akun: "publik ke komunitas" vs "anonim" (sudah ada contoh "Anonim #241" di feed, berarti fitur post anonim sudah ada — pastikan ini punya toggle yang jelas di UI compose box, bukan cuma hardcoded sebagian post).
Kelola notifikasi — sudah ada model NotificationPref di schema (companionNotif/wellnessNotif/communityNotif), pastikan halaman Settings punya toggle UI yang benar-benar terhubung ke field ini, bukan dummy switch yang tidak nyimpen apa-apa.
24.2 Lainnya (Minimum Umum untuk App Kesehatan Mental)
Ganti persona Companion — link cepat ke pemilihan persona hewan (Bagian 21), tidak cuma bisa diganti dari dalam chat.
Informasi bantuan krisis — halaman statis berisi kontak hotline resmi (sumber sama seperti CRISIS_RESOURCES di crisisDetection.ts), supaya user bisa akses ini kapan saja, tidak cuma muncul saat banner krisis aktif.
Tentang & kontak tim — info dasar aplikasi, kontak untuk laporan bug/masalah (relevan untuk konteks lomba juga sebagai bukti kelengkapan produk).
25. Rencana Eksekusi — Sambungkan Semua Spek Frontend ke Backend Nyata
Ini rangkuman "waktunya eksekusi" — banyak bagian di dokumen ini (terutama Bagian 17, 19, 20, 21, 23, 24) masih berupa spesifikasi, belum tentu semua sudah benar-benar disambungkan ke backend yang berfungsi. Urutan eksekusi yang disarankan (dari yang paling jadi fondasi ke yang paling bergantung):

Bagian 17 (Multi-DB) dulu — semua bagian lain butuh struktur database yang benar sebagai fondasi.
Bagian 19 (Multi-provider AI) — supaya Companion punya otak yang beneran jalan, bukan dummy response.
Bagian 20 (Media attachment) — nempel ke Companion/Community yang sudah punya AI + DB yang benar.
Bagian 21 (Persona hewan) — nempel ke provider AI yang sudah jalan (system prompt beda per persona).
Bagian 22-24 (konsistensi warna, slug routing, settings/privasi) — polish akhir setelah fondasi data & AI-nya solid.
Bagian 13-16 (performa, hapus dummy, responsif, kebersihan repo) — audit menyeluruh di tahap paling akhir, setelah semua fitur baru di atas selesai (audit dummy data harus dilakukan setelah semua koneksi backend nyata terpasang, supaya tidak ada yang keliru dianggap "sudah real" padahal masih ada sisa dummy dari proses development).
Jangan kerjakan semuanya sekaligus dalam satu batch besar — riwayat proyek ini (lihat Bagian 8.5, 11.6) menunjukkan batch besar tanpa verifikasi per-langkah berujung ke klaim "selesai" yang ternyata tidak akurat (modal yang tidak ke-wire, styling yang tidak benar-benar berubah). Kerjakan per-bagian, verifikasi nyata (bukan cuma baca kode) di tiap langkah, baru lanjut.

26. Alur Zyba Plus — Pilih Paket sampai Bayar
26.1 Payment Gateway: Midtrans (Sandbox)
Rekomendasi: Midtrans Snap — payment gateway paling umum dipakai developer Indonesia, punya sandbox mode gratis tanpa perlu verifikasi bisnis untuk keperluan demo/kompetisi (cukup daftar akun, dapat Server Key + Client Key sandbox). Mendukung berbagai metode pembayaran (transfer bank, GoPay, OVO, kartu kredit, dll) lewat satu widget popup yang sudah jadi — ZYBA tidak perlu bikin UI form kartu/bank sendiri, itu semua sudah ditangani Midtrans Snap.

⚠️ Sandbox mode = simulasi, tidak ada uang beneran berpindah. Untuk submit lomba ini cukup, jangan aktifkan mode production kecuali memang mau transaksi nyata (butuh verifikasi bisnis tambahan ke Midtrans).

26.2 Skema Database (Account DB — Bagian 17)
model Subscription {
  id        String             @id @default(cuid())
  userId    String
  plan      Plan               // reuse enum FREE/PLUS yang sudah ada di model User
  status    SubscriptionStatus @default(PENDING)
  startDate DateTime?
  endDate   DateTime?
  createdAt DateTime           @default(now())
  payments  Payment[]
  @@index([userId])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  PENDING
  ACTIVE
  EXPIRED
  CANCELLED
}

model Payment {
  id             String        @id @default(cuid())
  subscriptionId String
  subscription   Subscription  @relation(fields: [subscriptionId], references: [id])
  userId         String
  amount         Int           // dalam Rupiah, tanpa desimal
  provider       String        @default("midtrans")
  orderId        String        @unique // dikirim ke Midtrans, harus unik per transaksi
  transactionId  String?       // ID dari Midtrans setelah pembayaran diproses
  paymentMethod  String?       // "gopay" | "bank_transfer" | "credit_card" | dll, diisi dari webhook
  status         PaymentStatus @default(PENDING)
  rawPayload     Json?         // simpan response webhook mentah untuk audit/debug
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  @@index([userId, createdAt])
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  EXPIRED
  CANCELLED
}
26.3 Alur Lengkap (Pilih Paket → Bayar → Aktif)
Halaman "Zyba Plus" (/settings/zyba-plus atau tab tersendiri, sesuai nav yang sudah ada di Bagian 24) — dua kartu berdampingan: Zyba Free (paket saat ini, kalau user masih free) vs Zyba Plus dengan daftar fitur eksklusif (sesuai Business Model pitch deck Bagian 16: penggunaan AI lebih banyak, rekomendasi lebih personal, program komunitas khusus, insight kebiasaan, laporan perkembangan) + harga per bulan.
User klik "Upgrade ke Zyba Plus →" pada kartu Plus.
Client memanggil POST /api/billing/checkout → server membuat record Subscription (status PENDING) + Payment (status PENDING, orderId unik), lalu memanggil Midtrans Snap API untuk mendapatkan snapToken.
Client menerima snapToken, panggil window.snap.pay(snapToken, { onSuccess, onPending, onError, onClose }) — Midtrans menampilkan popup pembayaran bawaan mereka (pilih metode: transfer bank/e-wallet/kartu), ZYBA tidak perlu desain layar ini sendiri.
Setelah user selesai bayar di popup Midtrans:
onSuccess/onPending callback di client → redirect ke halaman konfirmasi (/settings/zyba-plus/success?order_id=...).
Secara paralel dan independen, Midtrans mengirim webhook notification ke POST /api/billing/webhook — ini yang jadi sumber kebenaran status pembayaran, bukan callback client-side (client bisa ditutup/koneksi putus, webhook tetap jalan).
Endpoint webhook wajib verifikasi signature (Midtrans mengirim signature_key yang dihitung dari order_id + status_code + gross_amount + ServerKey, dicocokkan di server) — tolak request yang signature-nya tidak valid, supaya tidak ada yang bisa memalsukan "pembayaran sukses".
Setelah signature valid dan status pembayaran settlement/capture (sukses menurut Midtrans): update Payment.status = SUCCESS, Subscription.status = ACTIVE, set startDate/endDate (+30 hari dari sekarang), dan update User.plan = PLUS.
Halaman konfirmasi (/settings/zyba-plus/success) menampilkan ringkasan: paket aktif, tanggal mulai, tanggal berakhir, tombol kembali ke Dashboard. Sidebar/badge di seluruh app otomatis berubah dari "Zyba Free" jadi "Zyba Plus PRO" (Bagian 22 — konsistensi identitas).
Riwayat Pembayaran (/settings/billing, nav item sudah ada) — list semua Payment milik user: tanggal, jumlah, status, metode. Ini juga tempat user lihat kalau pembayaran gagal/pending, bukan cuma yang sukses.
26.4 Environment Variables
MIDTRANS_SERVER_KEY=""       # rahasia, JANGAN pernah dikirim ke client — dari dashboard.midtrans.com (Sandbox)
MIDTRANS_CLIENT_KEY=""       # boleh dipakai di client (untuk load Snap.js)
MIDTRANS_IS_PRODUCTION="false"  # tetap "false" untuk demo/kompetisi
26.5 Hal Wajib Diperhatikan (Safety & Correctness)
MIDTRANS_SERVER_KEY tidak boleh pernah muncul di kode client-side (tidak di NEXT_PUBLIC_*, tidak di response API ke browser) — hanya dipakai server-side saat request token & verifikasi webhook.
Idempotency: webhook Midtrans bisa terkirim lebih dari sekali untuk event yang sama. Cek dulu apakah Payment dengan orderId itu sudah berstatus SUCCESS sebelum memprosesnya lagi — jangan aktifkan langganan dua kali/double-charge state karena webhook duplikat.
Jangan percaya status dari client-side callback saja (poin 5-6 di atas) — status final harus dari webhook yang tervalidasi, client callback cuma untuk UX cepat (langsung kasih tahu user "sedang diproses").
Expiry check: butuh mekanisme (cron job/scheduled function, atau dicek on-the-fly saat load halaman) yang mengubah Subscription.status jadi EXPIRED dan User.plan balik ke FREE setelah endDate lewat — tanpa ini, user yang sudah expired akan tetap dianggap Plus selamanya.
27. Feature Gating — Batasan Nyata Free vs Plus
Kartu perbandingan paket (Bagian 26.3) baru sekadar teks kalau batasannya tidak ditegakkan di backend. Bagian ini mendefinisikan mekanisme enforcement-nya secara konkret.

27.1 Matriks Fitur
Fitur	Zyba Free	Zyba Plus
Pesan ke Zyba Companion	20 pesan/hari (reset tiap jam 00:00)	Unlimited
Mood tracking	Dasar (catat mood harian, lihat riwayat)	+ Insight kebiasaan mendalam (analisis pola/korelasi, rekomendasi personal AI berbasis riwayat lengkap)
Zyba Community	Akses baca & posting biasa	+ Program komunitas eksklusif (grup/channel khusus Plus)
Laporan perkembangan	Tidak ada	Laporan bulanan otomatis (ringkasan mood/aktivitas/journal, di-generate tiap awal bulan)
Rekomendasi AI	Generic (tanpa konteks riwayat personal)	Personalized (AI pakai riwayat mood/journal/aktivitas user sebagai context)
27.2 Prinsip Enforcement
Enforcement WAJIB di server-side, UI cuma lapisan kedua (defense in depth). Menyembunyikan tombol di frontend saja tidak cukup — user yang paham bisa panggil API langsung lewat DevTools/Postman dan bypass batasan kalau cuma dicek di client. Setiap endpoint yang berkaitan dengan fitur di tabel 27.1 harus cek plan di server sebelum memproses.

27.3 Helper Terpusat
// src/backend/billing/entitlements.ts
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";

export const FREE_DAILY_MESSAGE_LIMIT = 20;

export async function getUserPlan(userId: string): Promise<"FREE" | "PLUS"> {
  const user = await accountDb.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? "FREE";
}

export async function checkMessageQuota(userId: string) {
  const plan = await getUserPlan(userId);
  if (plan === "PLUS") return { allowed: true, remaining: Infinity };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Join Message -> Conversation aman di sini karena keduanya di Companion DB yang sama
  // (bukan cross-database join — cek User.plan di atas itu satu-satunya query lintas DB).
  const countToday = await companionDb.message.count({
    where: {
      role: "USER",
      createdAt: { gte: startOfDay },
      conversation: { userId },
    },
  });

  return {
    allowed: countToday < FREE_DAILY_MESSAGE_LIMIT,
    remaining: Math.max(0, FREE_DAILY_MESSAGE_LIMIT - countToday),
  };
}

export async function hasFeature(
  userId: string,
  feature: "advanced_insights" | "monthly_report" | "exclusive_community"
): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "PLUS"; // semua 3 fitur ini murni gated by plan, tidak ada logic tambahan
}
27.4 Titik Enforcement per Fitur
Kirim pesan Companion (api/companion/message atau sejenisnya, lihat Bagian 19): panggil checkMessageQuota(userId) sebelum memanggil AI provider. Kalau allowed === false, return response error dengan kode khusus (mis. { error: "QUOTA_EXCEEDED", remaining: 0 }, HTTP 403) — frontend menangkap ini dan menampilkan modal "Out of Chat Limit" yang sudah dispek di Bagian 10.6, bukan generic error message.
Insight kebiasaan mendalam (Wellness Journey/Mood Check-In advanced view): cek hasFeature(userId, "advanced_insights") di route API yang menyediakan data analisis pola — kalau false, kembalikan data dasar saja atau tampilkan CTA upgrade, jangan proses analisis berat untuk user yang tidak berhak.
Laporan bulanan: cek hasFeature(userId, "monthly_report") sebelum men-generate/menampilkan laporan — kalau ini di-generate lewat scheduled job, job itu sendiri harus filter hanya user dengan plan PLUS.
Program komunitas eksklusif: cek hasFeature(userId, "exclusive_community") sebelum mengizinkan akses ke grup/channel khusus di api/community/* yang terkait fitur ini.
27.5 Sisi UI (Lapisan Kedua, Bukan Satu-satunya)
Tampilkan sisa kuota pesan hari ini secara halus di area chat Companion untuk user Free (mis. "17/20 pesan hari ini"), supaya user tidak kaget tiba-tiba diblokir.
Elemen UI yang terkait fitur Plus-only (insight mendalam, laporan bulanan, komunitas eksklusif) tetap ditampilkan untuk user Free tapi dalam kondisi ter-blur/terkunci dengan CTA "Upgrade untuk buka fitur ini →" — pola umum freemium, lebih persuasif daripada disembunyikan total.
28. Checklist Final Sebelum Submit/Deploy
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
Arsitektur Multi-Database (Bagian 17):

 3 skema Prisma terpisah (prisma/account, prisma/companion, prisma/community) sudah dibuat, masing-masing dengan datasource dan generator output sendiri.
 Semua userId di Companion/Community DB tanpa @relation ke User (karena beda database) — cuma String biasa.
 Semua route API sudah pakai client sesuai domainnya (accountDb/companionDb/communityDb), tidak ada lagi import backend/db/prisma.ts yang lama.
 Tampilan yang butuh data lintas domain (mis. nama user di post komunitas) sudah pakai pola gabung manual (Bagian 17.5), bukan asumsi JOIN otomatis.
 .env/.env.example sudah pakai 6 variable baru (DATABASE_URL_ACCOUNT, dst.), variable lama dihapus.
Multi-Provider AI & Suara (Bagian 19):

 ModelSelector.tsx benar-benar terhubung ke minimal 1 provider nyata (Gemini/Groq/Mistral/OpenRouter), bukan respons dummy/hardcoded.
 Ada fallback chain kalau satu provider kena rate limit (429), tidak langsung gagal total ke user.
 STT pakai Groq Whisper, TTS pakai Edge TTS + fallback Web Speech API — sudah dites beneran menghasilkan audio, bukan cuma kode terpasang.
 .env.example sudah di-update sesuai template lengkap di 19.3.
Media Attachment (Bagian 20):

 File gambar/audio disimpan di object storage (Vercel Blob atau setara), bukan base64 langsung di Postgres.
 Pesan suara ke Zyba Companion ditranskrip dulu lewat Groq Whisper sebelum dicek detectRisk() — tidak ada voice note yang lolos tanpa dicek risiko.
 Stiker pakai aset statis (stickerId string), tidak dipaksakan bikin tabel DB terpisah di v1.
Persona Hewan (Bagian 21):

 Toggle "Gaya: Casual/Formal/Fun" sudah diganti UI pemilihan karakter hewan (Kina/Ollie/Rubi/Bruno).
 Enum Prisma CompanionPersona sudah menggantikan CommunicationStyle lama, data existing (kalau ada) sudah dimigrasi sesuai mapping 1:1.
 Semua persona tetap menampilkan banner krisis standar saat detectRisk() aktif — tidak ada persona yang melunakkan respons terhadap sinyal bahaya diri.
Konsistensi Warna, Slug, Settings (Bagian 22-24):

 Avatar/chip identitas user pakai bg-brown-900 konsisten di semua halaman, orange-500 khusus tombol aksi.
 CompanionProjectsView/CompanionArtifactsView/CompanionCodeView dan routing /companion/projects, /companion/artifacts, /companion/code, /companion/customize sudah dihapus (scope creep, lihat Bagian 23.1).
 [slug] di Companion sudah di-repurpose jadi route per-percakapan (activeConvId di-derive dari URL, bukan useState berdiri sendiri), dan conversations sudah fetch dari Companion DB asli, bukan dummy "conv-1".
 Account info di Dashboard mengarah ke halaman Settings terpusat, bukan duplikat tampilan di tiap section.
 Settings sudah punya: ekspor data, hapus akun (terhapus dari 3 DB sekaligus), kontrol visibilitas post (publik/anonim), toggle notifikasi yang benar-benar tersambung ke NotificationPref.
Eksekusi Backend (Bagian 25):

 Dikerjakan berurutan sesuai prioritas (17 → 19 → 20 → 21 → 22-24 → 13-16), tidak sekaligus dalam satu batch tanpa verifikasi.
Zyba Plus / Payment Flow (Bagian 26):

 MIDTRANS_SERVER_KEY tidak muncul di kode/response client-side mana pun.
 Webhook signature Midtrans diverifikasi sebelum status pembayaran diproses.
 Webhook idempotent — payment yang sudah SUCCESS tidak diproses ulang kalau notification terkirim dobel.
 Ada mekanisme expiry (Subscription.status → EXPIRED, User.plan balik ke FREE) setelah endDate lewat.
 Sudah dites end-to-end di Sandbox: pilih paket → bayar (simulasi) → status berubah ACTIVE → badge di sidebar berubah jadi "Zyba Plus" → muncul di Riwayat Pembayaran.
Feature Gating Free vs Plus (Bagian 27):

 Kuota 20 pesan/hari untuk Free ditegakkan di server (checkMessageQuota), bukan cuma dicek di frontend.
 Modal "Out of Chat Limit" (Bagian 10.6) muncul saat kuota habis, bukan generic error.
 Insight mendalam, laporan bulanan, dan komunitas eksklusif masing-masing dicek hasFeature() di server sebelum diproses/ditampilkan.
 Dites langsung: user Free coba akses fitur Plus lewat API langsung (bukan cuma UI) — pastikan tetap ditolak server, bukan cuma disembunyikan di frontend.
Lampiran A — Sitemap Lengkap
Rangkuman seluruh route yang sudah dispesifikasikan di dokumen ini, dikelompokkan per area akses. Dipakai sebagai referensi cepat — detail tiap halaman ada di bagian bernomor terkait (dirujuk di kolom kanan).

Diagram
Sub-halaman Settings

Main App (sidebar utama, butuh onboardingCompleted)

Auth & Onboarding

Mulai Sekarang

contextual sidebar

contextual sidebar

/ (Landing Page)

/onboarding
(Welcome + Sign Up/In + OTP)

/login

/assessment
(Gate wajib sebelum akses app)

/welcome
(Tour setelah signup)

/dashboard (Home)

/mood-check-in

/companion

/companion/[slug]
(per-percakapan)

/activity
(Smart Activity Planner)

/wellness-journey

/community (Feed)

/community/[slug]
(search, messages, activity, profile, insights)

/resources

/settings

Info Profil

Password & Keamanan

Data & Privasi

Hapus Akun

Karakter Zyba

Notifikasi

Visibilitas Postingan

/settings/zyba-plus

/settings/zyba-plus/success

/settings/billing

Tabel Route (Referensi Lengkap)
Route	Deskripsi	Akses	Rujukan Bagian
/	Landing page publik	Publik	9
/onboarding	Welcome carousel + Sign Up/In + OTP	Publik	4.A
/login	Sign in user lama	Publik	4.A
/assessment	Profile setup + kuisioner kesehatan mental (satu flow gabungan), gate wajib	Auth, belum onboardingCompleted	4.B&C, 23.1 (gating)
/welcome	Tour fitur setelah signup	Auth	8.6
/dashboard	Home — ringkasan mental health metrics	Auth + onboarding selesai	4.E
/mood-check-in	Check-in mood harian (sudah gabung daily-assessment)	Auth	4.G, 8.5.1
/companion	Zyba Companion — empty state / default	Auth	10
/companion/[slug]	Percakapan individual (di-repurpose dari scope creep lama)	Auth	10.7, 23.1
/activity	Smart Activity Planner	Auth	4.I
/wellness-journey	Wellness Journey	Auth	4.E/G
/community	Feed komunitas	Auth	11
/community/search /messages /activity /profile /insights	Sub-view Community via [slug]	Auth	11.5, 23.2
/resources	Artikel & course	Auth	4.D
/settings	Halaman akun terpusat	Auth	23.3, 24
/settings/zyba-plus	Pilih paket Free/Plus	Auth	26.3
/settings/zyba-plus/success	Konfirmasi setelah bayar	Auth	26.3
/settings/billing	Riwayat pembayaran	Auth	24.1, 26.3
API Routes (Backend, Bukan Halaman)
Route	Fungsi	DB yang Dipakai
/api/auth/*	Login, signup, OTP, Google OAuth	Account
/api/mood	CRUD mood check-in	Account
/api/companion/*	Kirim pesan, kelola percakapan	Companion (+ Account untuk cek kuota, Bagian 27)
/api/community/*	Feed, post, komentar, like	Community (+ Account untuk data author, Bagian 17.5)
/api/billing/checkout /webhook /history	Alur pembayaran Zyba Plus	Account
/api/user/me	Data user untuk sidebar/dashboard	Account
Catatan: sitemap ini akan berubah kalau ada penyesuaian struktur di masa depan — perbarui lampiran ini setiap kali ada route baru/dihapus, supaya tetap jadi referensi yang akurat.

Lampiran B — Deployment Vercel: Bug "Server Error" Saat Login
Dilaporkan: login gagal dengan pesan "Server error" di deployment Vercel (*.vercel.app). Dicek langsung ke github.com/syauqiazka/zyba_, ditemukan 2 penyebab konkret, keduanya terkonfirmasi lewat kode, bukan dugaan.

B.1 postinstall Belum Update untuk 3 Skema Prisma (Penyebab Utama)
Temuan: package.json saat ini punya "postinstall": "prisma generate" — perintah lama dari era 1 skema tunggal. Sejak Bagian 17 (split jadi 3 database), prisma/schema.prisma sudah tidak ada lagi (dipecah ke prisma/account/, prisma/companion/, prisma/community/). Script yang benar (db:generate:all) sudah ada di package.json, tapi tidak pernah dipanggil oleh postinstall.

Akibat: Vercel menjalankan npm install (atau pnpm install) di setiap deployment → memicu postinstall → prisma generate gagal/tidak menghasilkan apa-apa (tidak ada schema.prisma di root) → ketiga Prisma Client (@/generated/account-client, dst.) tidak pernah ter-generate di server Vercel → semua route yang butuh database (termasuk login, yang query ke accountDb) crash dengan 500 error → muncul sebagai "Server error" generic di frontend.

Perbaikan (satu baris di package.json):

"postinstall": "npm run db:generate:all"
Atau kalau pakai pnpm (lihat B.2): "postinstall": "pnpm run db:generate:all".

B.2 Dua Lockfile Sekaligus — pnpm-lock.yaml DAN package-lock.json
Temuan: kedua file ini ada bersamaan di root repo. Vercel mendeteksi package manager berdasarkan lockfile yang ada — kalau ada dua, hasilnya bisa ambigu/tidak konsisten antara build lokal dan build di Vercel, berpotensi menginstall versi dependency yang berbeda dari yang dites di lokal ("works on my machine, gagal di Vercel").

Perbaikan:

Pilih satu package manager — karena sudah eksplisit ditambahkan pnpm, pertahankan pnpm, hapus package-lock.json dari repo (git rm package-lock.json, commit).
Tambahkan field eksplisit di package.json supaya tidak ambigu lagi ke depannya:
"packageManager": "pnpm@9.0.0"
(sesuaikan angka versi dengan versi pnpm yang benar-benar dipakai, cek pnpm -v).
Kalau project di Vercel Dashboard punya setting "Install Command" manual yang masih menyebut npm install, ubah jadi pnpm install (Settings → General → Build & Development Settings), atau kosongkan supaya Vercel auto-detect dari lockfile yang tersisa.
B.3 Checklist Verifikasi Deployment (Jalankan Urut)
 postinstall sudah memanggil db:generate:all, bukan prisma generate polos.
 Hanya ada satu lockfile di repo (pnpm-lock.yaml), package-lock.json sudah dihapus.
 packageManager field sudah ditambahkan di package.json.
 Semua environment variable dari .env lokal (6 DATABASE_URL_*/DIRECT_URL_* Bagian 17.3, API keys AI Bagian 19.3, BLOB_READ_WRITE_TOKEN, MIDTRANS_*, NEXTAUTH_SECRET/URL) sudah di-set juga di Vercel Dashboard → Settings → Environment Variables — env var lokal tidak otomatis ikut ter-deploy, ini penyebab umum lain untuk "Server error" kalau poin B.1/B.2 sudah beres tapi masih gagal.
 NEXTAUTH_URL di environment Vercel diisi dengan domain deployment yang benar (https://a-x6se.vercel.app atau domain final), bukan http://localhost:3000.
 Setelah semua di atas, trigger redeploy (bukan cuma "Retry" dari deployment lama — kalau env var baru ditambahkan, harus deployment baru).
 Cek Vercel Dashboard → Deployments → [deployment terkait] → Functions/Logs untuk lihat error message asli kalau masih gagal — pesan "Server error" di frontend itu generic, log Vercel yang punya detail sebenarnya (nama error, stack trace).
Lampiran C — Laporan Bug dari User Testing
Dilaporkan setelah teman mencoba app langsung di HP. 4 temuan berikut belum sempat diverifikasi ke file persis (GitHub API kena rate limit saat pengecekan), tapi pola bug dan cara perbaikannya sudah pasti — Antigravity perlu grep sendiri untuk menemukan file yang tepat.

C.1 Sidebar /community Belum Responsif di Mobile
Gejala: perbaikan responsif mobile (Bagian 15.1) sudah beres untuk sidebar utama, tapi contextual sidebar khusus Community (CommunitySidebar.tsx, Bagian 11.5) belum ikut diperbaiki — kemungkinan besar karena itu komponen terpisah dari Sidebar.tsx utama, jadi perbaikan sebelumnya tidak otomatis kena ke situ.

Perbaikan: terapkan pola off-canvas drawer yang sama (tombol hamburger md:hidden, wrapper fixed md:sticky, spacer hidden md:block) ke CommunitySidebar.tsx juga — cek dulu apakah dia reuse logic yang sama dengan Sidebar.tsx utama atau implementasi independen. Kalau independen, duplikasi pola respon mobile-nya secara manual. Ingat juga catatan Bagian 15.1: pastikan padding/margin khusus mobile di-reset dengan md: di breakpoint desktop, supaya tidak mengulang bug yang sama.

C.2 /assessment Masih Belum Selesai — Prioritas Naik
Gejala: flow awal bikin akun (/assessment, Bagian 4.B&C — profile setup + kuisioner kesehatan mental) dilaporkan "masih jelek banget". Ini konsisten dengan temuan sebelumnya: step profile setup (avatar, OTP, notifikasi) belum ada sama sekali di kode. Ini bukan bug kecil — ini fitur onboarding inti yang belum lengkap, jadi kesan pertama user ke app langsung buruk.

Tindakan: naikkan prioritas implementasi 8 step di Bagian 4.B&C ke atas — ini harus selesai sebelum polish-polish lain, karena setiap user baru wajib lewat flow ini.

C.3 Notification Badge (Pesan & Follow, ala Instagram)
Fitur baru diminta: badge notifikasi angka kecil (merah/oranye, pojok kanan-atas ikon) di nav sidebar Community — khususnya item Pesan (unread direct message count) dan indikator follow/pengikut baru, mengikuti pola umum Instagram.

Implementasi:

Tambahkan field counter di response API yang dipanggil CommunitySidebar (mis. unreadMessageCount, newFollowerCount) — dihitung dari data real (pesan belum dibaca, follower baru sejak terakhir dicek), bukan angka statis.
UI badge: lingkaran kecil bg-orange-500 (konsisten palet Bagian 3.1) di pojok kanan-atas ikon nav, isi angka (atau titik polos kalau count > 9, pola umum: "9+").
Update badge real-time atau near-real-time (polling ringan tiap beberapa detik, atau refresh saat navigasi) — jangan cuma dihitung sekali saat halaman pertama load lalu diam selamanya.
Catatan: kalau fitur DM antar pengguna (dari request sebelumnya soal "bertukar pesan antar pengguna") belum diimplementasikan, badge "Pesan" ini bergantung pada fitur itu selesai duluan.

C.4 Bug Input "0" di Form Signup — Angka Nempel di Depan
Gejala: field input di form signup (kemungkinan nomor telepon atau field numerik lain) menampilkan 0 sejak awal. Saat user mengetik 17, hasilnya jadi 017 bukan 17 — angka baru ditempel di belakang nilai awal, bukan menggantikannya.

Penyebab paling umum untuk pola bug ini (cek satu-satu):

State di-inisialisasi sebagai angka useState(0) (number), bukan string kosong useState("") — begitu di-render ke value={phone}, React menampilkan "0" sebagai starting value.
onChange handler salah menggabungkan nilai lama + baru (setPhone(prev => prev + e.target.value)) alih-alih mengganti penuh (setPhone(e.target.value)).
Perbaikan (pola umum, cari input yang cocok dengan grep -rn "useState(0)" src/app/onboarding):

// SALAH
const [phone, setPhone] = useState(0);
<input value={phone} onChange={(e) => setPhone(prev => prev + e.target.value)} />

// BENAR
const [phone, setPhone] = useState("");
<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} // hanya angka, replace penuh
/>
Terapkan pola yang sama ke field numerik lain di flow signup/assessment (kalau ada) yang punya gejala serupa — jangan cuma perbaiki satu field yang dilaporkan, cek semua input angka di flow onboarding.

Lampiran D — Selected State, Zyba Score Dinamis, dan Fix CTA Dashboard
D.1 Visual Feedback "Terpilih" untuk Pilihan Jawaban
Berlaku di: /assessment (semua step kuisioner, Bagian 4.B&C) dan /mood-check-in.

Saat ini kemungkinan pilihan jawaban (radio/button choice) tidak punya state visual yang jelas begitu diklik — user tidak yakin apakah pilihannya beneran terekam. Standardisasi 3 state berikut untuk semua elemen pilihan jawaban di kedua flow ini:

/* Default (belum dipilih) */
border: 1px solid rgba(41, 35, 31, 0.1);  /* brown-900/10 */
background: white;

/* Hover (belum dipilih, kursor di atas) */
border-color: rgba(233, 130, 85, 0.4);  /* orange-500/40 */
background: rgba(233, 130, 85, 0.04);

/* Selected (sudah dipilih) */
border: 2px solid var(--zyba-orange-500);  /* solid, lebih tebal dari default */
background: var(--zyba-orange-100);
/* tambahkan ikon centang (Lucide Check) di kanan pilihan, atau font-weight lebih tebal pada teks */
Transisi antar state pakai transition: all 200ms ease supaya terasa responsif, bukan berubah tiba-tiba. Terapkan pola yang sama persis ke semua tipe pilihan (single-select goal/gender, skala 1-5 stres, mood selector, dll.) — konsisten di seluruh flow, jangan beda-beda antar step.

D.2 Zyba Score — Dihitung dari 3 Aspek, Berubah Seiring Waktu
Perbaikan penting: Zyba Score tidak boleh jadi angka statis yang cuma diambil sekali dari hasil /assessment awal. Sesuai positioning inti ZYBA (Bagian 1 — "Pendamping Kesehatan Mental, Fisik, dan Sosial"), skor ini harus dihitung dari 3 aspek itu, dan dihitung ulang setiap kali ada data baru masuk — bukan snapshot beku dari onboarding.

Formula (Account DB + Community DB, cross-database aggregation):

// src/backend/scoring/zybaScore.ts
import { accountDb } from "@/backend/db/accountClient";
import { communityDb } from "@/backend/db/communityClient";

const WINDOW_DAYS = 7; // rolling window, bisa disesuaikan (7 atau 30 hari)

export async function calculateZybaScore(userId: string): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);

  // --- Aspek Mental: rata-rata mood + level stres terbalik (makin rendah stres, makin tinggi skor) ---
  const moodEntries = await accountDb.moodEntry.findMany({
    where: { userId, createdAt: { gte: since } },
  });
  const mentalScore = calculateMentalScore(moodEntries); // 0-100, helper terpisah

  // --- Aspek Fisik: konsistensi & penyelesaian aktivitas ---
  const activities = await accountDb.activityLog.findMany({
    where: { userId, createdAt: { gte: since } },
  });
  const fisikScore = calculateFisikScore(activities); // 0-100

  // --- Aspek Sosial: partisipasi komunitas (cross-DB, Bagian 17.5) ---
  const [postCount, commentCount] = await Promise.all([
    communityDb.communityPost.count({ where: { userId, createdAt: { gte: since } } }),
    communityDb.communityComment.count({ where: { userId, createdAt: { gte: since } } }),
  ]);
  const sosialScore = calculateSosialScore(postCount, commentCount); // 0-100

  // Bobot bisa disesuaikan — mental paling berat karena itu fokus utama ZYBA
  const zybaScore = Math.round(mentalScore * 0.5 + fisikScore * 0.25 + sosialScore * 0.25);

  return Math.max(0, Math.min(100, zybaScore));
}
Kapan dihitung ulang:

On-demand setiap kali Dashboard di-load (paling sederhana, cukup untuk skala kompetisi) — ATAU
Event-driven: setiap kali ada MoodEntry/ActivityLog/CommunityPost baru tersimpan, trigger recalculation dan simpan hasilnya ke User.zybaScore (field sudah ada di schema) supaya tidak perlu hitung ulang tiap request.
Skor dari /assessment awal (onboarding) tetap dipakai sebagai baseline pertama (User.zybaScore diisi awal dari situ), tapi begitu ada data mood/aktivitas/komunitas baru masuk, skor wajib berubah mengikuti formula di atas — bukan tetap diam di angka onboarding selamanya.

Detail bobot & cara hitung calculateMentalScore/calculateFisikScore/calculateSosialScore bisa disesuaikan Antigravity sesuai data yang tersedia — prinsip intinya yang wajib dipegang: 3 aspek, dinamis, cross-database.

D.3 Fix: Dashboard Jangan Arahkan ke /assessment untuk Aksi Harian
Klarifikasi (menegaskan ulang Bagian 4.B&C): /assessment hanya untuk sekali di awal saat user baru bikin akun. Semua CTA/shortcut di Dashboard yang sifatnya rutin/harian (mis. "Luangkan 5 menit untuk relaksasi dan check-in mood hari ini") harus mengarah ke /mood-check-in, bukan /assessment.

Audit yang perlu dilakukan: cari semua <Link href="/assessment"> atau router.push("/assessment") di dashboard/page.tsx dan komponen terkait — pastikan tidak ada yang dipakai untuk aksi harian/rutin. Satu-satunya tempat /assessment boleh dituju adalah dari middleware gating (Bagian 23.1) untuk user yang onboardingCompleted === false.

Dokumen ini konsolidasi dari: review visual Figma UI kit awal, review langsung ke kode github.com/syauqiazka/zyba / zyba_, dan referensi gaya (landing page ala OpenRouter, Companion ala Claude.ai, Community ala Threads) — semua warna referensi eksternal disesuaikan ke palet ZYBA, bukan ditiru mentah-mentah.