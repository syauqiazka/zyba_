# Sanctuary Settings & Zyba Plus — Redesign v2

> **Canonical Route:** `/settings`, `/settings/billing`, `/settings/zyba-plus`, `/settings/zyba-plus/payment`, `/settings/zyba-plus/success`  
> **Source Components:** `src/app/settings/page.tsx`, `src/app/settings/zyba-plus/page.tsx`, `src/app/settings/billing/page.tsx`

---

## Perubahan dari v1

1. **DIBUANG:** Inkonsistensi wrapper latar belakang di mana halaman Zyba Plus memiliki panel latar warna asing yang berbeda dari halaman Settings utama.
2. **DIBUANG:** Desain pricing card yang terlalu agresif ala sales SaaS enterprise. Digantikan oleh kartu kurasi nilai tambah (*Sanctuary Plus Value Card*) yang tenang.
3. **DIBUANG:** Tombol-tombol toggle yang tidak terhubung ke API backend.
4. **BARU:** Wrapper pengaturan terpadu (*Unified Sanctuary Settings Shell*) dengan tab vertikal di desktop dan tab horizontal di mobile.
5. **BARU:** Halaman ekspor data privasi (`GET /api/settings/export`) yang rapi dalam format JSON/CSV transparan.
6. **BARU:** Alur integrasi Midtrans Snap yang mulus dari pemilihan paket -> popup pembayaran Snap -> verifikasi webhook -> layar sukses instan.
7. **BARU:** Dialog konfirmasi hapus akun permanen dengan warna `danger` kanonikal yang hati-hati.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Memperbarui data profil dan bio, mengatur frekuensi notifikasi, mengunduh salinan data pribadi, mengelola preferensi AI persona, dan mengupgrade langganan ke Zyba Plus.
- **Fitur yang Dipertahankan:**
  - Tab Pengaturan: Profil, Notifikasi, Privasi & Keamanan, Persona
  - Pengaturan notifikasi terhubung ke model `NotificationPref` (`/api/settings/notifications`)
  - Ekspor data pribadi dan hapus akun permanen (`/api/account/delete`)
  - Pilihan paket langganan Zyba Plus (Bulanan/Tahunan) terhubung ke API Midtrans `/api/billing/checkout`
  - Riwayat transaksi dan invoice pembayaran Midtrans

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Tabs Nav 260px : Konten Form 780px)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock 76px] |                    CONTAINER MAX-W 1200px                       |
|                 |                                                                 |
|                 | +----------------------+  +-----------------------------------+ |
|                 | | TABS PENGATURAN      |  | PANEL FORM AKTIF (bg-white/90)    | |
|                 | | (bg-white/90, r-24)  |  | (rounded-[24px], p-8)             | |
|                 | | - Profil Akun*       |  | Judul: Profil Akun                | |
|                 | | - Notifikasi         |  |                                   | |
|                 | | - Privasi & Data     |  | [Avatar Preview] [Ganti Foto]     | |
|                 | | - Persona Companion  |  | Input Nama: [Ahmad Royhan........]| |
|                 | | - Langganan Plus     |  | Input Username: [@aroyhan........]| |
|                 | | - Riwayat Tagihan    |  | Input Bio: [Mahasiswa tingkat...] | |
|                 | +----------------------+  |                                   | |
|                 |                           | [Simpan Perubahan (bg-brown-900)] | |
|                 |                           +-----------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Tabs pengaturan tersusun horizontal di bagian atas halaman yang dapat digulir.
- Form konten tampil penuh di bawah tabs dengan spasi antar-field yang lega.

---

## Komponen & token yang dipakai

- **Wadah Pengaturan:** `bg-white/90 rounded-[24px] border border-brown-900/10 p-6 sm:p-8 shadow-xs`.
- **Item Tab Nav:** `px-4 py-3 rounded-xl text-sm font-semibold transition-all data-[active=true]:bg-brown-900 data-[active=true]:text-white data-[active=false]:text-brown-700 data-[active=false]:hover:bg-brown-900/5`.
- **Toggle Switch Notifikasi:** `w-11 h-6 rounded-full transition-colors data-[checked=true]:bg-green-500 data-[checked=false]:bg-brown-900/20 relative`.
- **Pricing Card Plus:** `bg-white/95 rounded-[24px] border-2 border-orange-500/40 p-6 shadow-sm flex flex-col justify-between`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Form menampilkan data pengguna terkini, toggle notifikasi sesuai preferensi database.
2. **Loading:** Skeleton form saat mengambil data `/api/user/me`.
3. **Empty (Riwayat Tagihan):** Tampilan *"Belum ada transaksi pembayaran. Nikmati akses gratis ZYBA"*.
4. **Error:** Alert banner *"Gagal menyimpan perubahan. Periksa koneksi internet"* + retry.
5. **Crisis Detected:** Tab privasi menyertakan opsi darurat dan akses panduan krisis.
6. **Locked:** Modul billing menampilkan opsi paket tanpa mengunci akun yang sudah berjalan.

---

## Interaksi & motion

- **Perpindahan Tab:** Crossfade halus 150ms saat beralih antara profil, notifikasi, dan billing.
- **Midtrans Popup:** Menampilkan Snap iframe modal saat tombol "Bayar Sekarang" ditekan tanpa reload halaman.
- **Reduced Motion:** Transisi tab dan toggle dinonaktifkan di bawah `prefers-reduced-motion: reduce`.

---

## Aksesibilitas

- Seluruh switch toggle memiliki atribut `role="switch"` dan `aria-checked`.
- Form controls memiliki label terkait via atribut `htmlFor` dan `id`.
- Tombol destruktif "Hapus Akun" memiliki dialog konfirmasi ganda dengan tombol fokus default pada pembatalan.

---

## Kriteria penerimaan

- [x] Wrapper halaman Zyba Plus identik dan konsisten dengan halaman Settings utama.
- [x] Toggle notifikasi tersimpan ke model `NotificationPref`.
- [x] Alur Midtrans Snap token terhubung ke `/api/billing/checkout`.
- [x] Fitur ekspor data menghasilkan file data yang valid.

---

## Referensi yang dipakai

- **Ref 13 (MindBridge) & Ref 14 (Shuvo):** Desain tata letak pengaturan akun terpadu dengan navigasi tab samping yang bersih dan jelas.
