---
name: ZYBA
description: Gen Z Wellness Support — The Tactile Sanctuary
colors:
  cream: "#F7F2E7"
  brown-900: "#3B2A20"
  brown-700: "#5A4636"
  green-500: "#8FAE5D"
  green-100: "#E4EED2"
  orange-500: "#F2884B"
  orange-100: "#FCE3D3"
  mood-depressed: "#A99BE0"
  mood-sad: "#EE8A5E"
  mood-neutral: "#6B5645"
  mood-happy: "#E8C24A"
  mood-overjoyed: "#8FAE5D"
  danger: "#D9534F"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "DM Sans, sans-serif"
    fontWeight: 400
rounded:
  dock: "28px"
  card-anchor: "24px"
  card-content: "20px"
  subcard: "16px"
  input: "12px"
  badge: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.brown-900}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-warm:
    backgroundColor: "{colors.orange-500}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-secondary:
    backgroundColor: "{colors.green-100}"
    textColor: "{colors.brown-900}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
  card-anchor:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.card-anchor}"
    padding: "24px 28px"
  card-content:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.card-content}"
    padding: "20px 24px"
  input-field:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.input}"
    height: "44px"
    padding: "0 16px"
---

# ZYBA Design Authority (design.md / DESIGN.md) — The Tactile Sanctuary

<!-- impeccable:design-schema 1 -->

> **Otoritas Desain Gabungan**: Master Design System (UI/UX Pro Max) + Taste Art Direction + Impeccable Design Vocabulary + Obra/Superpowers Engineering Rigor + Anti-Slop Hygiene Filter.  
> **CANONICAL DOCUMENT**: File ini (`design.md`) bersama direktori `design-system/zyba/pages/` adalah sumber kebenaran resmi desain visual dan arsitektur interaksi ZYBA.  
> **COLOR PALETTE TERKUNCI MUTLAK**: Bagian warna pada dokumen ini 100% identik dengan `design-system/PALETTE_LOCK.md`. Dilarang mengubah nilai hex.

---

## 1. Overview & Direction (Arah Visual)

### Ide Visual Tunggal (1 Kalimat):
> *"Sanctuary of Tactile Warmth: Tempat perlindungan emosional hening yang hadir layaknya lembaran jurnal fisik berbahan kertas linen alami, dirancang dengan komposisi lapang yang memuliakan ketenangan batin."*

ZYBA dirancang sebagai antitesis terhadap dua kutub desain ekstrem yang merusak pengalaman aplikasi kesehatan mental modern:
1. **Bukan SaaS Analitik Korporat**: Tidak ada dashboard kaku penuh grafik metrik yang rumit, tidak ada sidebar 260px yang memotong ruang pandang, dan tidak ada hierarki nested-cards yang menyesakkan.
2. **Bukan Mainan Kartun Anak-Anak**: Tidak ada emoji yang dijadikan ikon tombol navigasi, tidak ada animasi loncat agresif (*bounce/ping*), dan tidak ada gamifikasi kompetitif yang menimbulkan rasa bersalah jika pengguna absen.

### Karakteristik Visual Inti (Taste Art Direction):
- **Kertas Linen & Tinta Tanah**: Kanvas Cream (`#F7F2E7`) sebagai 75% permukaan visual, teks Brown 900 (`#3B2A20`) yang pekat dan berwibawa layaknya tinta cetak di atas kertas berkualitas tinggi, dipadu Brown 700 (`#5A4636`) untuk narasi pendukung.
- **Asymmetric Golden Spread**: Tata letak asimetris (65% zona reflektif utama : 35% zona aksi tenang), menyisakan ruang napas (*whitespace*) lapang yang disengaja.
- **Tactile Material Depth**: Menolak bayangan hitam buram tebal ala template AI. Menggunakan garis kontak kertas tipis 1px (`border-brown-900/10`) dipadu bayangan kontak lembut (`shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]`).
- **Hierarki Radius Proporsional (Anti-Slop Radius Scale)**:
  Dilarang keras menyeragamkan `rounded-[32px]` pada seluruh kartu atau komponen reguler (`rounded-[32px]` dihapus total). Menerapkan skala radius berjenjang:
  - *Floating Zen Dock / Shell Container*: `rounded-[28px]` atau `rounded-[24px]`
  - *Major Sanctuary Anchor Cards (Hero/Banner)*: `rounded-[24px]`
  - *Content Cards & Widgets*: `rounded-[20px]` atau `rounded-[16px]`
  - *Sub-cards, Row Items & Form Inputs*: `rounded-xl` (12px)
  - *Pills, Badges & Action Buttons*: `rounded-full` atau `rounded-lg` (8px)
