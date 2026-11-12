# ZYBA Feature Checklist (Fase 0 — Baseline Kontrak Fitur)

Dokumen ini memetakan seluruh fitur, endpoint API, dan halaman aktif di ZYBA yang **wajib berfungsi persis sama** selama dan setelah proses redesign total.

---

## 1. Auth, Onboarding & Gating

- [x] **Registrasi Akun Baru (Email/Password)**
  - Halaman: `/login?tab=signup`, `/onboarding` (redirect ke signup)
  - API: `POST /api/auth` (action: `REGISTER`)
  - Validasi: password minimal 8 karakter, email valid
- [x] **Login Email & Password**
  - Halaman: `/login`
  - API: `POST /api/auth` (action: `LOGIN`)
  - Session: JWT token (`auth-token` cookie via jose HS256)
- [x] **Google OAuth Authentication**
  - Trigger: Tombol "Lanjutkan dengan Google" di `/login`
  - API: `GET /api/auth/google`, `GET /api/auth/google/callback`
  - Handling: Callback profile fetch, exchange token, redirect ke target
- [x] **Verifikasi OTP (One-Time Password)**
  - API: `POST /api/auth/otp` (action: `SEND_OTP`, `VERIFY_OTP`)
  - Kontrak: HMAC proof token untuk verifikasi pendaftaran
- [x] **Reset Password / Lupa Password**
  - Halaman: Modal/view di `/login?tab=forgot`
  - API: `POST /api/auth/reset-password`
- [x] **Welcome Tour**
  - Halaman: `/welcome`
  - Slide carousel perkenalan nilai-nilai ZYBA
- [x] **Assessment Awal & Profile Setup 8-Step**
  - Halaman: `/assessment`
  - API: `POST /api/assessment`
  - Alur: Avatar selector, nama/bio, OTP setup, biometric step (skip jika tidak ada), preferensi notifikasi, kuesioner kesehatan mental, AI expression analysis, loading compilation, "You're all set up"
- [x] **Middleware Gating & Onboarding Protection**
  - File: `middleware.ts`
  - Invariant: User yang belum `onboardingCompleted` otomatis di-redirect ke `/assessment` jika mengakses protected route (`/dashboard`, `/companion`, dll.)
- [x] **Terms of Service Agreement Modal**
  - Komponen: `TermsAgreementModal.tsx`
  - API: `POST /api/auth` (action: `ACCEPT_TERMS`)

---

## 2. Dashboard (`/dashboard`)

- [x] **Sapaan Personal & Emotional Weather**
  - Menampilkan sapaan adaptif berdasarkan waktu Jakarta dan nama pengguna
  - Emotional weather badge berdasarkan skor dan kondisi batin
- [x] **Zyba Score Ring**
  - Komponen: `MetricScoreCard.tsx`
  - API: `GET /api/user/me`, `GET /api/daily-assessment`
  - Kalkulasi: `getLatestZybaScore()` dari asesmen harian terbaru
- [x] **Metrik Ringkas Kehadiran & Percakapan**
  - Komponen: `TactileMetricCards.tsx`
  - Menampilkan angka nyata hari streak konsistensi dan jumlah percakapan tanpa angka karangan
- [x] **Rutinitas Hari Ini & Checklist Interaktif**
  - Komponen: `SanctuaryRightRail.tsx`, `TrackerChecklist.tsx`
  - API: `GET /api/activity`, `POST /api/activity` (sync database dan localStorage)
- [x] **Kotak Tenang: Grounding 5-4-3-2-1**
  - Event: `window.dispatchEvent(new CustomEvent("zyba_open_grounding"))`
  - Membuka modal panduan grounding sensorik anti-panik
- [x] **Widget Zyba Companion**
  - Komponen: `CompanionWidget.tsx`
  - Quick input menuju `/companion?initialMsg=`
- [x] **Manajemen Foto Profil (Avatar Upload, Crop & Cooldown)**
  - Komponen: `UserAvatar.tsx`, `AvatarCropModal.tsx`
  - API: `GET /api/user/avatar`, `POST /api/user/avatar`
  - Fitur: Upload gambar (JPG/PNG/WEBP/GIF <= 8MB), crop melingkar, cooldown ganti foto
- [x] **Status Berlangganan & Riwayat Pembayaran**
  - Komponen: `PremiumStatusWidget.tsx`
  - API: `GET /api/billing/history`
  - Menampilkan paket aktif (FREE/PLUS) dan daftar invoice Midtrans

