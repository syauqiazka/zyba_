# Langganan & Pembayaran Mockdoc — Zyba Plus Checkout & Sanctuary Unlocking (`/settings/zyba-plus/payment`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/settings/zyba-plus/payment`, `/settings/zyba-plus/success`  
> **Source Components:** `src/app/settings/zyba-plus/payment/page.tsx`, `src/app/settings/zyba-plus/success/page.tsx`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna yang ingin meningkatkan pengalaman pendampingan batinnya dengan membuka akses token tanpa batas ke Zyba Companion (model AI reasoning mendalam), analisis pola emosi mingguan komprehensif, dan kurasi meditasi audio khusus.
- **Mental Model:** *"Menyumbangkan iuran bulanan untuk menjaga lentera sanctuary tetap menyala, menerima kunci ruang batin yang lebih dalam dengan rasa tenang dan tanpa jeratan langganan gelap."*
- **Primary Job to Be Done (JTBD):** Menyajikan ringkasan pesanan transparan untuk paket Zyba Plus (Bulanan / Tahunan), memicu popup pembayaran resmi Midtrans Snap secara aman, dan mengarahkan pengguna ke halaman konfirmasi sukses begitu transaksi diverifikasi.
- **Invarian Keuangan & Keamanan:**
  - Integrasi Midtrans Snap via server API token (`POST /api/billing/charge`).
  - Verifikasi status pembayaran melalui webhook server-to-server (`/api/billing/webhook`) yang aman.
  - Dilarang memanipulasi status langganan di sisi client secara sepihak.

---

## 2. Perubahan dari v1

- **Dihapus:** Elemen countdown timer palsu (*"Penawaran berakhir dalam 05:00 menit!"*) atau taktik manipulasi urgensi (dark pattern).
- **Dihapus:** Tombol checkout mencolok dengan efek gradien pelangi atau glitter norak.
- **Baru:** Lembar konfirmasi pesanan bergaya editorial tanda terima (*Quiet Receipt Voucher*) dengan rincian biaya yang transparan hingga nominal pajak.
- **Baru:** Integrasi mulus dengan Midtrans Snap SDK tanpa popup yang merusak tata letak mobile.
- **Baru:** Halaman penyambutan sukses (`/settings/zyba-plus/success`) bernuansa hangat dengan lencana khusus anggota Plus.
- **Alasan:** Menghormati integritas finansial pengguna, menghilangkan tekanan kecemasan pembelian, dan membangun kepercayaan jangka panjang.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-4 py-6 pb-20`.
  - Struktur: Kartu ringkasan pesanan vertikal tunggal.
  - Tombol Bayar: Tersemat di bagian bawah kartu atau sticky bar empuk, tinggi 48px.
- **Tablet (768px):**
  - Layout: Terpusat dengan lebar `max-w-[540px] mx-auto py-12 px-6`.
  - Kartu Ringkasan: `rounded-[24px]` dengan detail metode pembayaran yang didukung (GoPay, QRIS, BCA, Mandiri, Kartu Kredit).
- **Desktop (1280px):**
  - Layout: Grid 2 kolom asimetris 60:40 dalam kontainer `max-w-[1040px] mx-auto py-14 px-8 items-start gap-10`.
  - Sisi Kiri (60%): Daftar manfaat eksklusif Zyba Plus (AI reasoning tak terbatas, privasi data diperluas, dukungan prioritas).
  - Sisi Kanan (40%): Voucher ringkasan pesanan `rounded-[24px] bg-white/95 border border-brown-900/10 p-7 shadow-xs` dengan rincian harga, tombol *"Lanjutkan ke Pembayaran"*, dan jaminan keamanan transaksi.

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Latar Voucher:** `bg-white/95` dengan garis kontak halus `border-brown-900/10`.
- **Tinta Teks:** `text-brown-900` (`#3B2A20`) untuk nominal harga Manrope tebal, `text-brown-700` (`#5A4636`) untuk penjelasan benefit DM Sans.
- **Aksen Plus:**
  - Badge Plus: `bg-orange-100 text-orange-600 border border-orange-500/20 font-extrabold uppercase`.
  - Tombol Bayar: `bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full`.
  - Jaminan Keamanan: `text-green-700` dengan ikon Lucide `ShieldCheck`.