- **Ritme Pernapasan (*Breathing Rhythm*)**: Micro-interaction halus dan transisi tenang (250ms–350ms `cubic-bezier(0.16, 1, 0.3, 1)`), selalu mematuhi `motion-reduce:transition-none`.
- **Hearth Flame vs Red Streak**: Nyala lilin ketenangan SVG hening menggantikan api streak merah membara yang menekan psikologis pengguna.

---

## 2. Colors & Locked Palette (PALETTE_LOCK.md — Diff 0%)

| Token Semantik | Token Nama | Canonical Hex | Kelas Tailwind | Rasio Kontras (vs Cream) | Peruntukan Resmi dalam The Tactile Sanctuary |
|---|---|---|---|---|---|
| **Kanvas Utama** | Cream | `#F7F2E7` | `bg-cream`, `text-cream` | — | Kanvas dasar seluruh halaman (75% ruang visual) |
| **Material Kartu** | Milk White | `#FFFFFF` | `bg-white/90` | 1.07:1 (pada Cream) | Surface kartu utama bertekstur kertas halus bertepi halus |
| **Tinta / Teks Utama** | Brown 900 | `#3B2A20` | `text-brown-900`, `bg-brown-900` | **11.2:1 (AAA)** | Headings utama, tombol komitmen primer, border solid |
| **Tinta Sekunder / Label**| Brown 700 | `#5A4636` | `text-brown-700`, `bg-brown-700` | **7.4:1 (AAA)** | Body copy, microcopy, label waktu, deskripsi pendukung |
| **Aksen Kehangatan / CTA**| Orange 500 | `#F2884B` | `bg-orange-500`, `text-orange-500` | **3.2:1 (Large/Bold)**| Tombol aksi primer, highlight emosional penting, CTA |
| **Permukaan Hangat** | Orange 100 | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | 1.15:1 | Latar kartu refleksi hati, tag chip aktif, banner hangat |
| **Aksen Pertumbuhan** | Green 500 | `#8FAE5D` | `bg-green-500`, `text-green-500` | **3.3:1 (Large/Bold)**| Simbol pemulihan batin, checkmark selesai, tombol sekunder |
| **Permukaan Sejuk** | Green 100 | `#E4EED2` | `bg-green-100`, `text-green-100` | 1.12:1 | Latar kartu aktivitas fisik, latihan napas, nav item aktif |
| **Garis Kontak Kertas** | Border Subtle | `rgba(59, 42, 32, 0.10)` | `border-brown-900/10` | — | Border tipis organik pengganti shadow tebal |
| **Fokus Hangat** | Focus Ring | `rgba(242, 136, 75, 0.40)`| `ring-orange-500/40` | — | Aksesibilitas keyboard yang ramah di mata |
| **Aksi Destruktif** | Danger | `#D9534F` | `bg-danger`, `text-danger` | **4.6:1 (AA)** | **Khusus** hapus akun/post (dilarang untuk konten krisis) |

### Spektrum Emosi Resmi (Mood Canonical Tokens)
- `mood-depressed`: `#A99BE0` (Lavender teduh — duka & kelelahan emosional)
- `mood-sad`: `#EE8A5E` (Terracotta lembut — gundah & kecemasan)
- `mood-neutral`: `#6B5645` (Earthy brown — hening & datar)
- `mood-happy`: `#E8C24A` (Golden warm — tenang & nyaman)
- `mood-overjoyed`: `#8FAE5D` (Olive sage — vitalitas & semangat)

---

## 3. Typography & Editorial Hierarchy

- **Display & Judul Bab (`font-display`)**: `Manrope` (weights: 600, 700, 800)
  - Hero Sanctuary: `font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brown-900 tracking-tight leading-tight`
  - Section Title: `font-display text-xl sm:text-2xl font-bold text-brown-900 tracking-normal`
  - Card Heading: `font-display text-base sm:text-lg font-bold text-brown-900`
  - Subtitle: `font-display text-sm sm:text-base font-semibold text-brown-900`
  - Penekanan puitis: Kata kunci refleksi dapat diberi sentuhan italic halus (*"tarik napas sejenak"*).
