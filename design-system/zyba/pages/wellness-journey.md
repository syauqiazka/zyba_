# Ruang Sehat Mockdoc — Holistic Growth Canvas (`/wellness-journey`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/wellness-journey`  
> **Source Components:** `src/app/wellness-journey/page.tsx`, `src/app/wellness-journey/components/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna yang ingin memahami dinamika dan pola suasana hatinya dalam rentang mingguan/bulanan, tanpa merasa dihakimi oleh angka atau grafik analitik yang dingin.
- **Mental Model:** *"Membuka lembaran kilas balik jurnal di akhir pekan, mengamati riak gelombang perasaan, dan menyadari seberapa jauh langkah pemulihan diri telah berjalan."*
- **Primary Job to Be Done (JTBD):** Menyajikan grafik tren kesejahteraan berbasis kurva lembut, menyoroti korelasi kebiasaan harian terhadap suasana hati (*Pattern Detection*), dan menampilkan catatan jurnal reflektif mingguan.
- **Data & API Binding:**
  - Prisma Models: `MoodEntry`, `JournalEntry`, `ActivityLog`, `Assessment`
  - Endpoints: `GET /api/wellness/overview`, `GET /api/wellness/trends?days=7`, `GET /api/wellness/insights`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — River of Mindful Seasons*.
- **Antitesis SaaS Korporat:** Menolak tampilan dashboard analitik trading / saham yang penuh angka persentase merah-hijau agresif. Menggantinya dengan **Kurva Riak Tenang** (SVG wave bergaris pekat Brown 900 dengan area arsir lembut bernuansa Warm Orange `#FCE3D3` dan Olive Sage `#E4EED2`).
- **Kanvas & Material:** Kanvas Cream (`#F7F2E7`), kartu ringkasan bertekstur kertas linen tebal (`bg-white/90 border border-brown-900/10`).
- **Nada Bicara:** Reflektif, menghargai proses, menentramkan.
  - Heading: *"Setiap riak perasaan adalah bagian dari perjalanan tumbuhmu."*
  - Subtitle: *"Kesejahteraan batin bukanlah garis lurus sempurna, melainkan gelombang yang belajar kita arungi bersama."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Editorial Spread**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Section Atas: **Progress Overview Banner** (lebar penuh 12 kolom, `rounded-[24px]`).
  - Section Tengah:
    - Kiri (`col-span-8`): **Wellness Trend Chart** (kurva gelombang 7-30 hari) + **What Changed Reflection**.
    - Kanan (`col-span-4`): **Habits History** + **Free Pattern Detection Card**.
- **Tablet (768px – 1023px):**
  - Spacing Layout: `pl-[96px] pr-6 py-6`.
  - Grid: 2 kolom berjarak lapang `gap-6`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Tata Letak: Stack vertikal 1 kolom yang nyaman di-scroll dengan ibu jari.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Progress Overview Banner
- Container: `bg-orange-100/50 rounded-[24px] border border-orange-500/15 p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs`
- Konten Kiri:
  - Label: `font-body text-xs font-bold uppercase tracking-widest text-orange-500` (*"Ikhtisar 7 Hari Terakhir"*)
  - Judul: `font-display text-xl sm:text-2xl font-bold text-brown-900` (*"Keseimbangan Batin Terjaga Baik"*)
  - Deskripsi: `font-body text-sm text-brown-700 leading-relaxed max-w-xl`
- Konten Kanan:
  - Ring Skor Hening: Lingkaran progress SVG berdiameter 84px dengan stroke warna `#8FAE5D` tanpa lonjakan animasi kaku.

### B. Wellness Trend Chart (Tactile Wave Canvas)
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-6 sm:p-7 shadow-xs`
- Header: `flex items-center justify-between pb-4 border-b border-brown-900/10`
  - Judul: `font-display text-base font-bold text-brown-900`
  - Filter Waktu: 3 tombol pill (`7 Hari`, `14 Hari`, `30 Hari`) berlatar `bg-cream/60` dengan active state `bg-brown-900 text-cream`.
- Chart Canvas: SVG murni responsif tanpa library berat yang menyebabkan lag di ponsel entry-level.
  - Garis Gelombang: Stroke tebal 2.5px warna `#3B2A20`.
  - Titik Refleksi: Lingkaran titik 5px berborder `#FFFFFF` yang menampilkan tooltip tanggal & mood saat disentuh/hover.

### C. Free Pattern Detection & Habits History
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-5 sm:p-6`
- Insights List:
  - Row Item: `p-3.5 rounded-xl bg-cream/40 border border-brown-900/10 flex items-start gap-3 mb-3`
  - Ikon: Lucide `Lightbulb`, `Moon`, `Smile` stroke 1.8px.
  - Teks: *"Tidur di atas 7 jam berkorelasi dengan kestabilan fokusmu di siang hari."*

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Data Ready (7+ hari)** | Pengguna memiliki riwayat check-in $\ge 7$ hari | Kurva gelombang penuh, insight terdeteksi | Jelajahi riwayat atau ubah filter rentang |
| **New User (< 3 hari)** | Data riwayat belum cukup untuk tren | Kartu kosong hangat *"Perjalananmu baru saja dimulai. Terus isi check-in harian untuk melihat polamu."* | Klik tombol *"Isi Check-In"* |
| **Filtered View** | Pengguna menekan tab `30 Hari` | Transisi kurva halus (300ms) tanpa jeda loading putih | Mengamati tren jangka panjang |
| **Offline Fallback** | Sambungan internet putus | Menampilkan data cache lokal terakhir dengan banner halus *"Menampilkan riwayat tersimpan"* | Tetap dapat membaca insight |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan Lucide SVG garis 1.8px (`TrendingUp`, `Calendar`, `Sparkles`, `Smile`, `Info`).
- [x] **Zero Corporate Dashboard Cliches:** Tidak ada kartu rasio KPI kaku, tidak ada warna hijau/merah saham.
- [x] **No Card Inception:** Chart dan insight disajikan dalam kartu kontainer tunggal yang lega.
- [x] **Hierarki Radius:** Banner Utama 24px, Chart Container 20px, Row Items 12px, Filter Pill 9999px.
- [x] **Accessible Contrast:** Teks keterangan memenuhi rasio kontras WCAG AA $\ge 4.5:1$.
- [x] **Reduced Motion:** SVG chart transisi non-aktif jika `prefers-reduced-motion` bernilai `reduce`.

---

## 7. Verification Contract (obra/superpowers)

- **Trend Data Calculation:** Fungsi agregasi tren mood menghasilkan nilai terbobot 1.0–5.0 secara akurat tanpa membulatkan data secara keliru.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

