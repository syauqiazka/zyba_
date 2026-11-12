# Dashboard (Sanctuary Overview) — Redesign v2

> **Canonical Route:** `/dashboard`  
> **Source Components:** `src/app/dashboard/page.tsx`, `src/app/dashboard/components/*`

---

## Perubahan dari v1

1. **DIBUANG:** Kontainer hero hijau pekat `#344638` yang gelap dan berat. Digantikan oleh kanvas kertas taktil terang lapang berlatar `bg-white/90` dengan border kontak halus `border-brown-900/10`.
2. **DIBUANG:** Ilustrasi batu mineral 3D buatan (*Tactile Pebble SVGs*). Digantikan ringkasan data nyata 2 kolom datar tanpa kartu bersarang (*anti-card inception*).
3. **DIBUANG:** Angka target rekaan seperti `/30` hari atau `/10` sesi, serta persentase progres yang tidak berdasar data backend.
4. **DIBUANG:** Ikon *Sparkles* dekoratif di kutipan sambutan dan badge emosional.
5. **DIBUANG:** Duplikasi kartu pendamping (*Specialist Card*) dan banner *Mood Check-in* bawah di panel kanan.
6. **BARU:** Hierarki konten terfokus: Sapaan personal hangat → Ringkasan 2 angka datar (Kehadiran & Sesi Tersimpan) → Daftar baris datar "Langkah kecil hari ini" → Widget Companion interaktif → Grafik stres mingguan.
7. **BARU:** Relokasi `PremiumStatusWidget` ke bagian bawah konten utama, memastikan sapaan dan kesehatan mental menjadi pusat perhatian pertama.
8. **BARU:** Sinkronisasi terpusat antara database `ActivityLog` dan `localStorage`, mencegah perbedaan status checklist harian.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Memulai hari dengan ikhtisar batin yang tenang tanpa rasa dihakimi, mengecek ritme mood, mengakses pendamping curhat kilat, dan menandai rutinitas mikro tanpa tekanan angka target.
- **Fitur yang Dipertahankan:**
  - Sapaan personal adaptif waktu (Pagi/Siang/Sore/Malam) + nama user
  - Zyba Score Ring kalkulasi riil dari asesmen harian
  - Metrik kehadiran (streak konsistensi hari) & jumlah percakapan
  - Kotak Tenang Grounding 5-4-3-2-1 (`zyba_open_grounding` event trigger)
  - Rutinitas hari ini (toggle tracker terhubung ke API `/api/activity`)
  - Widget Zyba Companion + shortcut chat (`/companion?initialMsg=`)
  - Manajemen avatar (upload, crop melingkar, cooldown ganti foto)
  - Status langganan Free/Plus & riwayat invoice Midtrans

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Asymmetric Grid 8 : 4)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1280px                       |
|                 |                                                                 |
| (Logo)          | +------------------------------------+  +---------------------+ |
| [Dash]*         | | HERO CARD (bg-white/90, r-24)      |  | RIGHT RAIL (r-24)   | |
| [Mood]          | | - Date & Weather Badge             |  | - Kotak Tenang 54321| |
| [Chat]          | | - Avatar + Greeting ("Selamat...") |  | - Rutinitas Hari Ini| |
| [Plan]          | | - Metrik Kehadiran & Percakapan    |  |   (Checklist row)   | |
| [Track]         | | - Langkah Kecil Hari Ini (List)    |  +---------------------+ |
| [Comm]          | +------------------------------------+  +---------------------+ |
| [Book]          | +------------------------------------+  | ZYBA SCORE CARD     | |
|                 | | ZYBA COMPANION WIDGET (r-20)       |  | - Circular Ring     | |
|                 | | - Quick Chat Input Form            |  | - Kondisi ("Baik")  | |
|                 | +------------------------------------+  +---------------------+ |
|                 | +------------------------------------+  +---------------------+ |
|                 | | STRESS & MOOD WAVEFORM (r-20)      |  | DIREKTORI BANTUAN   | |
|                 | | - Grafik 7 Hari Terakhir           |  | - Sejiwa 119        | |
|                 | +------------------------------------+  +---------------------+ |
|                 | +-------------------------------------------------------------+ |
|                 | | STATUS PLUS & RIWAYAT PEMBAYARAN (r-24)                     | |
|                 | +-------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Tablet 768px
- Floating Zen Dock (76px) di kiri dengan layout padding `pl-[96px]`.
- Kolom kiri dan kanan tersusun bertumpuk secara elegan dengan `gap-6`.

