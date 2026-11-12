# Gerbang Publik Mockdoc — Warm Invitation & Sanctuary Gateway (`/`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/` (Public Landing Page)  
> **Source Components:** `src/app/page.tsx`, `src/components/landing/*`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengunjung baru, mahasiswa, atau profesional muda Gen Z yang sedang mencari tempat beristirahat sejenak dari hiruk-pikuk kehidupan modern dan mendambakan pendamping kesejahteraan holistik tanpa penghakiman.
- **Mental Model:** *"Menemukan poster editorial hangat di dinding kafe tenang, membacanya sejenak, merasakan pengertian mendalam, dan memutuskan untuk melangkah masuk ke dalam ruang hening."*
- **Primary Job to Be Done (JTBD):** Memperkenalkan identitas ZYBA (*Gen Z Wellness Support*) secara transparan dan berwibawa, menyajikan 4 pilar sanctuary utama, menyajikan data kebutuhan nyata dari riset pitch deck resmi, dan memandu pengunjung mendaftar atau masuk ke dalam aplikasi via `/onboarding`.
- **Riset Pasar Kredibel (Pitch Deck Resmi — Tanpa Angka Karangan):**
  - **74,9 Juta:** Populasi generasi muda Gen Z di Indonesia yang menghadapi fase transisi krusial.
  - **81,1%:** Generasi muda yang pernah mencurahkan isi hati kepada asisten digital namun mendambakan respons yang lebih empatik dan aman.
  - **3 Pilar Holistik:** Kesehatan Mental, Fisik, dan Sosial yang saling terhubung.

---

## 2. Perubahan dari v1

- **Dihapus:** Hero section terpusat kaku yang terasa kosong dan memiliki hierarki visual lemah.
- **Dihapus:** Kumpulan kartu fitur yang menyerupai widget dashboard yang ditempelkan sembarangan di landing page.
- **Dihapus:** Pola *icon-in-a-box* (kotak warna-warni di atas setiap judul fitur).
- **Dihapus:** Angka statistik karangan atau klaim tidak berdasar seperti *"Ubah hidupmu dalam 7 hari"*.
- **Baru:** Komposisi editorial asimetris 60:40 pada hero section dengan tipografi berkarakter Manrope + DM Sans.
- **Baru:** Visual interaktif sanctuary preview (cuplikan ritme hening, pemilih mood taktil, dan ruang curhat privat).
- **Baru:** Bagian riset berbasis data empiris pitch deck dan alur ajakan ramah menuju `/onboarding`.
- **Alasan:** Menghadirkan kesan produk digital profesional kelas dunia yang bernapas, tenang, elegan, dan menjauhi slop template SaaS generik.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Header: Ramping 56px dengan logo ZYBA di kiri dan tombol *"Masuk"* di kanan (tautan navigasi diringkas).
  - Hero Section: 1 kolom terpusat dengan padding `px-5 pt-12 pb-16`. Teks headline 32px bernapas, tombol CTA pill utama lebar penuh.
  - Preview Widget: Kartu pratinjau sanctuary hening memanjang vertikal.
  - Fitur: 1 kolom kartu taktil dengan ruang lapang `gap-4`.
  - Riset & Statistik: Baris metrik vertikal dengan angka tebal dan sumber jelas.
- **Tablet (768px):**
  - Header: 64px dengan logo, tautan pilar utama, dan tombol aksi ganda.
  - Hero Section: Susunan semi-split dengan headline 44px dan ilustrasi kartu ritme di bawahnya.
  - Fitur Grid: 2 kolom x 2 baris `gap-6`.
  - Riset: Grid metrik 3 kolom berjarak lega.
- **Desktop (1280px):**
  - Header: Ramping mengapung atau terlabuh di atas kontainer max-w-[1240px] dengan logo, menu editorial, dan tombol masuk.
  - Hero Section: Golden split 60:40. Sisi kiri teks editorial kuat (headline 56px, badge kategori, CTA primer & sekunder), sisi kanan representasi interaktif Tactile Sanctuary (preview percakapan tenang, pebble mood, dan hembusan napas).
  - Fitur Utama: Grid asimetris 4 pilar sanctuary (`col-span-6` untuk fitur unggulan, `col-span-3` untuk pilar pendukung).
  - Riset Section: Panel lebar `rounded-[28px]` berlatar `bg-white/80 border border-brown-900/10` dengan 3 kolom data terverifikasi.
  - Footer Editorial: Penutup hangat dengan rujukan krisis Sejiwa 119 ext. 8 dan tautan hukum/privasi.

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`) dengan tekstur linen alami.
- **Tinta Teks:** `text-brown-900` (`#3B2A20`) untuk judul besar Manrope, `text-brown-700` (`#5A4636`) untuk narasi tubuh DM Sans.
- **Aksen Taktil:**
  - `bg-orange-500` / `hover:bg-orange-600` untuk tombol fokus utama (maksimal 1 per viewport).
  - `bg-green-100` / `text-green-700` untuk penanda keseimbangan hidup & kesehatan holistik.
  - `bg-orange-100` / `text-orange-600` untuk badge identitas Gen Z Wellness Support.
