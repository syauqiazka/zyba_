# Pengaturan & Billing Mockdoc — Sanctuary Settings & Zyba Plus (`/settings` & `/settings/zyba-plus`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Routes:** `/settings` (Profil & Preferensi) → `/settings/zyba-plus` (Langganan & Benefit) → `/settings/billing` (Riwayat Pembayaran)  
> **Source Components:** `src/app/settings/page.tsx`, `src/app/settings/components/*`, `src/app/settings/zyba-plus/page.tsx`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna yang ingin mengatur akun, menyesuaikan notifikasi, mengelola langganan Zyba Plus secara mandiri, atau mengekspor/menghapus data pribadinya.
- **Mental Model:** *"Menata ruang pribadi yang aman, memegang kendali penuh atas privasi dan pengeluaran finansial, tanpa tipuan atau jebakan berlangganan."*
- **Primary Job to Be Done (JTBD):** Mengubah avatar/nama, mengatur toggle notifikasi, upgrade ke Zyba Plus (kuota chat tak terbatas, analitik mendalam, materi eksklusif), membatalkan langganan dengan 1 klik transparan (*Zero Dark Patterns*), dan ekspor data kesehatan mental.
- **Data & API Binding:**
  - Prisma Models: `User`, `Subscription` (`status`, `currentPeriodEnd`, `plan`), `NotificationPref`
  - Endpoints: `GET /api/settings/profile`, `PUT /api/settings/profile`, `POST /api/billing/checkout`, `POST /api/billing/cancel`, `GET /api/user/export`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Honest Control Chamber*.
- **Prinsip Kejujuran Penuh (Anti-Dark Pattern):**
  - Dilarang keras menggunakan penghitung waktu mundur palsu (*"Penawaran diskon berakhir dalam 01:23:45!"*).
  - Pembatalan langganan dapat dilakukan langsung dari tombol yang jelas tanpa melewati kuis rasa bersalah berbelit-belit.
- **Kanvas & Material:** Kanvas Cream (`#F7F2E7`), kartu pengaturan berlatar `bg-white/90` dengan border kontak tipis `border-brown-900/10`.
- **Nada Bicara:** Santun, transparan, menghormati hak pengguna.

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Settings Layout**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1140px] mx-auto`.
  - Sidebar Tab Internal (`col-span-4`): Profil, Notifikasi, Zyba Plus, Keamanan & Data.
  - Panel Konten Aktif (`col-span-8`): Formulir pengaturan terfokus `bg-white/90 rounded-[24px] border border-brown-900/10 p-7 shadow-xs`.
- **Tablet & Mobile (< 1024px): Stacked Settings View**
  - Tab selector horizontal pill di bagian atas.
  - Formulir mengisi lebar penuh dengan padding `px-4 pt-4 pb-24`.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Profile Section
- Avatar Preview: `w-20 h-20 rounded-full border-2 border-brown-900/20 bg-orange-100 flex items-center justify-center relative`
- Tombol Ubah Avatar: Pebble sentuh melayang dengan ikon Lucide `Camera` 1.8px.
- Input Nama & Email: `h-11 px-4 rounded-xl bg-cream/30 border border-brown-900/15 text-sm font-medium text-brown-900`.

### B. Settings Toggles (Notifikasi & Suara)
- Toggle Row: `flex items-center justify-between py-3.5 border-b border-brown-900/10 last:border-0`
- Label: `font-display text-sm font-bold text-brown-900` + `text-xs text-brown-700/70 block mt-0.5`
- Custom Switch: `w-11 h-6 rounded-full transition-colors relative cursor-pointer bg-brown-900/20 aria-checked:bg-green-500`
  - Thumb: `w-5 h-5 rounded-full bg-white transition-transform translate-x-0.5 aria-checked:translate-x-5 shadow-xs`

### C. Zyba Plus Honest Subscription Card
- Container: `bg-orange-100/60 rounded-[20px] border border-orange-500/25 p-6 shadow-xs`
- Header:
  - Badge: `inline-block px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-wider`
  - Judul Paket: `font-display text-xl font-bold text-brown-900 mt-2`
  - Harga Terbuka: `text-2xl font-extrabold text-brown-900` (*"Rp 39.000 / bulan"* — tanpa biaya tersembunyi).
- Benefit Points: 4 baris ber-bullet ikon `Check` Lucide warna Green 500.
- Tombol Langganan: `bg-orange-500 hover:bg-orange-500/90 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-xs transition-all`

### D. Danger Zone (Hapus Akun & Ekspor Data)
- Ekspor Data: `border border-brown-900/20 text-brown-900 hover:bg-white rounded-full px-4 py-2 text-xs font-semibold`
- Hapus Akun: `text-danger hover:bg-danger/10 rounded-full px-4 py-2 text-xs font-semibold transition-colors`
  - Modal Konfirmasi: Dialog verifikasi ketik kata *"HAPUS"* dengan latar putih tegas dan border `border-danger/30`.

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Free User** | Status langganan aktif = FREE | Menampilkan opsi upgrade ke Zyba Plus | Klik upgrade jika berminat |
| **Plus Active** | Langganan Zyba Plus aktif | Badge *"Zyba Plus Aktif"* + rincian tanggal perpanjangan otomatis | Akses fitur analitik atau kelola paket |
| **Cancel Requested** | Pengguna memilih batalkan langganan | Dialog konfirmasi santun 1-klik tanpa survei intimidasi | Langganan dinonaktifkan di akhir siklus |
| **Profile Saved** | Pengguna menekan *"Simpan Perubahan"* | Notifikasi pill hijau lembut *"Perubahan profil berhasil disimpan"* | State profil tersinkronisasi |
| **Data Exported** | Pengguna meminta ekspor data | Unduhan berkas `zyba-wellness-data.json` dimulai otomatis | Pengguna menerima arsip datanya |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`User`, `Bell`, `CreditCard`, `Lock`, `Download`, `Trash2`).
- [x] **Zero Dark Patterns:** Tidak ada tombol pembatalan tersembunyi, tidak ada penyesatan teks ("confirmshaming").
- [x] **No Card Inception:** Struktur tab pengaturan menggunakan panel datar bertepi halus.
- [x] **Hierarki Radius:** Sanctuary Settings Card 24px, Zyba Plus Box 20px, Input Fields 12px, Control Pills 9999px.
- [x] **Accessible Contrast:** Teks keterangan memenuhi rasio kontras WCAG AA $\ge 4.5:1$.

---

## 7. Verification Contract (obra/superpowers)

- **Billing Security:** Endpoint webhook pembayaran Midtrans/Stripe memvalidasi signature HMAC SHA-512 sebelum memperbarui status `Subscription`.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