---

## 5. Komponen Kunci & Hirarki Radius

1. **Order Summary Voucher:**
   - Radius: `rounded-[24px]` (Major Anchor).
   - Container: `border border-brown-900/10 bg-white/95 p-6 sm:p-8 shadow-xs`.
   - Garis Putus Taktil: `border-dashed border-brown-900/15 my-4`.
2. **Benefit Check Items:**
   - Radius: `rounded-xl` (12px) untuk kartu mikro manfaat.
   - Ikon: Lucide `CheckCircle` stroke 1.8px warna Green 500.
3. **Midtrans Snap Modal Overlay:**
   - Dikontrol oleh script resmi Midtrans `window.snap.pay(token, callbacks)`.
4. **Success Congratulation Shell (`/success`):**
   - Radius: `rounded-[28px]` dengan lencana kepingan tembikar Zyba Plus dan tombol kembali ke dashboard.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Voucher pesanan siap menampilkan paket yang dipilih (Bulanan Rp 29.000 / Tahunan Rp 249.000) dengan rincian biaya lengkap.
2. **Loading:** Tombol pembayaran menampilkan state *"Menyiapkan Pembayaran Aman..."* sembari meminta Snap Token dari backend API.
3. **Empty:** Jika paket langganan tidak valid, sistem mengarahkan kembali ke halaman pemilihan tier `/settings/zyba-plus`.
4. **Active:** Jendela Midtrans Snap terbuka di layar menampilkan pilihan bank dan e-wallet.
5. **Error:** Jika pembuatan token gagal atau pengguna menutup jendela tanpa bayar, tampilkan pesan ramah: *"Pembayaran belum diselesaikan. Kamu dapat mencoba kembali kapan saja."*
6. **Crisis:** Tidak relevan secara emosional, namun tautan panduan darurat tetap tersedia di footer.

---

## 7. Interaksi & Motion

- **Snap Trigger:** Klik tombol bayar membuka iframe popup Midtrans Snap secara mulus tanpa me-reload seluruh halaman.
- **Success Redirect:** Callback `onSuccess` dari Midtrans memicu redirect instan ke `/settings/zyba-plus/success` dengan konfirmasi visual tenang.
- **Reduced Motion:** Menghilangkan animasi pulsasi pada tombol bayar jika pengguna mengaktifkan mode reduced motion.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Harga Jelas:** Teks nominal harga menggunakan format mata uang Indonesia yang ramah pembaca layar (`aria-label="Dua puluh sembilan ribu rupiah per bulan"`).
- **Keyboard Friendly:** Tombol lanjutkan pembayaran dapat diakses melalui keyboard Tab dan diaktifkan dengan Enter.
- **Keamanan Transparansi:** Menyertakan teks ketentuan pembatalan dan privasi yang mudah dibaca dan memenuhi kontras minimum 4.5:1.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- **POST `/api/billing/charge`**:
  - Request: `{ planId: "monthly" | "annual" }`.
  - Response: `{ snapToken: string, redirectUrl: string, orderId: string }`.
- **POST `/api/billing/webhook`**:
  - Menerima notifikasi dari Midtrans, memperbarui status akun `User.isPremium = true` dan mencatat riwayat ke tabel `Subscription`.
- **GET `/api/billing/status`**:
  - Response: `{ isPremium: boolean, plan: string, expiresAt: string | null }`.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Pengguna dapat melihat ringkasan pesanan paket yang dipilih secara transparan.
- [ ] Tombol bayar berhasil meminta snap token dan membuka modal pembayaran Midtrans Snap.
- [ ] Berhasil menangani status sukses, pending, dan pembatalan dengan pesan yang tepat.
- [ ] Halaman sukses menampilkan ucapan terima kasih dan status langganan aktif.
- [ ] Tidak ada countdown timer manipulatif atau dark pattern penjualan.
- [ ] Tata letak rapi pada 375px, 768px, dan 1280px.
