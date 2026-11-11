# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Next.js 14 (App Router) + Tailwind CSS + Prisma ORM + Neon PostgreSQL

## Users
Individu (khususnya generasi muda / Gen Z) yang sedang mengalami tekanan mental, stres akademik atau pekerjaan, kecemasan, atau kelelahan emosional harian, yang membutuhkan ruang aman yang hangat, suportif, privat, dan tidak menghakimi.

## Product Purpose
ZYBA (Gen Z Wellness Support) hadir sebagai pendamping kesehatan holistik (mental, fisik, dan sosial) berbasis AI. Alur inti produk: **Curhat → Solusi → Program → Aksi**. Produk ini bertujuan memberikan ruang refleksi emosional harian yang menenangkan, rekomendasi aktivitas mikro yang memberdayakan tanpa paksaan produktivitas toksik, serta perlindungan keselamatan krisis melalui intervensi bantuan darurat resmi yang selalu siaga.

## Positioning
Pendamping kesejahteraan digital yang memadukan AI companion empatik, pelacakan mood harian berbasis ekspresi, perencanaan kebiasaan tenang (*Smart Activity Planner*), dan komunitas suportif yang terkurasi aman. ZYBA secara tegas membedakan diri dari aplikasi produktivitas yang menekan dan platform terapi klinis yang dingin/kaku: antarmuka ZYBA hangat seperti sahabat terpercaya, tidak menggunakan gamifikasi agresif yang memicu cemas, dan memiliki sistem pengamanan krisis otomatis (*Crisis Safety Engine*) yang menghubungkan pengguna ke hotline resmi saat terdeteksi risiko bahaya diri.

## Operating Context
Pengguna membuka ZYBA melalui web desktop (dengan dukungan mobile responsif) pada momen-momen rentan atau reflektif: pagi hari untuk niat harian, jeda istirahat di saat stres melanda, atau malam hari sebelum tidur untuk evaluasi suasana hati dan relaksasi pernapasan. Penggunaan bersifat personal, hening, dan membutuhkan konsentrasi tanpa gangguan visual yang berlebihan.

## Capabilities and Constraints
- **Alur Utama Navigasi**: Dashboard → Mood Check-In (`/daily-assessment`) → Tanya Zyba (`/companion`) → Smart Activity Planner (`/activity`) → Ruang Sehat (`/wellness-journey`) → Komunitas Zyba (`/community`) → Wawasan & Edukasi (`/resources`).
- **Protokol Keselamatan Krisis**: Modul `src/lib/crisisDetection.ts` dan tampilan `CRISIS_RESOURCES` (Layanan Sejiwa 119 ext. 8, LISA, Into The Light) adalah batasan mutlak: tidak boleh diubah perilakunya, tidak boleh disamarkan oleh efek visual, dan dilarang menggunakan warna alarm agresif (merah bahaya) untuk konten krisis pengguna (gunakan palet tenang netral).
- **Integritas Bisnis & Data**: Prisma schema, alur autentikasi JWT, API routes, dan mekanisme fallback storage transien (`data/*.json`) tidak boleh diubah logikanya.
- **Batasan Tampilan**: Dilarang menggunakan animasi berkedip/agresif, gamifikasi penyebab cemas, copy bernada sensasional/hype, serta statistik karangan. Wajib patuh pada `prefers-reduced-motion`.

## Brand Commitments
- **Nama Produk**: ZYBA (Gen Z Wellness Support).
- **Nada & Suara**: Tenang, hangat, aman, tepercaya, santun, memberdayakan, tanpa basa-basi generic AI slop.
- **Palet Warna Terkunci**: 
  - Background Utama: Cream (`#F7F2E7`)
  - Tipografi & Kontras Gelap: Brown 900 (`#3B2A20`), Brown 700 (`#5A4636`)
  - Aksen Kesejahteraan: Green 500 (`#8FAE5D`), Green 100 (`#E4EED2`)
  - Aksen Kehangatan & CTA: Orange 500 (`#F2884B`), Orange 100 (`#FCE3D3`)
  - Mood Spectrum: Depressed (`#A99BE0`), Sad (`#EE8A5E`), Neutral (`#6B5645`), Happy (`#E8C24A`), Overjoyed (`#8FAE5D`)
  - Destruktif: Danger (`#D9534F`) — hanya untuk hapus akun.
- **Tipografi Resmi**: Manrope (`font-display`) untuk judul/display, DM Sans (`font-body`) untuk body text dan antarmuka.

## Evidence on Hand
- Repositori kode lengkap Next.js 14 App Router di folder `zyba_`.
- Dokumen spesifikasi arsitektur komprehensif di `AGENTS.md`.
- Dokumen otoritas desain kanonikal di `design.md` / `DESIGN.md` dan Master Design System di `design-system/zyba/MASTER.md`.
- 12 berkas spesifikasi mockdocs halaman resmi di direktori `design-system/zyba/pages/` (`dashboard.md`, `mood-check-in.md`, `companion.md`, `activity.md`, `wellness-journey.md`, `community.md`, `resources.md`, `onboarding-assessment.md`, `settings-billing.md`, `achievements.md`, `landing.md`, `guidebook.md`).
- Kontrak palet terkunci mutlak di `design-system/PALETTE_LOCK.md`.
- Komponen krisis aktif: `CrisisBanner.tsx` dan `CrisisModal.tsx`.
- Skema database di `prisma/schema.prisma`.

## Product Principles
1. **Ketenangan di Atas Segala-galanya (Calm Over Hype)**: Visual harus memberikan rasa lega dan hening saat pengguna membuka layar. Tidak ada elemen kompetitif atau notifikasi menuntut.
2. **Keamanan & Respek Emosional**: Menghargai privasi perasaan pengguna. Deteksi risiko krisis hadir sebagai pelindung yang sigap, bukan interupsi yang menakut-nakuti.
3. **Langkah Mikro yang Realistis**: Mendorong progres nyata lewat tindakan-tindakan kecil yang bisa dicapai hari ini tanpa beban.
4. **Keaslian & Transparansi (Anti-Slop)**: Tidak ada statistik palsu, tidak ada klaim testimoni buatan, tidak ada elemen dekorasi tanpa makna.

## Accessibility & Inclusion
- Rasio kontras teks terhadap latar belakang minimal 4.5:1 (WCAG AA).
- Navigasi penuh melalui keyboard dengan fokus visual yang jelas.
- Dukungan menyeluruh untuk `prefers-reduced-motion`.
- Target sentuh minimal 44x44px untuk kenyamanan interaksi.