---

## 3. Mood Check-In & Daily Assessment (`/mood-check-in`, `/daily-assessment`)

- [x] **Alur Check-In Mood Harian**
  - Halaman: `/mood-check-in` (halaman `/daily-assessment` redirect 307 ke sini)
  - API: `GET /api/daily-assessment`, `POST /api/daily-assessment`
- [x] **Pemilih Mood 5 Token (MoodPebble)**
  - 5 skala emosional kanonikal: Depressed, Sad, Neutral, Happy, Overjoyed
- [x] **Slider Tingkat Stres & Kualitas Tidur**
  - Rentang 1–5 dengan label deskriptif
- [x] **Jurnal Refleksi Bebas & Deteksi Krisis**
  - Deteksi risiko instan: `detectRisk()` di `src/lib/crisisDetection.ts`
  - Memunculkan banner bantuan darurat Sejiwa 119 jika terdeteksi kata krisis
- [x] **Kalender Riwayat Mood Bulanan**
  - Visualisasi ritme mood per tanggal
- [x] **Riwayat Catatan Jurnal**
  - API: `GET /api/journal`, `POST /api/journal`

---

## 4. Zyba Companion (`/companion`, `/companion/[slug]`)

- [x] **Daftar Percakapan & Manajemen Sesi**
  - API: `GET /api/companion/conversations`, `POST /api/companion/conversations`, `DELETE /api/companion/conversations`
  - Navigasi per slug: `/companion/[slug]`
- [x] **Pemilihan Persona Pendamping**
  - 3 Persona resmi: Zyba Empathy, Zyba Mindful, Zyba Solution
- [x] **Pemilihan Model AI (Multi-Provider)**
  - API: `GET /api/companion/models`
  - Provider: Gemini, Groq, Mistral, OpenRouter
- [x] **Interaksi Pesan (Teks, Streaming & Typing Indicator)**
  - API: `POST /api/companion`
- [x] **Voice / Speech-to-Text (STT)**
  - Hook: `useSTT`
  - API: `POST /api/companion/stt`
- [x] **Text-to-Speech (TTS)**
  - Audio player respon suara pendamping
  - API: `POST /api/companion/tts`
- [x] **Quota Meter & Modal Kuota Habis**
  - API: `GET /api/companion/quota`
  - Menampilkan token tersisa dan opsi upgrade jika limit tercapai
- [x] **Crisis Safe Detection & Banner**
  - Menghalangi respon bahaya dan menyodorkan hotline jika terdeteksi krisis

---

## 5. Smart Activity Planner (`/activity`)

- [x] **Daftar Rencana Aktivitas Harian**
  - API: `GET /api/activity`, `POST /api/activity`
  - Filter kategori: Relaksasi, Fisik, Ketenangan, Refleksi
- [x] **Tandai Aktivitas Selesai**
  - Toggle status selesai dengan sinkronisasi ke poin/tracker harian
- [x] **Tambah & Hapus Aktivitas Kustom**
  - Form penambahan aktivitas mikro personal
- [x] **Taman Bernapas 4-7-8 (Breathing Garden)**
  - Modal latihan napas terpandu dengan lingkaran pacer (Tarik 4s, Tahan 7s, Hembuskan 8s)
- [x] **Audio Musik Latar Ambience**
  - Audio kontrol untuk relaksasi terpandu

---

## 6. Wellness Journey (`/wellness-journey`)

- [x] **Visualisasi Pertumbuhan Holistik (Radar/Tren)**
  - Menampilkan integrasi data mood, tidur, stres, dan kebugaran
- [x] **Wawasan Mingguan AI (Insights Engine)**
  - API: `GET /api/wellness/insights`
  - Mendeteksi korelasi (misal tidur vs stres)
- [x] **Rekomendasi Kebiasaan Mikro**
  - Rekomendasi langkah kecil berbasis data catatan
- [x] **Paywall Gate Zyba Plus untuk Wawasan Mendalam**
  - Halaman: `/settings/zyba-plus/insights`
  - Gating fitur analisis mendalam bagi pengguna gratis

---

## 7. Zyba Community (`/community`, `/community/[slug]`)

- [x] **Feed Komunitas & Infinite Pagination**
  - API: `GET /api/community`
  - Tab: Untuk Anda, Mengikuti, Populer
- [x] **Pembuatan Postingan (Inline & Modal)**
  - Komponen: `CreatePostModal.tsx`
  - Pilihan posting anonim vs identitas terbuka
  - API: `POST /api/community`
