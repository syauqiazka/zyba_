# Wellness Journey (Ruang Sehat & Holistic Growth Canvas) — Redesign v2

> **Canonical Route:** `/wellness-journey`  
> **Source Components:** `src/app/wellness-journey/page.tsx`, `src/app/wellness-journey/components/*`

---

## Perubahan dari v1

1. **DIBUANG:** Visual grafik gelap dan warna-warna neon di luar identitas (`#1b3c53`, `#456882`, violet/cyan gradients).
2. **DIBUANG:** Tumpukan kartu bersarang (*card inception*) di bagian wawasan mingguan dan rekomendasi kebiasaan.
3. **DIBUANG:** Klaim statistik karangan atau persentase pemulihan yang tidak berbasis log asesmen riil.
4. **DIBUANG:** Pemicu kecemasan berbasis perbandingan performa antar-minggu yang menghakimi.
5. **BARU:** Visualisasi grafik garis tren emosional berbasis warna kanonikal (`green-500` dan `orange-500`) di atas kanvas kertas putih gading `bg-white/90`.
6. **BARU:** Mesin Wawasan AI (*Insights Engine*) yang membaca korelasi nyata antara kualitas tidur, tingkat stres, dan frekuensi check-in (`/api/wellness/insights`).
7. **BARU:** Gerbang pratinjau elegan untuk analisis mendalam Zyba Plus (`/settings/zyba-plus/insights`) dengan penjelasan manfaat yang transparan.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Memahami perjalanan emosional diri secara retrospektif, melihat korelasi antara pola istirahat dan suasana hati, serta menerima rekomendasi kebiasaan mikro yang dipersonalisasi.
- **Fitur yang Dipertahankan:**
  - Tren holistik 7 hari hingga 30 hari terakhir
  - Wawasan mingguan berbasis data riil asesmen
  - Deteksi pola otomatis (misal: "Stres cenderung meningkat saat tidur < 6 jam")
  - Rekomendasi kebiasaan mikro
  - Paywall gate Zyba Plus untuk modul analisis mendalam

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Asymmetric Grid 8 : 4)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1280px                       |
|                 |                                                                 |
|                 | +-----------------------------------+  +----------------------+ |
|                 | | TREN PERTUMBUHAN HOLISTIK (r-24)  |  | RANGKUMAN REFLEKSI   | |
|                 | | - Tab: 7 Hari / 30 Hari           |  | (bg-white/90, r-24)  | |
|                 | | - Grafik Garis Mood & Stres       |  | - Rata-rata Mood     | |
|                 | | - Titik Data Riil Asesmen         |  | - Dominasi Emosi     | |
|                 | +-----------------------------------+  +----------------------+ |
|                 | +-----------------------------------+  +----------------------+ |
|                 | | WASAWAN POLA MINGGUAN (r-24)      |  | GERBANG ZYBA PLUS    | |
|                 | | - 3 Pola Terdeteksi:              |  | - Pratinjau Analisis | |
|                 | |   * Ritme Istirahat & Pikiran     |  |   Mendalam 7 Hari    | |
|                 | |   * Waktu Jeda Terbaik            |  | - Tombol Buka Plus   | |
|                 | +-----------------------------------+  +----------------------+ |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Grafik tren dapat digulir horizontal dengan aman tanpa memotong angka sumbu.
- Kartu wawasan dan gerbang Plus tersusun rapi di bawah grafik.

---

## Komponen & token yang dipakai

- **Grafik Garis:** Garis kurva halus menggunakan stroke `text-green-500` untuk mood dan `text-orange-500` untuk stres, dengan titik kontak `fill-white stroke-brown-900`.
- **Wadah Analisis:** `bg-white/90 border border-brown-900/10 rounded-[24px] p-6 sm:p-8 shadow-xs`.
- **Badge Korelasi:** `bg-green-100 text-green-900 text-xs font-bold px-3 py-1 rounded-full`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Grafik menampilkan garis tren dari data check-in aktual, 3 kartu wawasan terisi.
2. **Loading:** Skeleton shimmer halus berbentuk grafik dan baris teks.
3. **Empty (< 3 Data Check-In):** Tampilan edukatif *"Kumpulkan minimal 3 check-in untuk mulai melihat pola perjalanan batinmu"*.
4. **Error:** Pesan pemulihan *"Gagal memuat tren kesehatan"* + tombol segarkan.
5. **Crisis Detected:** Riwayat yang menandakan tren risiko tinggi menyajikan rekomendasi konsultasi profesional dan nomor Sejiwa 119.
6. **Locked (Plus Gate):** Pratinjau terkunci menampilkan judul wawasan dengan latar bergradasi lembut dan tombol *"Buka Analisis Mendalam dengan Zyba Plus"*.

---

## Interaksi & motion

- **Tooltip Titik Data:** Saat kursor berada di atas titik tanggal grafik, tooltip portal memunculkan rincian mood dan catatan singkat tanggal tersebut.
- **Tab Rentang Waktu:** Transisi crossfade halus 200ms saat berpindah antara 7 hari dan 30 hari.
- **Reduced Motion:** Mengganti animasi gambar kurva grafik dengan penggambaran langsung tanpa lereng transisi.

---

## Aksesibilitas

- Titik grafik dapat difokuskan menggunakan Tab dan dibaca oleh pembaca layar ("Tanggal 12 November: Suasana hati Bahagia, Stres Rendah").
- Tabel data teks alternatif disediakan secara sembunyi untuk pengguna screen reader (`sr-only table`).

---

## Kriteria penerimaan

- [x] Tidak ada warna biru/violet asing pada grafik tren.
- [x] Analisis mendalam terhubung ke endpoint `/api/wellness/insights`.
- [x] Empty state muncul jujur saat data check-in kurang dari ambang batas.
- [x] Tombol gerbang Plus mengarahkan ke alur checkout `/settings/zyba-plus`.

---

## Referensi yang dipakai

- **Ref 5 (Wellora) & Ref 7 (Aura):** Visualisasi tren suasana hati dan pemulihan tubuh yang terstruktur bersih dan lapang tanpa ornamen menekan.
