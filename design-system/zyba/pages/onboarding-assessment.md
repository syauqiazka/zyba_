# Onboarding & Asesmen Awal 8-Step — Redesign v2

> **Canonical Route:** `/onboarding` (Welcome/Signup), `/assessment` (Flow Terpadu 8-Step)  
> **Source Components:** `src/app/onboarding/page.tsx`, `src/app/assessment/page.tsx`, `src/components/assessment/*`

---

## Perubahan dari v1

1. **DIBUANG:** Teks krisis atau ide bunuh diri yang sempat dijadikan dummy teks pada layar "Expression Analysis". Digantikan oleh teks reflektif emosional sehari-hari yang sehat dan realistis.
2. **DIBUANG:** Tampilan formulir kaku ala birokrasi administrasi klinis.
3. **DIBUANG:** Tombol-tombol navigasi yang membingungkan tanpa tombol "Kembali ke tahap sebelumnya".
4. **BARU:** Penggabungan utuh antara **Profile Setup** (avatar, nama, bio, OTP, notifikasi) dan **Kuisioner Kebugaran Mental** ke dalam **satu alur terpadu 8-step** yang mulus di `/assessment`.
5. **BARU:** Format split formulir editorial desktop: panel kiri menampilkan ringkasan ritual kedatangan (*Arrival Ritual Stepper*), panel kanan menyajikan pertanyaan aktif yang lega dan bernapas.
6. **BARU:** Pengukur kekuatan kata sandi (*Password Strength Meter*) yang informatif dan elegan.
7. **BARU:** Layar kompilasi data (*Compiling Data*) beranimasi denyut tenang sebelum layar akhir *"You're All Set Up"* yang menandai `User.onboardingCompleted = true`.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Memulai perjalanan wellness dengan membuat profil yang personal, memverifikasi akun secara aman, mendefinisikan tujuan kesehatan batin, dan menyelesaikan asesmen dasar tanpa rasa lelah.
- **Fitur yang Dipertahankan:**
  - 8-Step lengkap:
    1. Avatar & profil setup (nama, bio)
    2. Password setup dengan strength meter
    3. Verifikasi OTP 4/6 digit
    4. Biometric setup (opsional/skip)
    5. Pengaturan preferensi notifikasi
    6. Kuesioner kesehatan mental & AI Expression Analysis
    7. Loading kompilasi data
    8. Layar "You're All Set Up" (pemicu `onboardingCompleted = true`)
  - Gating middleware: Akun baru wajib menyelesaikan seluruh 8 step sebelum bisa mengakses `/dashboard`.

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Split Form 4 : 8)
```
+-----------------------------------------------------------------------------------+
|                           CONTAINER MAX-W 1200px                                  |
|                                                                                   |
| +--------------------------------+  +-------------------------------------------+ |
| | PANEL KIRI (ARRIVAL RITUAL)    |  | PANEL KANAN (PERTANYAAN AKTIF)            | |
| | (bg-[#FAF7F2], r-28, p-8)      |  | (bg-white/95, r-28, p-8)                  | |
| | - Logo ZYBA                    |  |                                           | |
| | - Stepper Progress Bar (Step 3)|  | Judul: "Bagaimana Kualitas Tidurmu?"      | |
| |   1. Profil Diri (selesai)     |  | Sub: Pilih kondisi yang paling mendekati  | |
| |   2. Keamanan Akun (selesai)   |  |                                           | |
| |   3. Ritme Batin (aktif)       |  | Pilihan Kartu Taktil:                     | |
| |   4. Preferensi & Selesai      |  | [A. Sangat Nyenyak (7-8 jam)]             | |
| |                                |  | [B. Sering Terbangun di Malam Hari]       | |
| | Catatan Privasi:               |  | [C. Sulit Memulai Tidur]                  | |
| | "Jawabanmu tersimpan aman &    |  |                                           | |
| |  hanya untuk personalisasi"    |  | Navigasi Bawah:                           | |
| |                                |  | [<- Sebelumnya]        [Lanjutkan ->]     | |
| +--------------------------------+  +-------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Stepper disederhanakan menjadi bilah progres horizontal di atas (Step 3/8).
- Pertanyaan aktif tampil penuh dengan opsi tombol berukuran minimal 48px.

---

## Komponen & token yang dipakai

- **Panel Kiri:** `bg-cream rounded-[28px] border border-brown-900/10 p-8 flex flex-col justify-between`.
- **Panel Kanan Formulir:** `bg-white/95 rounded-[28px] border border-brown-900/10 p-8 sm:p-10 shadow-xs`.
- **Opsi Pilihan Jawaban:** `w-full p-4 rounded-xl border border-brown-900/12 bg-white hover:border-orange-500/50 hover:bg-orange-100/20 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-100/30 text-left transition-all`.
- **Tombol Navigasi:** Tombol "Lanjutkan" primer `rounded-full bg-brown-900 hover:bg-orange-500 text-white px-7 py-3 font-bold`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Pertanyaan aktif terisi dengan pilihan sebelumnya jika pengguna menekan tombol kembali.
2. **Loading (Compiling Data):** Lingkaran progres tenang dengan teks reflektif *"Menyusun ruang perlindunganmu..."*.
3. **Empty:** Validasi form langsung menyorot input kosong dengan pesan ramah.
4. **Error (Gagal Simpan):** Notifikasi *"Terjadi kendala jaringan saat menyimpan. Coba lagi"* tanpa mereset isian jawaban.
5. **Crisis Detected:** Pertanyaan ekspresi diri yang mendeteksi indikasi bahaya tetap mengarahkan ke hotline Sejiwa 119 di layar akhir.
6. **Locked:** Seluruh alur onboarding 100% gratis.

---

## Interaksi & motion

- **Transisi Antar-Langkah:** Slide horizontal halus 250ms dari kanan ke kiri saat menekan tombol Lanjutkan.
- **State Preservation:** Jawaban disimpan di React state terpusat sehingga data tidak hilang saat berpindah maju/mundur.
- **Reduced Motion:** Transisi diganti dengan perubahan tampilan seketika.

---

## Aksesibilitas

- Form menggunakan elemen semantik `<fieldset>` dan `<legend>`.
- Tombol pilihan memiliki peran radio atau checkbox dengan status `aria-checked`.
- Fokus berpindah otomatis ke judul pertanyaan baru setelah langkah berpindah.

---

## Kriteria penerimaan

- [x] Rute `/assessment` mengintegrasikan profile setup dan kuisioner kesehatan mental dalam 1 alur 8-step.
- [x] Pengguna yang belum menyelesaikan asesmen tidak bisa membuka `/dashboard` (gated via `middleware.ts`).
- [x] Teks dummy tidak mengandung kalimat krisis.
- [x] Input data tidak hilang saat menekan tombol "Sebelumnya".

---

## Referensi yang dipakai

- **Ref 6 (Mindro) & Ref 15 (Heal):** Alur onboarding bertahap dengan nada bicara hangat manusiawi dan stepper samping yang menenangkan.