- **Body & Antarmuka (`font-body`)**: `DM Sans` (weights: 400, 500, 700)
  - Paragraf: `font-body text-sm sm:text-base text-brown-700 leading-relaxed font-normal`
  - Kontrol & Tombol: `font-body text-xs sm:text-sm font-semibold tracking-wide`
  - Label Kategori & Tag: `font-body text-[11px] font-bold uppercase tracking-widest text-brown-700/80`
  - Micro / Meta: `font-body text-xs text-brown-700/70 font-medium`

---

## 4. Layout & Navigation Architecture

### A. Desktop & Tablet (≥ 768px): Floating Zen Dock (76px)
- **Dimensi & Posisi:** Lebar tetap 76px (`md:w-[76px] lg:w-[76px]`), mengapung di sisi kiri layar dengan margin 16px (`md:left-4`), sudut `rounded-[28px]`, latar `bg-white/90 backdrop-blur-md`, dan border tipis `border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]`.
- **Layout Spacing:** Halaman utama diberi padding kiri `md:pl-[108px]` (`16px margin + 76px dock + 16px visual breathing room`) sehingga konten tidak pernah tertumpuk atau terdorong secara keliru. Max-width kanvas konten: 1240px.
- **Icon Rhythm:** Alur navigasi menggunakan ikon Lucide garis halus 1.8px dengan hover state pill `hover:bg-cream/80 hover:text-brown-900` dan active state `bg-green-100 text-brown-900 font-bold`.
- **Portal Tooltip Architecture:**
  - Mengatasi masalah pemotongan tooltip (*tooltip clipping*) akibat kontainer sidebar `overflow-y-auto`.
  - Tooltip dipindahkan ke React Portal (`createPortal(..., document.body)`) dengan posisi dinamis `position: fixed`.
  - Koordinat dihitung langsung via `getBoundingClientRect()`: `top = rect.top + rect.height/2`, `left = rect.right + 12px`.
  - Auto-dismiss saat pointer leave, unmount, keyboard blur, maupun saat sidebar di-scroll (`onScroll`).
- **Profile Popover Anchor System:**
  - Terhubung langsung dengan tombol profil via `triggerRef` bounding rect: `left = rect.right + 12px`, `bottom = Math.max(16, window.innerHeight - rect.bottom)`.
  - Fallback statis responsif: `md:left-[104px] lg:left-[104px]`. Menggantikan nilai usang `272px` atau `88px`.
  - Menghormati layar pendek (`max-h-[calc(100dvh-2rem)]` dengan internal scroll teratur).

### B. Mobile (< 768px): Ergonomic Bottom Pill Nav & Centered Bottom Sheet
- **Navigasi Bawah:** Tinggi 56px, floating dengan jarak 12px dari tepi bawah, sudut `rounded-full`, touch target minimum $\ge 44\text{px}$, backdrop `bg-white/95 backdrop-blur-md border border-brown-900/10`.
- **Profile & Modals:** Di mobile, Profile Popover otomatis bertransformasi menjadi centered bottom sheet (`bottom-3 left-3 right-3 max-w-[420px] mx-auto rounded-3xl`) dengan backdrop gelap lembut `bg-brown-900/30`.

---

## 5. Elevation & Depth (Paper Depth System)

- **Ground Plane:** Kanvas dasar `bg-cream` (`#F7F2E7`) adalah alas hening.
- **Surface Elevation 1 (Cards):** `bg-white/90` berpadu `border border-brown-900/10` dan `shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]`.
- **Surface Elevation 2 (Floating Dock & Panels):** `bg-white/95 backdrop-blur-md` berpadu `border border-brown-900/10` dan `shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]`.
- **Surface Elevation 3 (Modals & Crisis Alerts):** `bg-white` berpadu `border border-brown-900/15` dan `shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)]`.

---

## 6. Shapes & Radius Scale (Anti-Slop Hierarchy)

| Komponen | Token Radius | Nilai Pixels | Karakteristik Visual |
|---|---|---|---|
| **Floating Zen Dock** | `rounded-[28px]` | 28px | Dermaga mengapung ramping yang selaras dengan margin layar |
| **Major Sanctuary Anchor** | `rounded-[24px]` | 24px | Kartu hero, banner assessment, kanvas refleksi utama |
| **Content Cards & Widgets** | `rounded-[20px]` | 20px | Kartu artikel, ringkasan skor, feed komunitas, rutinitas |
| **Sub-cards & Row Items** | `rounded-2xl` / `rounded-xl` | 16px / 12px | List item riwayat, detail rutinitas, tab selector |
| **Form Inputs & Search** | `rounded-xl` | 12px | Input teks, textarea curhat, selector filter |
| **Buttons, Badges & Pills** | `rounded-full` / `rounded-lg` | 9999px / 8px | Tombol komitmen primer, mood pebble, status chip |