### Mobile 375px
- Zen Dock beralih ke Ergonomic Bottom Pill Nav (56px) melayang di bawah layar.
- Grid 1-kolom penuh, padding horizontal `px-4 pt-4 pb-24`.
- Urutan: Hero Card -> Kotak Tenang -> Zyba Companion -> Rutinitas Hari Ini -> Skor Kesejahteraan -> Grafik Stres -> Status Plus.

---

## Komponen & token yang dipakai

- **Warna & Latar:** `bg-cream` (kanvas utama), `bg-white/90` (kartu utama), `border-brown-900/10` (garis kontak kertas).
- **Tipografi:** `font-display` (Manrope) untuk display sapaan (`text-2xl sm:text-4xl font-extrabold text-brown-900`), `font-body` (DM Sans) untuk deskripsi empatik (`text-sm text-brown-700`).
- **Skala Radius:** Kartu Hero `rounded-[24px]`, Widget `rounded-[20px]`, Kontrol & input `rounded-xl`, Tombol aksi `rounded-full`.
- **Badges:** `bg-green-100 text-brown-900 border-green-500/30` (stabil/sehat), `bg-orange-100 text-brown-900 border-orange-500/30` (kehadiran/perhatian).

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Data terisi lengkap: sapaan aktif, skor tampil di ring, streak konsistensi valid, checklist rutinitas tersinkronisasi.
2. **Loading:** Skeleton berdenyut halus `animate-pulse duration-2000` pada kanvas `bg-cream` menjaga stabilitas tanpa layout-shift.
3. **Empty (Akun Baru):** Sapaan awal *"Selamat datang di tempat perlindunganmu"*, Skor menampilkan "— dari 100", ajakan lembut *"Mulai Check-In Pertama"* tanpa menyalahkan user.
4. **Error:** Pesan pemulihan kontekstual *"Ruang tenang sedang jeda sejenak"* + tombol *"Segarkan Halaman"*.
5. **Crisis Detected:** Banner hotline darurat Sejiwa 119 ext. 8 muncul di posisi atas dashboard tanpa tombol auto-dismiss.
6. **Locked (Plus):** Pengguna Free melihat status plan "FREE", riwayat kosong rapi, dan tombol upgrade lembut tanpa mengganggu fungsionalitas utama.

---

## Interaksi & motion

- **Hover Kartu:** `hover:border-brown-900/20` dan elevasi halus `hover:-translate-y-0.5` dengan transisi 200ms.
- **Checklist Toggle:** Animasi centang circular dengan feedback visual instan pada state tracker harian.
- **Avatar Trigger:** Klik avatar memicu event `zyba_open_profile` untuk membuka popover, hover memunculkan ikon kamera untuk crop modal.
- **Reduced Motion:** Semua efek hover dan transisi dinonaktifkan di bawah `prefers-reduced-motion: reduce`.

---

## Aksesibilitas

- Kontras rasio teks utama `text-brown-900` pada `bg-cream` adalah **11.2:1** (WCAG AAA).
- Label aksesibel pada seluruh tombol tanpa teks (`aria-label="Ubah foto profil"`, `aria-label="Navigasi"`, dsb.).
- Focus state jelas dengan `focus-visible:ring-2 focus-visible:ring-orange-500`.
- Target sentuh mobile minimal 44x44px untuk seluruh tombol aksi dan toggle rutinitas.

---

## Kriteria penerimaan

- [x] Tidak ada kontainer hero hijau pekat `#344638` atau border `#445B4A`.
- [x] Tidak ada kartu di dalam kartu (*zero card inception*).
- [x] Tidak ada angka karangan ("/30", "20/20", persentase palsu).
- [x] Seluruh ikon menggunakan Lucide SVG garis halus tanpa ikon bintang/sparkle dekoratif.
- [x] `PremiumStatusWidget` berada di bagian bawah konten, bukan di atas sapaan.
- [x] Build dan type-check bebas dari error.

---

## Referensi yang dipakai

- **Ref 1 (Solune) & Ref 3 (Pixelean):** Hierarki kartu utama terang, tipografi display tebal namun bernapas, ringkasan metrik datar horizontal.
- **Ref 14 (Shuvo):** Komposisi editorial golden ratio asimetris 65:35 antara hero canvas dan right rail.
