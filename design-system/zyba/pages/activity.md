# Smart Activity Planner & Taman Bernapas — Redesign v2

> **Canonical Route:** `/activity`  
> **Source Components:** `src/app/activity/page.tsx`, `src/app/activity/components/*`

---

## Perubahan dari v1

1. **DIBUANG:** Panel samping "Ringkasan Ritme" kosong lebar yang sebelumnya memakan ruang tanpa isi data nyata. Panel ini kini diisi ringkasan aktivitas nyata yang telah diselesaikan atau diciutkan secara proporsional.
2. **DIBUANG:** Gamifikasi poin berlebihan seperti "+60 pts" dan visual streak api yang menekan.
3. **DIBUANG:** Kartu bersarang di daftar aktivitas harian. Setiap aktivitas kini disajikan dalam baris daftar terstruktur dengan pemisah garis halus.
4. **DIBUANG:** Lingkaran animasi berlebihan yang menyebabkan lag pada perangkat mobile saat memuat pacer pernapasan.
5. **BARU:** Tampilan Taman Bernapas 4-7-8 (Breathing Garden) yang elegan dengan pacer lingkaran organik yang mengembang (Tarik 4 detik), menahan (Tahan 7 detik), dan menyusut (Hembuskan 8 detik).
6. **BARU:** Pemutar audio suara alam (hujan lembut, ombak hening, angin pinus) yang terintegrasi langsung dengan sesi latihan napas.
7. **BARU:** Form cepat tambah aktivitas mikro personal yang realistis (5–15 menit).

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Merencanakan tindakan kecil penyeimbang stres harian, melakukan jeda napas 4-7-8 saat cemas melanda, mendengarkan musik latar penenang, dan menandai kebiasaan baik yang berhasil dijalankan.
- **Fitur yang Dipertahankan:**
  - Rencana aktivitas harian terhubung ke backend API `/api/activity`
  - Toggle checklist selesai aktivitas dengan pembaruan instan
  - Tambah dan hapus aktivitas personal
  - Modal latihan napas terpandu 4-7-8 (timer + panduan visual)
  - Musik latar ambience audio

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Asymmetric Grid 8 : 4 Seimbang)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1280px                       |
|                 |                                                                 |
|                 | +-----------------------------------+  +----------------------+ |
|                 | | TAMAN BERNAPAS 4-7-8 (bg-white/90)|  | RINGKASAN HARI INI   | |
|                 | | - Pacer Lingkaran Lembut          |  | (bg-white/90, r-24)  | |
|                 | | - Kontrol Audio Ambience          |  | - 3 Aktivitas Selesai| |
|                 | | - Tombol Mulai Sesi 3 Menit       |  | - Waktu Relaksasi    | |
|                 | +-----------------------------------+  +----------------------+ |
|                 | +-----------------------------------+  +----------------------+ |
|                 | | RENCANA AKTIVITAS HARIAN (r-24)   |  | TAMBAH AKTIVITAS     | |
|                 | | - Filter Kategori (Fisik/Batin)   |  | - Form Cepat (5 mnt) | |
|                 | | - Baris Aktivitas:                |  | - Pilihan Tag        | |
|                 | |   * Peregangan Leher & Bahu       |  +----------------------+ |
|                 | |   * Minum Segelas Air Hangat      |                           |
|                 | |   * Jeda Menatap Jendela          |                           |
|                 | +-----------------------------------+                           |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Modul Taman Bernapas tampil di atas dengan tombol audio yang mudah dijangkau satu tangan.
- Daftar aktivitas tersusun vertikal di bawahnya dengan touch-target toggle centang 48x48px.

---

## Komponen & token yang dipakai

- **Pacer Lingkaran Bernapas:** `w-48 h-48 rounded-full border-4 border-green-500/30 bg-green-100/40 flex items-center justify-center transition-all duration-1000`.
- **Baris Aktivitas:** `p-4 rounded-xl border border-brown-900/10 bg-white/90 hover:border-orange-500/30 flex items-center justify-between`.
- **Tombol Selesai:** Checkbox lingkaran `w-6 h-6 rounded-full border border-brown-900/20 data-[state=checked]:bg-green-500 data-[state=checked]:text-white`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Daftar aktivitas hari ini tampil dengan status selesai/belum, audio siap diputar.
2. **Loading:** Skeleton baris berdenyut pada wadah aktivitas.
3. **Empty (Belum Ada Rencana):** Tampilan hangat *"Belum ada rencana hari ini. Tambahkan satu niat kecil untuk tubuhmu"*.
4. **Error:** Pesan *"Gagal menyinkronkan aktivitas"* + tombol coba lagi.
5. **Crisis Detected:** Jika aktivitas diberi catatan darurat, saran kontak krisis langsung dimunculkan.
6. **Locked:** Fitur rencana aktivitas dan latihan napas dasar terbuka penuh untuk seluruh pengguna.

---

## Interaksi & motion

- **Siklus Napas 4-7-8:** Lingkaran membesar pelan selama 4 detik, mempertahankan ukuran selama 7 detik, lalu mengempis lembut selama 8 detik.
- **Audio Ambience Toggle:** Fading in/out audio lembut saat tombol play/pause ditekan.
- **Reduced Motion:** Pacer beralih ke penghitung detik numerik teks tanpa perubahan ukuran elemen grafis.

---

## Aksesibilitas

- Fase pernapasan diumumkan kepada pembaca layar via `aria-live="polite"` ("Tarik napas", "Tahan", "Hembuskan perlahan").
- Seluruh kontrol audio memiliki label tombol yang eksplisit (`aria-label="Putar suara alam"`).
- Fokus keyboard melompat secara logis dari filter aktivitas ke daftar item.

---

## Kriteria penerimaan

- [x] Panel samping tidak menyisakan ruang kosong lebar tanpa isi.
- [x] Latihan napas 4-7-8 berjalan tepat sesuai siklus detik 4-7-8.
- [x] Toggle selesai langsung memperbarui status di database `/api/activity`.
- [x] Tidak ada angka XP atau streak api merah yang menekan.

---

## Referensi yang dipakai

- **Ref 5 (Wellora) & Ref 8 (AI Wellness Advisor):** Tata letak rencana aktivitas harian berbasis ritme tubuh dan integrasi audio relaksasi lapang.
