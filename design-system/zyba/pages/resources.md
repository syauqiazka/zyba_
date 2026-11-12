# Sanctuary Resources (Curated Library & Audio Player) — Redesign v2

> **Canonical Route:** `/resources`, `/resources/[slug]`  
> **Source Components:** `src/app/resources/page.tsx`, `src/app/resources/[slug]/page.tsx`, `src/components/resources/*`

---

## Perubahan dari v1

1. **DIBUANG:** Pola *icon-in-a-box syndrome* di mana ikon dimasukkan ke dalam kotak rounded warna-warni sembarangan di atas judul kartu.
2. **DIBUANG:** Ikon ungu, biru, dan kuning pastel yang melanggar identitas brand ZYBA.
3. **DIBUANG:** Ikon tanda kutip yang membingungkan untuk kategori wawasan artikel. Digantikan ikon Lucide `BookOpen` dan `Headphones` yang representatif.
4. **BARU:** Kartu sumber daya dengan thumbnail bertekstur kertas halus (*paper tactile preview*), judul Manrope tebal, dan meta waktu baca/dengar yang jelas.
5. **BARU:** Pemutar audio tersemat (*embedded audio player*) untuk audio relaksasi meditasi dan latihan mindfulness terpandu.
6. **BARU:** Penanda eksklusif konten Zyba Plus yang elegan (*Quiet Pro Badge*) dengan penjelasan kurasi premium.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Membaca panduan kesehatan mental berbasis sains yang mudah dipahami, mendengarkan audio relaksasi mindfulness, dan menyimpan materi favorit.
- **Fitur yang Dipertahankan:**
  - Katalog wawasan dengan filter tab: Semua, Artikel, Audio
  - Halaman detail bacaan artikel penuh (`/resources/[slug]`)
  - Pemutar audio meditasi (Play, Pause, Progress Seek, Volume)
  - Penanda konten eksklusif Zyba Plus & paywall upsell

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Header Kategori : Grid Multi-Kolom 3 Kolom)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1280px                       |
|                 |                                                                 |
|                 | +-------------------------------------------------------------+ |
|                 | | HEADER: PERPUSTAKAAN KETENANGAN & PANDUAN                   | |
|                 | | - Filter Tabs: [Semua] [Artikel] [Audio Relaksasi]          | |
|                 | | - Search input perpustakaan...                              | |
|                 | +-------------------------------------------------------------+ |
|                 |                                                                 |
|                 | Grid Kartu 3-Kolom:                                             |
|                 | +-------------------+ +-------------------+ +-----------------+ |
|                 | | KARTU ARTIKEL     | | KARTU AUDIO       | | KARTU ZYBA PLUS | |
|                 | | - Paper Thumbnail | | - Paper Thumbnail | | - Gold Accent   | |
|                 | | - "Meredakan Over-| | - "Suara Hujan &  | | - "Masterclass  | |
|                 | |    thinking"      | |    Napas Dalam"   | |    Tidur Nyenyak"|
|                 | | - 5 mnt baca      | | - 12 mnt audio    | | - Khusus Plus   | |
|                 | +-------------------+ +-------------------+ +-----------------+ |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Filter tabs dapat digulir horizontal.
- Grid beralih ke 1 kolom tumpuk rapi dengan thumbnail rasio 16:9 yang nyaman di layar sentuh.

---

## Komponen & token yang dipakai

- **Kartu Sumber Daya:** `bg-white/90 rounded-[20px] border border-brown-900/10 p-5 hover:border-orange-500/40 hover:-translate-y-1 transition-all shadow-xs flex flex-col justify-between`.
- **Thumbnail Kertas:** `w-full h-44 rounded-xl bg-cream border border-brown-900/5 relative overflow-hidden flex items-center justify-center text-brown-900`.
- **Tab Filter:** `rounded-full px-5 py-2 text-xs font-bold transition-all data-[active=true]:bg-brown-900 data-[active=true]:text-white data-[active=false]:bg-white data-[active=false]:text-brown-700`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Seluruh kartu artikel dan audio termuat rapi sesuai filter aktif.
2. **Loading:** Skeleton kartu bergrid 3-kolom.
3. **Empty:** Pesan ramah *"Belum ada materi untuk filter ini. Coba pilih kategori lain"*.
4. **Error:** Pesan *"Gagal memuat perpustakaan wawasan"* + tombol muat ulang.
5. **Crisis Detected:** Banner krisis Sejiwa 119 tetap disematkan di bagian atas direktori panduan.
6. **Locked (Plus Card):** Kartu berlabel PRO menampilkan cuplikan 2 paragraf sebelum menyajikan ajakan langganan Zyba Plus.

---

## Interaksi & motion

- **Pemutar Audio:** Bilah progres audio berjalan mulus dengan animasi scrub bar interaktif.
- **Hover Thumbnail:** Gambar thumbnail kertas sedikit membesar secara halus (`scale-102`) saat di-hover.
- **Reduced Motion:** Semua efek pembesaran dinonaktifkan di bawah `prefers-reduced-motion: reduce`.

---

## Aksesibilitas

- Seluruh tautan kartu artikel memiliki teks jangkar yang deskriptif untuk screen reader.
- Tombol pemutar audio memiliki kontrol `aria-label` ("Putar audio 12 menit", "Jeda audio").

---

## Kriteria penerimaan

- [x] Tidak ada ikon yang dibungkus kotak rounded warna-warni acak di atas heading.
- [x] Tab filter kategori berfungsi untuk menyaring artikel vs audio.
- [x] Audio player dapat memutar audio tanpa error runtime.
- [x] Halaman detail artikel `/resources/[slug]` merender isi teks editorial dengan benar.

---

## Referensi yang dipakai

- **Ref 16 (Healora) & Ref 13 (MindBridge):** Desain perpustakaan editorial bertema kertas dengan tipografi konten panjang yang nyaman dibaca.
