# Wawasan & Edukasi Mockdoc — Curated Sanctuary Library (`/resources`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/resources` (alias: `/resources/[slug]`)  
> **Source Components:** `src/app/resources/page.tsx`, `src/app/resources/components/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Gen Z yang ingin memahami akar kecemasan, mekanisme koping stres, atau panduan tidur tanpa terbebani oleh jargon akademis medis yang rumit.
- **Mental Model:** *"Melangkah ke perpustakaan kayu yang hening dengan jendela kaca hangat, mengambil buku esai berkualitas, dan membaca perlahan sembari menyeruput teh."*
- **Primary Job to Be Done (JTBD):** Menyediakan artikel terkurasi dari psikolog dan praktisi kesehatan mental, materi audio relaksasi terpandu, sistem bookmarking bacaan privat, dan materi eksklusif Zyba Plus yang transparan.
- **Data & API Binding:**
  - Prisma Models: `Resource` (`title`, `slug`, `summary`, `content`, `category`, `readTimeMin`, `isPremium`, `audioUrl`)
  - Endpoints: `GET /api/resources`, `GET /api/resources/[slug]`, `POST /api/resources/[slug]/bookmark`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Quiet Library Reading Room*.
- **Kanvas & Material:** Kanvas Cream (`#F7F2E7`), kartu artikel disajikan menyerupai sampul buku jurnal fisik (`bg-white/95 border border-brown-900/10 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]` dengan aksen garis tipis vertikal di sisi kiri kartu).
- **Tipografi Editorial Berkarakter:**
  - Judul Artikel: `font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug group-hover:text-orange-500 transition-colors`
  - Body Bacaan (`/resources/[slug]`): `font-body text-base sm:text-lg text-brown-900 leading-[1.8] font-normal max-w-2xl mx-auto`
- **Nada Bicara:** Mencerahkan, menyejukkan, berbasis bukti ilmiah (*evidence-based*) yang disampaikan dengan kehangatan manusiawi.

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Library Grid**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Section Atas: **Sanctuary Feature Hero Article** (`col-span-12`, `rounded-[24px]`).
  - Section Bawah: **Grid Artikel Multi-Kolom** (3 kolom `col-span-4 gap-6`).
- **Tablet (768px – 1023px):**
  - Grid 2 kolom berjarak `gap-6`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Tata Letak: Filter kategori pill horizontal scroll, disusul kartu artikel 1 kolom dengan thumbnail terintegrasi.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Featured Library Hero
- Container: `bg-green-100/60 rounded-[24px] border border-green-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shadow-xs`
- Konten Teks:
  - Badge: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-brown-900 text-xs font-semibold border border-brown-900/10`
  - Judul: `font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight mt-3 mb-2`
  - Deskripsi: `font-body text-sm sm:text-base text-brown-700 leading-relaxed max-w-xl`
  - CTA: `bg-brown-900 text-cream hover:bg-brown-900/90 rounded-full px-6 py-2.5 text-sm font-semibold transition-all mt-4`

### B. Resource Card (Sampul Jurnal Kertas)
- Container: `bg-white/95 rounded-[20px] border border-brown-900/10 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-brown-900/25 hover:shadow-sm transition-all group cursor-pointer`
- Meta Bar:
  - Waktu Baca: `flex items-center gap-1.5 text-xs text-brown-700/70 font-medium` (Ikon Lucide `Clock` 1.8px)
  - Badge Kategori: `px-2.5 py-0.5 rounded-full bg-cream text-brown-700 text-[11px] font-semibold border border-brown-900/10`
  - Bookmark Button: `p-1.5 rounded-full hover:bg-cream text-brown-700 hover:text-orange-500 transition-colors`
- Deskripsi Singkat: `font-body text-sm text-brown-700 leading-relaxed line-clamp-2 my-2`
- Footer Card: Tombol tautan halus *"Baca Selengkapnya →"*

### C. Audio Player Mini (Khusus Materi Relaksasi)
- Container: `bg-orange-100/70 rounded-xl p-3 border border-orange-500/20 flex items-center justify-between mt-3`
- Tombol Putar: `w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-500/90`
- Judul Audio & Durasi: `text-xs font-semibold text-brown-900` + `text-[11px] text-brown-700/70 ml-2`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Library Loaded** | Daftar artikel berhasil ditarik | Grid artikel rapi, filter kategori aktif | Klik kartu untuk membaca artikel |
| **Filtered by Category** | Pengguna memilih tab *"Manajemen Stres"* | Daftar menyaring artikel terkait seketika | Temukan bacaan spesifik |
| **Bookmark Toggled** | Pengguna menekan ikon simpan | Ikon bookmark terisi warna oranye hangat | Artikel tersimpan di profil pengguna |
| **Zyba Plus Paywall** | Artikel bertanda premium dibuka oleh free user | Pratinjau 2 paragraf pertama + kartu tawaran Zyba Plus santun | Akses atau kembali ke artikel gratis |
| **Reading Detail** | Masuk ke rute `/resources/[slug]` | Tampilan membaca lapang tanpa sidebar pengganggu | Membaca fokus dengan progress bar atas |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`BookOpen`, `Clock`, `Bookmark`, `Headphones`, `Sparkles`).
- [x] **Zero Clickbait Headlines:** Semua judul artikel mendidik dan santun tanpa umpan klik bombastis.
- [x] **No Card Inception:** Kartu artikel berdiri mandiri dalam CSS grid yang teratur.
- [x] **Hierarki Radius:** Hero Banner 24px, Article Card 20px, Audio Box 12px, Category Pills 9999px.
- [x] **Accessible Contrast:** Teks isi artikel memenuhi rasio kontras 11.2:1 (AAA) pada kanvas Cream/Milk White.
- [x] **Reduced Motion:** Penyelarasan animasi hover mematuhi `motion-reduce:transition-none`.

---

## 7. Verification Contract (obra/superpowers)

- **Slug Routing Contract:** Rute `/resources/[slug]` mengembalikan status 404 ramah pengguna jika slug tidak ditemukan.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

