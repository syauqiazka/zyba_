# Mood Check-In & Asesmen Harian — Redesign v2

> **Canonical Route:** `/mood-check-in` (Rute `/daily-assessment` otomatis redirect 307 ke sini)  
> **Source Components:** `src/app/mood-check-in/page.tsx`, `src/app/mood-check-in/components/*`

---

## Perubahan dari v1

1. **DIBUANG:** Duplikasi terpisah antara `daily-assessment` dan `mood-check-in`. Keduanya digabung menjadi **satu alur check-in harian terpadu** (kualitas tidur, level energi, pemilih mood, refleksi jurnal).
2. **DIBUANG:** Kotak selector mood putih datar kaku dengan border tebal. Digantikan oleh **5 MoodPebble** sentuh organik bertekstur empuk sesuai 5 token warna kanonikal.
3. **DIBUANG:** Warna ungu/biru/violet bawaan generator (`#8B5CF6`, `#1b3c53`) pada selector dan slider domain.
4. **DIBUANG:** Tumpukan kartu bersarang (*card inception*) di riwayat asesmen dan kalender bulanan.
5. **BARU:** Stepper horizontal minimalis dan tenang tanpa angka batas yang memicu stres.
6. **BARU:** Tampilan kalender riwayat mood bulanan yang bersih dengan indikator warna mood lembut.
7. **BARU:** Deteksi risiko krisis instan (`detectRisk`) yang memunculkan banner Sejiwa 119 ext. 8 secara tenang tanpa warna merah bahaya yang menakutkan pengguna.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Mengamati perasaan tanpa menghakimi, mendokumentasikan kualitas tidur dan tingkat stres harian, menulis catatan refleksi emosional secara privat, dan meninjau kembali pola suasana hati masa lalu.
- **Fitur yang Dipertahankan:**
  - Pemilih 5 skala mood kanonikal: Depressed, Sad, Neutral, Happy, Overjoyed
  - Slider kualitas tidur (1–5) & slider tingkat stres (1–5)
  - Tag pilihan energi fisik dan batin
  - Kolom refleksi jurnal bebas dengan deteksi kata krisis
  - Kalender bulanan dan riwayat asesmen sebelumnya (`/api/daily-assessment`, `/api/journal`)

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Komposisi 7 : 5)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1280px                       |
|                 |                                                                 |
|                 | +-----------------------------------+  +----------------------+ |
|                 | | ASESMEN HARI INI (bg-white/90)    |  | KALENDER BULANAN     | |
|                 | | - Stepper Santun                  |  | (bg-white/90, r-24)  | |
|                 | | - 5 MoodPebble Sentuh Empuk       |  | - Grid Tanggal Mood  | |
|                 | | - Slider Kualitas Tidur & Stres   |  | - Statistik Rangkuman| |
|                 | | - Tag Energi & Kebugaran          |  +----------------------+ |
|                 | | - Catatan Refleksi Jurnal         |  +----------------------+ |
|                 | | - Tombol "Simpan Check-In"        |  | RIWAYAT JURNAL LALU  | |
|                 | +-----------------------------------+  | - Daftar Baris Datar | |
|                 |                                        | - Filter Tanggal     | |
|                 |                                        +----------------------+ |
+-----------------------------------------------------------------------------------+
```

### Tablet 768px & Mobile 375px
- Form asesmen di atas, kalender dan riwayat tersusun di bawah secara vertikal dengan jarak `gap-6`.
- Pada mobile (375px), 5 MoodPebble tersusun sejajar secara horizontal dengan touch target 48x48px.

---

## Komponen & token yang dipakai

- **MoodPebble:** 5 pebble bulat sentuh (`bg-mood-depressed`, `bg-mood-sad`, `bg-mood-neutral`, `bg-mood-happy`, `bg-mood-overjoyed`) dengan ring seleksi `ring-4 ring-orange-500/30`.
- **Form Controls:** Slider custom dengan aksen `accent-orange-500`, textarea `rounded-xl border border-brown-900/10 focus:ring-2 focus:ring-orange-500/30`.
- **Tombol Komitmen:** `rounded-full bg-brown-900 hover:bg-orange-500 text-cream px-7 py-3.5 text-sm font-bold shadow-xs`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Formulir aktif siap diisi, tanggal hari ini terpilih, MoodPebble netral sebagai default sebelum interaksi.
2. **Loading:** Denyut skeleton lembut saat memuat data riwayat bulan ini.
3. **Empty (Belum Ada Catatan):** Kalender menampilkan grid kosong bersih dengan ajakan lembut *"Catatan pertamamu akan mekar di sini"*.
4. **Error:** Banner ramah *"Gagal menyimpan check-in. Draft tulisanmu tetap aman"* + tombol *"Coba Kirim Lagi"*.
5. **Crisis Detected:** Jika teks jurnal mengandung indikasi bahaya diri, kotak dialog krisis Sejiwa 119 ext. 8 muncul seketika secara tenang tanpa warna merah agresif.
6. **Locked:** Fitur asesmen harian 100% gratis dan terbuka tanpa penguncian paywall.

---

## Interaksi & motion

- **Pemilihan Pebble:** Efek pegas halus (`scale-105 active:scale-95`) dengan umpan balik visual instan.
- **Slider Smooth Transition:** Angka skor bergeser mulus tanpa patah-patah.
- **Reduced Motion:** Animasi skala dan geser dinonaktifkan secara penuh saat `prefers-reduced-motion: reduce`.

---

## Aksesibilitas

- Setiap MoodPebble memiliki `aria-label` eksplisit (mis. *"Suasana hati: Bahagia"*).
- Navigasi keyboard penuh menggunakan tombol panah dan Tab antar pebble.
- Kontras teks nilai slider dan label terstandarisasi ≥ 4.5:1.

---

## Kriteria penerimaan

- [x] URL `/daily-assessment` otomatis redirect ke `/mood-check-in`.
- [x] 5 MoodPebble menggunakan warna kanonikal brand tanpa warna ungu/biru liar.
- [x] Slider dan tag energi terintegrasi dalam satu formulir simpan.
- [x] Deteksi krisis berfungsi pada teks bebas dan menampilkan nomor darurat bebas pulsa.

---

## Referensi yang dipakai

- **Ref 4 (Gently) & Ref 10 (AI Mental Health App):** Selector mood besar empuk, tata letak input pernapasan dan tidur yang lapang, riwayat emosi horizontal.
