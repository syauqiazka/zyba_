# ZYBA Design Authority (design.md) — The Tactile Sanctuary

<!-- impeccable:design-schema 1 -->

> **Otoritas Desain Gabungan**: Master Design System (UI/UX Pro Max) + Taste Art Direction + Impeccable Product Context.  
> **COLOR PALETTE TERKUNCI MUTLAK**: Bagian warna pada dokumen ini 100% identik dengan `design-system/PALETTE_LOCK.md`. Dilarang mengubah nilai hex.

---

## 1. Direction (Arah Visual)

### Ide Visual Tunggal (1 Kalimat):
> *"Sanctuary of Tactile Warmth: Tempat perlindungan emosional hening yang hadir layaknya lembaran jurnal fisik berbahan kertas linen alami, dirancang dengan komposisi lapang yang memuliakan ketenangan batin."*

ZYBA adalah antitesis dari dua kutub antarmuka yang salah kaprah dalam aplikasi kesehatan mental:
1. **Bukan SaaS Analitik Korporat**: Tidak ada dashboard kaku penuh grafik metrik yang rumit, tidak ada sidebar 260px yang memotong ruang, dan tidak ada hierarki nested-cards yang menyesakkan.
2. **Bukan Mainan Kartun Anak-Anak**: Tidak ada emoji yang dijadikan ikon tombol, tidak ada animasi loncat agresif (*bounce/ping*), dan tidak ada gamifikasi kompetitif yang menimbulkan rasa bersalah jika pengguna absen.

### Karakteristik Seni Visual:
- **Kertas Linen & Tinta Tanah**: Kanvas Cream (`#F7F2E7`) sebagai 75% permukaan visual, teks Brown 900 (`#3B2A20`) yang pekat dan berwibawa layaknya tinta cetak di atas kertas berkualitas tinggi.
- **Asymmetric Golden Spread**: Tata letak asimetris (65% zona reflektif utama : 35% zona aksi tenang), menyisakan ruang napas (*whitespace*) lapang yang disengaja.
- **Tactile Material Depth**: Menolak bayangan hitam buram tebal ala template AI. Menggunakan garis kontak kertas tipis 1px (`border-brown-900/10`) dipadu bayangan kontak lembut (`shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]`).
- **Hierarki Radius Proporsional (Anti-Slop Radius)**: Dilarang menyeragamkan `rounded-[32px]` pada seluruh kartu. Menerapkan skala radius berjenjang:
  - *Floating Zen Dock / Shell Container*: `rounded-[28px]`
  - *Major Sanctuary Anchor Cards (Hero/Banner)*: `rounded-[24px]`
  - *Content Cards & Widgets*: `rounded-[20px]`
  - *Sub-cards, Row Items & Form Inputs*: `rounded-2xl` (16px) hingga `rounded-xl` (12px)
  - *Pills, Badges & Action Buttons*: `rounded-full`
- **Ritme Pernapasan (*Breathing Rhythm*)**: Micro-interaction halus dan transisi tenang (300ms–500ms `cubic-bezier(0.16, 1, 0.3, 1)`), selalu mematuhi `motion-reduce:transition-none`.

---

## 2. Locked Color Palette (PALETTE_LOCK.md — Diff 0%)

| Token Semantik | Token Nama | Canonical Hex | Kelas Tailwind | Peruntukan Resmi dalam The Tactile Sanctuary |
|---|---|---|---|---|
| **Kanvas Utama** | Cream | `#F7F2E7` | `bg-cream`, `text-cream` | Kanvas dasar seluruh halaman (75% ruang) |
| **Material Kartu** | Milk White | `#FFFFFF` | `bg-white/90` | Surface kartu utama bertekstur kertas halus |
| **Tinta / Teks Utama** | Brown 900 | `#3B2A20` | `text-brown-900`, `bg-brown-900` | Headings utama, tombol komitmen primer, border solid |
| **Tinta Sekunder / Label**| Brown 700 | `#5A4636` | `text-brown-700`, `bg-brown-700` | Body copy, microcopy, label waktu |
| **Aksen Kehangatan / CTA**| Orange 500 | `#F2884B` | `bg-orange-500`, `text-orange-500` | Tombol aksi primer, highlight emosional penting |
| **Permukaan Hangat** | Orange 100 | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | Latar kartu refleksi hati, tag chip aktif |
| **Aksen Pertumbuhan** | Green 500 | `#8FAE5D` | `bg-green-500`, `text-green-500` | Simbol pemulihan, checkmark selesai, tombol sekunder |
| **Permukaan Sejuk** | Green 100 | `#E4EED2` | `bg-green-100`, `text-green-100` | Latar kartu aktivitas fisik & pernapasan |
| **Garis Kontak Kertas** | Border Subtle | `rgba(59, 42, 32, 0.10)` | `border-brown-900/10` | Border tipis organik pengganti shadow tebal |
| **Fokus Hangat** | Focus Ring | `rgba(242, 136, 75, 0.40)`| `ring-orange-500/40` | Aksesibilitas keyboard yang ramah di mata |
| **Aksi Destruktif** | Danger | `#D9534F` | `bg-danger`, `text-danger` | **Khusus** hapus akun/post (dilarang untuk krisis) |