- [x] **Reaksi & Interaksi ("Kirim Pelukan", Komentar, Repost, Bookmark)**
  - API: `POST /api/community/comments`, `GET /api/community/comments`
  - Reaction pelukan suportif
  - API: `POST /api/community/bookmarks`
- [x] **Sub-View & Halaman Dinamis Slug**
  - `/community/search`
  - `/community/messages` (Direct Messages, API `/api/community/dm/*`)
  - `/community/notifications` (API `/api/community/notifications`)
- [x] **Profil Pengguna Komunitas & Follow System**
  - Halaman: `/community/profile/[userId]`, followers, following
  - API: `GET /api/community/users/[userId]/*`, `POST /api/community/follows/[userId]`
- [x] **Sistem Pelaporan Konten & Moderasi**
  - API: `POST /api/community/posts/[postId]/report`, `POST /api/community/comments/[commentId]/report`
- [x] **Deteksi Krisis Komunitas**
  - Banner Sejiwa 119 muncul jika teks postingan mengandung kata krisis

---

## 8. Sanctuary Resources (`/resources`, `/resources/[slug]`)

- [x] **Katalog Sumber Daya Kebugaran**
  - Filter: Semua, Artikel, Audio
  - API: `GET /api/resources`
- [x] **Halaman Baca Artikel / Panduan**
  - Halaman: `/resources/[slug]`
- [x] **Pemutar Audio Relaksasi / Meditasi**
  - Audio player tersemat dengan kontrol play/pause/seek
- [x] **Kartu Pro & Paywall Banner**
  - Preview konten eksklusif Zyba Plus

---

## 9. Pencapaian & Lencana (`/achievements`)

- [x] **Katalog Lencana Ketenangan (Quiet Milestones)**
  - API: `GET /api/achievements`, `GET /api/badges`
  - Filter kategori pencapaian
- [x] **Pemilih 3 Lencana Tampilan Profil**
  - Pengguna dapat memilih maksimal 3 lencana untuk disematkan di kartu profil
  - API: `POST /api/badges`

---

## 10. Pengaturan & Langganan (`/settings/*`)

- [x] **Pengaturan Profil Akun**
  - Halaman: `/settings`
  - Edit nama, username, bio, avatar
  - API: `POST /api/user/me`, `POST /api/user/username`
- [x] **Preferensi Notifikasi**
  - Toggle notifikasi pengingat check-in, companion, komunitas
  - API: `GET /api/settings/notifications`, `POST /api/settings/notifications`
- [x] **Privasi & Keamanan Data**
  - Ekspor data lengkap (`GET /api/settings/export`)
  - Hapus akun permanen (`POST /api/account/delete`)
- [x] **Konfigurasi Persona Companion**
  - Pengaturan gaya bahasa pendamping
- [x] **Alur Berlangganan Zyba Plus (Midtrans Snap Checkout)**
  - Halaman paket: `/settings/zyba-plus`
  - Halaman checkout: `/settings/zyba-plus/payment`
  - Halaman sukses: `/settings/zyba-plus/success`
  - API: `POST /api/billing/checkout` (membuat Snap Token Midtrans)
  - Webhook: `POST /api/billing/webhook` (menangani notifikasi settlement Midtrans)

---

## 11. Direktori Bantuan & Administrasi

- [x] **Guidebook Direktori Krisis (`/guidebook`)**
  - Informasi nomor bebas pulsa dan hotline kesehatan mental nasional (Sejiwa 119 ext. 8, Lisa Helpline, dsb.)
- [x] **Admin Moderasi & Pembayaran (`/admin/*`)**
  - `/admin` (Redirect otomatis ke `/admin/moderation`)
  - Antrean laporan konten (`GET /api/admin/reports`, action `POST /api/admin/moderation/action`)
  - Banding moderasi (`GET /api/admin/moderation/appeals`)
  - Log audit moderasi (`GET /api/admin/moderation/logs`)
  - Manajemen log transaksi pembayaran (`GET /api/admin/payments`)
  - AI Health Check (`GET /api/admin/ai-health`)

---

## 12. Landing Page & Utilitas Publik

- [x] **Halaman Beranda Publik (`/`)**
  - Hero editorial, pengenalan fitur, cara kerja, partner pendukung, FAQ, CTA
- [x] **Legal, Sitemap, Robots**
  - `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`
  - Halaman 404 & Error boundary