---

## 7. Component Specifications

### A. Buttons
- **Primary Ink Button**: `bg-brown-900 text-cream hover:bg-brown-900/90 active:scale-[0.99] rounded-full px-5 py-2.5 font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2`
- **Warm Accent CTA Button**: `bg-orange-500 text-white hover:bg-orange-500/90 active:scale-[0.99] rounded-full px-5 py-2.5 font-semibold shadow-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2`
- **Secondary Vitality Button**: `bg-green-100 text-brown-900 hover:bg-green-100/80 rounded-full px-4 py-2 font-medium transition-colors duration-200 cursor-pointer`
- **Subtle Outline Button**: `border border-brown-900/15 text-brown-900 hover:bg-white/80 rounded-full px-4 py-2 font-medium transition-colors duration-200 cursor-pointer`

### B. Input Fields & Textarea
- **Form Input**: `h-11 px-4 rounded-xl bg-white/90 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70 transition-all text-sm`
- **Curhat Textarea**: `rounded-xl bg-white/90 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/50 p-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70 transition-all text-sm leading-relaxed max-h-[180px]`

### C. Mood Selector Pebbles
- **5 Pebbles Sentuh Empuk**: Tiap mood memiliki token border dan hover hangat:
  - Depressed (`#A99BE0`), Sad (`#EE8A5E`), Neutral (`#6B5645`), Happy (`#E8C24A`), Overjoyed (`#8FAE5D`).
  - Container pebble: `w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border-2`.

### D. Crisis Safety System
- Selalu siaga di atas chat Companion dan halaman panduan:
- Latar `bg-cream`, garis batas `border-brown-900/20`, ikon `HeartHandshake` Lucide garis halus, teks tenang ramah, dan tautan panggilan bebas pulsa langsung ke hotline Sejiwa 119 ext. 8.
- Dilarang keras menggunakan warna alarm agresif (merah teriak/bahaya) untuk konten krisis pengguna.

---

## 8. Index Spesifikasi Mockdocs Halaman (`design-system/zyba/pages/`)

Setiap halaman aplikasi ZYBA memiliki dokumen spesifikasi mockdoc mandiri yang komprehensif di folder `design-system/zyba/pages/`:

