# Panel Pengawas Mockdoc — Sanctuary Guardians & Admin Deck (`/admin`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/admin`, `/admin/moderation`, `/admin/payments`  
> **Source Components:** `src/app/admin/page.tsx`, `src/app/admin/moderation/page.tsx`, `src/app/admin/payments/page.tsx`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Tim penjaga sanctuary ZYBA (Admin, Moderator Komunitas, dan Operator Pembayaran) yang bertugas menjaga keselamatan ruang aman, meninjau laporan konten sensitif, memantau transaksi, serta memverifikasi kesehatan integrasi AI.
- **Mental Model:** *"Meja kerja kayu rapi seorang kurator perpustakaan dan penjaga lentera: tenang, terstruktur, bebas distraksi, dan memudahkan pengambilan keputusan etis dengan cepat."*
- **Primary Job to Be Done (JTBD):** Menyediakan dasbor operasional terpadu untuk moderasi konten komunitas, penanganan banding (*appeals*), audit log transaksi pembayaran Zyba Plus, serta pemantauan status kesehatan multi-provider AI (Google Gemini, Groq, OpenRouter).
- **Invarian Hak Akses:**
  - Hanya pengguna dengan role `ADMIN` atau `MODERATOR` yang dapat mengakses route `/admin/*`.
  - Non-admin otomatis di-redirect ke `/dashboard` oleh middleware.

---

## 2. Perubahan dari v1

- **Dihapus:** Tampilan dasbor analitik bootstrap gelap yang padat dan membingungkan.
- **Dihapus:** Tabel data mentah tanpa status badge yang jelas dan tanpa penyaring cepat.
- **Baru:** Antarmuka pengawas bernuansa linen hangat (*Tactile Operations Desk*) yang konsisten dengan estetika ZYBA.
- **Baru:** Antrean Moderasi (*Moderation Queue*) dengan kartu pratinjau cepat, status risiko krisis, dan aksi moderasi 1-klik (Setujui, Sembunyikan, Hapus).
- **Baru:** Panel Status Multi-Provider AI (indikator latensi & ketersediaan Gemini, Groq, OpenRouter).
- **Baru:** Tabel Transaksi Pembayaran (*Midtrans Audit Logs*) dengan status lunas, pending, dan kedaluwarsa.
- **Alasan:** Menghadirkan rasa tenang bagi tim pengawas saat menangani isu sensitif dan mempercepat respons terhadap laporan komunitas.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Akses Admin di mobile diutamakan untuk tanggap darurat moderasi cepat.
  - Kartu Antrean Laporan: 1 kolom kartu vertikal dengan tombol aksi besar.
  - Ringkasan Metrik: 2 kolom kartu ringkas.
- **Tablet (768px):**
  - Layout: `md:pl-[108px] pr-6 py-8 max-w-[1100px] mx-auto`.
  - Grid Metrik: 4 kolom metrik operasional.
  - Daftar Moderasi: Tabel responsif dengan kartu lipat pada baris detail.
- **Desktop (1280px):**
  - Layout: `md:pl-[108px] pr-8 py-10 max-w-[1360px] mx-auto`.
  - Header: Baris pengawas dengan status sistem global dan tab navigasi sub-halaman (*Ikhtisar*, *Moderasi*, *Pembayaran*).
  - Bagian Atas: Grid 4 kartu metrik utama (`col-span-3` masing-masing: Laporan Tertunda, Postingan Aktif, Transaksi Hari Ini, Status AI).
  - Bagian Bawah: Grid 12 kolom (8 kolom antrean moderasi / log transaksi, 4 kolom panel kesehatan sistem & audit log instan).

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Latar Kartu:** `bg-white/95 border border-brown-900/10`.
- **Tinta & Tipografi:** `text-brown-900` (`#3B2A20`) untuk tajuk angka dan judul, `text-brown-700` (`#5A4636`) untuk isi log dan konten laporan.
- **Aksen Status Operasional:**
  - Status Normal / Sehat: `bg-green-100 text-green-800 border-green-500/20`.
  - Status Perhatian / Pending: `bg-amber-100 text-amber-800 border-amber-500/20`.
  - Status Kritis / Pelanggaran: `bg-orange-100 text-orange-700 border-orange-500/30`.
  - Status Destruktif: `text-danger` / `bg-rose-50 text-rose-700` (hanya untuk aksi penghapusan permanen).