### Spektrum Emosi Resmi (Mood Canonical Tokens)
- `mood-depressed`: `#A99BE0` (Lavender teduh — duka & kelelahan emosional)
- `mood-sad`: `#EE8A5E` (Terracotta lembut — gundah & kecemasan)
- `mood-neutral`: `#6B5645` (Earthy brown — hening & datar)
- `mood-happy`: `#E8C24A` (Golden warm — tenang & nyaman)
- `mood-overjoyed`: `#8FAE5D` (Olive sage — vitalitas & semangat)

---

## 3. Tipografi & Hirarki Berkarakter

- **Display & Judul Bab (`font-display`)**: `Manrope`
  - Hero Sanctuary: `font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brown-900 tracking-tight`
  - Section Title: `font-display text-xl sm:text-2xl font-bold text-brown-900`
  - Card Heading: `font-display text-base sm:text-lg font-bold text-brown-900`
  - Penekanan puitis: Kata kunci refleksi dapat diberi sentuhan italic halus (*"tarik napas sejenak"*).
- **Body & Antarmuka (`font-body`)**: `DM Sans`
  - Paragraf: `font-body text-sm sm:text-base text-brown-700 leading-relaxed font-normal`
  - Kontrol & Tombol: `font-body text-xs sm:text-sm font-semibold tracking-wide`
  - Label Kategori: `font-body text-[11px] font-bold uppercase tracking-widest text-brown-700/80`

---

## 4. Pola Navigasi Baru: Floating Zen Dock

Menggantikan `Sidebar.tsx` lama 260px yang kaku.
- **Desktop (≥ 768px):** **Floating Zen Dock** (lebar 76px mengapung dengan margin 16px–20px, sudut `rounded-[28px]`, latar `bg-white/90 backdrop-blur-md`, border `border-brown-900/10`).
  - Menghilangkan kesan ruang dashboard terbelah dua.
  - Alur menu utama ditampilkan dalam ikon Lucide garis halus 1.8px dengan hover label mengambang (*floating pill tooltip* ke arah kanan).
- **Mobile (< 768px):** **Ergonomic Bottom Pill Nav** (tinggi 56px, sudut `rounded-full`, floating dengan jarak 12px dari tepi bawah layar, touch target $\ge 44\text{px}$). Sliding drawer tersedia jika dibuka via tombol menu header untuk navigasi berlabel penuh.

---

## 5. Tata Letak Halaman Kunci (Composition Guide)

### A. Dashboard (`/dashboard`)
1. **Sanctuary Greeting**: Salam personal harian + Indikator konsistensi hadir berupa nyala bara hening (**Hearth Flame** SVG), bukan streak api merah yang menekan.
2. **Asymmetric Main Spread**:
   - **Kiri (65%)**: Kartu besar **Mindful Assessment Ritual** (ajakan check-in hari ini atau rangkuman cuaca emosional bergelombang tenang) + **Private Sanctuary Chat Entry** (pintu masuk cepat curhat ke Tanya Zyba).
   - **Kanan (35%)**: **Gentle Routine Checklist** (2–3 rutinitas mikro tanpa target intimidatif) + **Warm Community Echo** (satu kutipan hening anonim dari komunitas).

### B. Mood Check-In (`/daily-assessment`)
1. **Single Focused Sanctuary Card**: Satu kartu terpusat di tengah kanvas Cream, menghilangkan distraksi visual sekeliling.
2. **Pebble Mood Selector**: 5 tombol sentuh empuk berbentuk batu pipih (*pebbles*) dengan kurva `rounded-2xl` dan border warna mood canonical.
3. **Organic Stepper**: Titik lentur yang bernapas menggantikan bar angka tes klinis.

### C. Tanya Zyba (`/companion`)
1. **Private Reflection Pavilion**: Gelembung percakapan lapang berlatar `bg-white/90` dan `bg-cream`, tipografi berjarak nyaman.
2. **Crisis Safety Banner**: Selalu siaga di bagian atas chat dengan latar `bg-cream`, garis batas `border-brown-900/20`, ikon `HeartHandshake`, dan akses telepon langsung bebas pulsa ke hotline Sejiwa 119 ext. 8.

---

## 6. Anti-Slop & Design Hygiene Rules

1. **Dilarang Keras Emoji sebagai Ikon:** Semua ikon navigasi, status, dan tombol wajib menggunakan Lucide SVG garis halus.
2. **Dilarang Gradient Ungu-Biru:** Semua elemen visual wajib berakar dari palet Cream, Brown, Orange, Green, dan spektrum mood Figma.
3. **Dilarang Kartu Bersarang (Nested Cards):** Tidak boleh ada kartu putih di dalam kartu abu-abu di dalam kartu lain tanpa alasan fungsi yang jelas.
4. **Dilarang Ikon dalam Kotak Rounded (Icon-in-a-box syndrome):** Jangan menaruh kotak rounded dengan background warna-warni di atas setiap judul heading.
5. **Dilarang Statistik Karangan & Copy Hype:** Semua microcopy harus jujur, hangat, santun, dan menentramkan jiwa.
6. **Wajib Menghormati Reduced Motion:** Seluruh transisi wajib dilengkapi `motion-reduce:transition-none` dan `motion-reduce:animate-none`.