- **Garis Kontak:** `border-brown-900/10` (organik kertas halus).

---

## 5. Komponen Kunci & Hirarki Radius

1. **Navigation Header:**
   - Radius: `rounded-full` pada tombol aksi CTA primer.
   - Logo: Ikon bunga 4 kelopak khas ZYBA + tipografi `font-display font-extrabold text-xl`.
2. **Hero Sanctuary Split Container:**
   - Radius: `rounded-[28px]` pada preview frame sisi kanan.
   - Elemen interaktif internal: `rounded-[20px]` untuk kartu cuplikan curhat, `rounded-xl` untuk baris dialog.
3. **Pillar Feature Cards:**
   - Radius: `rounded-[24px]` untuk 2 kartu sanctuary utama, `rounded-[20px]` untuk kartu pilar pendukung.
   - Elevasi: Garis batas `border-brown-900/10` dengan bayangan kontak lembut `shadow-xs`.
4. **Research Banner Card:**
   - Radius: `rounded-[28px]` dengan padding internal `p-8 sm:p-12`.
5. **Call to Action Bottom Shell:**
   - Radius: `rounded-[28px]` berlatar `bg-brown-900 text-cream` dengan tombol pill `bg-orange-500 text-white`.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Halaman landing tampil lengkap dengan teks editorial tajam, preview interaktif, dan navigasi jelas menuju onboarding.
2. **Loading:** Seluruh aset gambar dan font termuat instan dengan fallback font sistem sans-serif tanpa lonjakan layout (CLS = 0).
3. **Empty:** Tidak relevan (halaman publik statis).
4. **Active:** Interaksi scroll memicu transisi halus, tab fitur interaktif di hero preview merespons klik pengguna dengan pergantian cuplikan konten.
5. **Error:** Jika script analitik atau CDN font gagal dimuat, konten halaman tetap dapat dibaca dengan tata letak sempurna berbasis font sistem.
6. **Crisis:** Footer landing page menyertakan tautan hening langsung menuju Direktori Bantuan Krisis Sejiwa 119 ext. 8 tanpa penghalang apapun.

---

## 7. Interaksi & Motion

- **Navigasi Halus:** Klik tautan anchor (*Fitur*, *Nilai*, *Riset*) menggeser viewport secara tenang (`scroll-behavior: smooth`).
- **Taktil Hover:** Tombol pill dan kartu fitur merespons kursor dengan pergeseran mikro `-translate-y-0.5` dan penguatan garis kontak.
- **Hero Reveal:** Konten hero muncul perlahan dengan transisi opasitas 300ms `ease-out`.
- **Reduced Motion:** Saat `prefers-reduced-motion: reduce` aktif, seluruh transisi pergeseran ditiadakan.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Kontras Teks:** Seluruh teks memenuhi rasio kontras minimum 4.5:1 untuk teks normal dan 3.0:1 untuk teks display besar.
- **Tautan & Tombol:** Setiap tautan memiliki teks deskriptif yang jelas bagi screen reader (bukan sekadar *"Klik di sini"*).
- **Struktur Heading:** Mengikuti hierarki ketat: satu `h1` di hero section, `h2` di setiap section utama, dan `h3` di kartu fitur.
- **Fokus Keyboard:** Navigasi tombol dan link menampilkan outline fokus tegas `focus-visible:ring-2 focus-visible:ring-orange-500/60`.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- Halaman landing adalah halaman publik tanpa dependensi cookie autentikasi.
- Tautan CTA utama mengarah langsung ke `/onboarding` (untuk pendaftaran dan masuk).
- Footer terhubung ke `/guidebook` untuk panduan krisis dan rujukan darurat.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Hero section menerapkan komposisi split asimetris 60:40 pada desktop (1280px).
- [ ] Tidak ada angka statistik karangan atau klaim tanpa rujukan resmi.
- [ ] Tidak ada kartu dengan radius seragam `rounded-[32px]`.
- [ ] Tidak ada penggunaan emoji sebagai ikon UI; seluruh ikon menggunakan Lucide SVG stroke 1.8px.
- [ ] Tombol CTA navigasi dan hero berfungsi langsung mengarahkan ke `/onboarding`.
- [ ] Halaman lolos pengujian aksesibilitas keyboard dan kontras warna WCAG AA.