---

## 5. Komponen Kunci & Hirarki Radius

1. **Guardian Operational Shell:**
   - Radius: `rounded-[24px]` (Major Anchor).
   - Container: `bg-white/95 border border-brown-900/10 p-6 sm:p-7 shadow-xs`.
2. **Metrics Stat Pebble:**
   - Radius: `rounded-[20px]`.
   - Menampilkan angka Manrope tebal dan tren persentase operasional.
3. **Moderation Queue Card:**
   - Radius: `rounded-xl` (12px).
   - Menampilkan cuplikan postingan yang dilaporkan, alasan laporan, pelapor, dan tombol aksi 1-klik.
4. **Action Buttons:**
   - Aksi Aman / Setujui: `rounded-full bg-green-100 text-green-800 hover:bg-green-200 px-4 py-1.5 text-xs font-semibold`.
   - Aksi Hapus / Tindak: `rounded-full bg-brown-900 text-cream hover:bg-brown-900/90 px-4 py-1.5 text-xs font-semibold`.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Menampilkan antrean moderasi terbaru, ringkasan pembayaran hari ini, dan status AI operasional.
2. **Loading:** Kerangka tabel skeleton dengan efek shimmer kertas lembut.
3. **Empty:** Jika tidak ada antrean laporan tersisa, tampilkan state kosong damai: *"Semua aman. Komunitas dalam keadaan tenang dan terlindungi."*
4. **Active:** Mengklik salah satu baris laporan membuka modal tinjau konteks penuh (postingan asli, komentar terkait, riwayat pelanggaran akun).
5. **Error:** Jika pemanggilan data API admin gagal, tampilkan pesan peringatan dengan tombol coba lagi tanpa crash aplikasi.
6. **Crisis:** Jika ada laporan yang memicu deteksi krisis mendesak (indikasi bahaya diri), kartu laporan ditandai dengan badge prioritas tertinggi dan panduan eskalasi rujukan.

---

## 7. Interaksi & Motion

- **Aksi Cepat:** Menyetujui atau menyembunyikan konten memberikan feedback instan dengan menghapus kartu laporan secara halus (slide-fade out 200ms).
- **Filter Tab:** Mengganti tab filter (Semua, Tertunda, Selesai) memperbarui daftar instan via SWR/client query.
- **Reduced Motion:** Animasi transisi baris ditiadakan saat preferensi reduced motion diaktifkan.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Tabel Semantik:** Menggunakan elemen tabel HTML semantik (`table`, `thead`, `tbody`, `th`, `td`) dengan atribut `scope="col"` dan `scope="row"`.
- **Keyboard Shortcuts:** Tombol aksi moderasi dapat dinavigasikan dan dieksekusi murni via keyboard (Tab, Enter, Space).
- **Screen Reader Announcements:** Pengurangan jumlah antrean setelah tindakan diumumkan dengan `aria-live="polite"`.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- **GET `/api/admin/moderation`**:
  - Response: `{ reports: ReportItem[], pendingCount: number }`.
- **POST `/api/admin/moderation`**:
  - Request: `{ reportId: string, action: "APPROVE" | "HIDE" | "DELETE" }`.
- **GET `/api/admin/payments`**:
  - Response: `{ transactions: PaymentItem[], summary: { totalRevenue, pendingCount } }`.
- **GET `/api/admin/ai-health`**:
  - Response: `{ providers: { gemini: string, groq: string, openrouter: string } }`.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Route `/admin` dilindungi secara ketat dan hanya dapat diakses pengguna berhak (role ADMIN).
- [ ] Antrean moderasi menampilkan data laporan postingan komunitas secara akurat.
- [ ] Aksi moderasi (Setujui, Sembunyikan, Hapus) memicu pembaruan state instan.
- [ ] Status integrasi AI menampilkan status provider yang terkonfigurasi.
- [ ] Tampilan konsisten dengan filosofi Tactile Sanctuary tanpa elemen dashboard arcade.
