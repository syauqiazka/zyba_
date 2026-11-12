# Zyba Community (Warm Support Circles) — Redesign v2

> **Canonical Route:** `/community`, `/community/[slug]`  
> **Source Components:** `src/app/community/page.tsx`, `src/app/community/[slug]/page.tsx`, `src/components/community/*`

---

## Perubahan dari v1

1. **DIBUANG:** Mode gelap terpisah yang tidak konsisten dengan tema kanvas linen ZYBA. Seluruh komunitas kini berjalan 100% di atas palet kanonikal `bg-cream`, `bg-white/90`, dan `text-brown-900`.
2. **DIBUANG:** Border kotak tebal pada setiap postingan feed yang menimbulkan kesan kaku dan sempit. Digantikan oleh **arsitektur feed minimalis ala Threads** yang menggunakan pemisah garis halus (`border-b border-brown-900/10`).
3. **DIBUANG:** Pill warna-warni solid `bg-green-100` pada seluruh tab navigasi sidebar komunitas. Digantikan active state tipis yang elegan (`bg-brown-900/5 font-bold`).
4. **DIBUANG:** Duplikasi tombol posting baru dan form pencarian di dalam halaman feed.
5. **BARU:** Kotak tulis postingan (*Inline Composer*) yang lapang dengan tombol toggle postingan anonim yang jelas dan transparan.
6. **BARU:** Tombol reaksi khas **"Kirim Pelukan"** (ikon hati lembut dan counter pelukan suportif) yang hangat dan bebas dari persaingan engagement toxic.
7. **BARU:** Sub-view terintegrasi via URL slug (`/community/search`, `/community/messages`, `/community/notifications`, `/community/profile/[userId]`).

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Berbagi cerita dan beban emosional secara aman dan anonim, saling menguatkan dengan sesama Gen Z tanpa stigma, mengirim pelukan suportif, dan menemukan percakapan yang relevan.
- **Fitur yang Dipertahankan:**
  - Feed utama dengan infinite pagination (`/api/community`)
  - Filter tab: "Untuk Kamu", "Mengikuti", "Tersimpan"
  - Compose postingan inline & modal mengambang `CreatePostModal`
  - Reaksi pelukan, komentar thread berantai, bookmark, repost
  - Opsi berbagi anonim (avatar samaran)
  - Fitur pelaporan konten sensitif & moderasi
  - Deteksi krisis pada postingan dengan respons banner Sejiwa 119

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Contextual Sidebar 260px : Feed Utama 680px : Right Rail 300px)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock] | COMMUNITY NAV (260px)   | THREADS-STYLE FEED (680px)   | CIRCLES & TRENDS    |
|            |                         |                              | (300px)             |
|            | [<- Kembali ke ZYBA]    | [+ Kotak Tulis Postingan...] | [Lingkaran Hangat]  |
|            | - Untuk Kamu*           | ---------------------------- | * Pejuang Skripsi   |
|            | - Mengikuti             | Postingan 1:                 | * Mengelola Cemas   |
|            | - Pesan (DM)            | [Avatar] Nama User · 2j lalu | * Healing Santun    |
|            | - Notifikasi            | "Hari ini terasa berat..."   |                     |
|            | - Tersimpan             | [Pelukan (42)] [Komentar (5)]| [Panduan Komunitas] |
|            | - Profil Komunitas      | ---------------------------- | "Saling menjaga,    |
|            |                         | Postingan 2 (Anonim):        |  tanpa penghakiman" |
|            |                         | [Topeng Anonim] · 4j lalu    |                     |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Feed mengisi layar penuh, composer dapat dibuka via tombol "+" mengambang di pojok kanan bawah.
- Sub-navigasi komunitas diakses melalui tab horizontal atas yang dapat digeser.

---

## Komponen & token yang dipakai

- **Item Postingan Feed:** `p-5 sm:p-6 border-b border-brown-900/10 bg-white/60 hover:bg-white/90 transition-colors`.
- **Tombol Pelukan:** `flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-orange-100/60 text-brown-700 hover:text-orange-500 transition-colors text-xs font-semibold`.
- **Badge Anonim:** `bg-brown-900/10 text-brown-900 text-[11px] font-bold px-2 py-0.5 rounded-full`.
- **Composer Container:** `rounded-[24px] bg-white/95 border border-brown-900/10 p-5 shadow-xs`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Postingan komunitas termuat berurutan, interaksi pelukan dan komentar responsif.
2. **Loading:** Skeleton kartu postingan mengalir vertikal.
3. **Empty:** Sapaan ramah *"Belum ada cerita di lingkaran ini. Jadilah yang pertama menyalakan kehangatan"*.
4. **Error:** Pesan *"Gagal memuat kiriman komunitas"* + tombol coba lagi.
5. **Crisis Detected:** Postingan yang mengandung kata risiko tinggi memicu filter moderasi dan menyajikan banner bantuan instan.
6. **Locked:** Fitur komunitas terbuka penuh untuk semua anggota terdaftar.

---

## Interaksi & motion

- **Kirim Pelukan:** Animasi denyut halus ikon hati (`scale-125`) dengan penambahan angka counter instan (optimistic UI update).
- **Compose Modal Slide-Up:** Modal postingan muncul dari bawah dengan lereng lembut tanpa layout-shift.
- **Reduced Motion:** Animasi modal dan denyut pelukan diganti perubahan opacity instan.

---

## Aksesibilitas

- Seluruh tombol aksi interaksi memiliki `aria-label` yang menyertakan jumlah hitungan (mis. *"Kirim pelukan, saat ini 42 pelukan"*).
- Feed mendukung navigasi keyboard penuh (Tab untuk berpindah antar-postingan dan tombol interaksi).

---

## Kriteria penerimaan

- [x] Feed tidak menggunakan dark mode kaku atau border kotak tebal terpisah.
- [x] Tombol "Kirim Pelukan" memperbarui counter secara instan.
- [x] Opsi postingan anonim menyamarkan identitas asli di database `/api/community`.
- [x] Sub-navigasi slug (`/community/[slug]`) berfungsi tanpa memutus layout context.

---

## Referensi yang dipakai

- **Struktur Threads & Ref 13 (MindBridge):** Feed percakapan terbuka minimalis, tombol interaksi manusiawi, dan pemisahan sub-feed yang rapi.