| Nama File Mockdoc | Halaman & Rute Resmi | Fokus Arsitektur & Interaksi |
|---|---|---|
| [`dashboard.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/dashboard.md) | **Dashboard** (`/dashboard`) | Sanctuary Overview, Hearth Flame, Asymmetric Golden Spread 65:35, Mindful Assessment ritual, Gentle Checklist |
| [`mood-check-in.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/mood-check-in.md) | **Mood Check-In** (`/daily-assessment` & `/mood-check-in`) | Single Focused Sanctuary Card, 5 Mood Pebbles, organic stepper, sleep/energy tags opsional, crisis gate |
| [`companion.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/companion.md) | **Tanya Zyba / Companion** (`/companion`, `/companion/[slug]`) | Private Reflection Pavilion, multiline textarea, native Speech-to-Text (`useSTT`), honest mic & attachment status |
| [`activity.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/activity.md) | **Smart Activity Planner** (`/activity`) | Gentle Daily Rhythm, Breathing Garden (4-7-8 timer), kartu kondisi harian, rekomendasi mikro tanpa tekanan |
| [`wellness-journey.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/wellness-journey.md) | **Ruang Sehat** (`/wellness-journey`) | Holistic Growth Canvas, Zyba Score & Stress curves, riwayat kebiasaan, catatan reflektif mingguan |
| [`community.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/community.md) | **Komunitas Zyba** (`/community`, `[slug]`, `profile`) | Warm Support Circles, feed berbagi empatik, interaksi peluk/dukung, moderasi santun, filter tag emosi |
| [`resources.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/resources.md) | **Wawasan & Edukasi** (`/resources`, `[slug]`) | Curated Sanctuary Library, artikel kertas terkurasi, audio guided relaxation player, bookmarking privat |
| [`onboarding-assessment.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/onboarding-assessment.md) | **Arrival & Assessment** (`/onboarding`, `/assessment`, `/welcome`) | 8-step Arrival Ritual, verifikasi email terenkripsi, kuisioner kesehatan holistik terpadu, tur sambutan |
| [`settings-billing.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/settings-billing.md) | **Pengaturan & Zyba+** (`/settings`, `/settings/zyba-plus`, `/billing`) | Sanctuary Settings, preferensi notifikasi, manajemen langganan jujur, audit keamanan sesi, export data |
| [`achievements.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/achievements.md) | **Pencapaian Hening** (`/achievements`) | Quiet Milestones, lencana Hearth reflektif, refleksi konsistensi tanpa FOMO kompetitif |
| [`landing.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/landing.md) | **Gerbang Publik** (`/`) | Editorial Warmth Hero, data pasar kredibel 74.9jt Gen Z, 4 pilar sanctuary card, ajakan hangat tanpa jargon |
| [`guidebook.md`](file:///e:/syauqi/zyba_/zyba_/design-system/zyba/pages/guidebook.md) | **Buku Panduan & Bantuan** (`/guidebook`) | Crisis Hotline Directory 24/7 (119 ext. 8), panduan pertolongan pertama emosional, etika sanctuary |

---

## 9. Do's and Don'ts (Anti-Slop & Design Hygiene Rules)

### Do's:
1. **Gunakan Ikon Lucide Garis Halus (1.8px stroke)** untuk semua status, kontrol tombol, dan navigasi.
2. **Gunakan Palet Terkunci `PALETTE_LOCK.md`**: Canvas Cream (`#F7F2E7`), Ink Brown 900 (`#3B2A20`), Warm Orange (`#F2884B`), Vital Green (`#8FAE5D`).
3. **Terapkan Asymmetric Golden Spread (65:35)**: Berikan ruang refleksi lapang bagi mata dan batin pengguna.
4. **Terapkan Anti-Slop Radius Scale**: Radius berjenjang (28px Zen Dock, 24px Anchor, 20px/16px Widgets, 12px Inputs, 9999px Pills).
5. **Gunakan Teks Hangat & Empatik**: Gunakan bahasa Indonesia santun yang menentramkan jiwa ("Mulai saat kamu siap", "Ruang jeda sejenak").
6. **Sediakan Aksesibilitas Penuh**: Focus ring `ring-orange-500/40`, target sentuh minimum $\ge 44\text{px}$, dan `motion-reduce:transition-none`.

### Don'ts (Anti-Slop Zero Tolerance):
1. ❌ **Dilarang Emoji sebagai Ikon:** Jangan pernah menggunakan emoji sebagai ikon navigasi, header status, atau tombol filter.
2. ❌ **Dilarang Gradient Ungu-Biru AI:** Jangan gunakan gradient ungu-biru, cyan glow, atau radial orb kabur di belakang hero.
3. ❌ **Dilarang Nested Cards (Card Inception):** Jangan menaruh kartu putih di dalam kartu abu-abu di dalam kartu lain tanpa fungsi yang jelas.
4. ❌ **Dilarang Icon-in-a-box Syndrome:** Jangan menaruh kotak rounded warna-warni di atas setiap heading atau item list.
5. ❌ **Dilarang Gamifikasi Menekan & Api Merah:** Ganti streak api merah agresif dengan Hearth Flame SVG nyala lilin konsistensi harian yang tenang.
6. ❌ **Dilarang Statistik Karangan & Copy Hype:** Dilarang menggunakan klaim sensasional atau angka palsu.
7. ❌ **Dilarang Warna Alarm Merah untuk Krisis:** Konten krisis pengguna wajib menggunakan palet netral tenang dengan tombol bantuan darurat jelas.

---

## 10. Superpowers Verification & Testing Contract

Setiap komponen dan halaman yang dibangun wajib diverifikasi dengan kontrak berikut:
1. **Linter & Type Check:** `npm run build` atau `npx tsc --noEmit` wajib lulus tanpa error tipe.
2. **Contrast Audit:** Seluruh teks utama dan sekunder wajib memenuhi rasio kontras WCAG AA $\ge 4.5:1$ terhadap latar belakangnya.
3. **Responsive Verification:** Teruji pada 3 viewport kunci: Mobile 375px (Bottom Pill), Tablet 768px (Zen Dock), Desktop 1280px (Zen Dock + 12-col grid).
4. **Keyboard & Focus Navigation:** Tombol dan input dapat ditelusuri via tombol `Tab` dengan highlight focus ring yang jelas.
5. **Motion Reduction:** Mengaktifkan preferensi sistem `prefers-reduced-motion` menonaktifkan seluruh animasi dan transisi secara instan.
