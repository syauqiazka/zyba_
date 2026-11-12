# Buku Panduan & Bantuan Mockdoc — Crisis Directory & Sanctuary Guide (`/guidebook`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/guidebook`  
> **Source Components:** `src/app/guidebook/page.tsx`, `src/lib/crisisDetection.ts`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna yang sedang mengalami beban emosional mendalam, kerabat yang ingin mencari panduan menolong teman terpuruk, atau pengguna baru yang ingin memahami etika ruang aman ZYBA.
- **Mental Model:** *"Membuka lembaran peta darurat dan panduan pertolongan pertama yang tertata rapi di sudut ruangan, mengetahui persis siapa yang bisa dihubungi saat situasi genting, dan merasa terlindungi tanpa kepanikan."*
- **Primary Job to Be Done (JTBD):** Menyediakan direktori kontak hotline darurat resmi 24/7 (bebas pulsa Sejiwa 119 ext. 8, Yayasan Pulih, LISA, Into The Light), panduan pertolongan pertama psikologis mandiri (*Psychological First Aid*), serta etika menjaga kehangatan komunitas.
- **Sumber Data & Keabsahan:**
  - Sumber Tunggal Krisis: `CRISIS_RESOURCES` di `src/lib/crisisDetection.ts`.
  - Akses Langsung: Tombol dialer telepon `tel:` dan tautan WhatsApp resmi tanpa dinding login atau rintangan formulir.

---

## 2. Perubahan dari v1

- **Dihapus:** Penggunaan warna merah alarm menyala yang memicu kecemasan dan kepanikan berlebih pada pengguna yang sedang rapuh.
- **Dihapus:** Tampilan daftar kontak darurat yang padat dan membingungkan tanpa hierarki tindakan pertama.
- **Baru:** *Primary Crisis Lifeline Anchor* yang tenang namun tegas di bagian paling atas dengan tombol panggilan cepat Sejiwa 119 ext. 8.
- **Baru:** Panduan Pertolongan Pertama Psikologis Mandiri (Teknik Grounding 5-4-3-2-1 dan Napas Kotak Terpimpin).
- **Baru:** Kartu organisasi mitra dengan jam operasional transparan, metode kontak langsung, dan label keahlian spesifik.
- **Alasan:** Menghadirkan perlindungan emosional yang menenangkan, berwibawa, mudah diakses dalam hitungan detik saat kondisi genting, dan mematuhi etika bantuan kesehatan jiwa.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-4 pt-4 pb-24`.
  - Banner Darurat Utama: Berada di posisi paling atas dengan tombol dialer berukuran besar (tinggi minimal 48px) agar mudah diketuk tangan yang gemetar.
  - Kartu Bantuan: 1 kolom kartu vertikal dengan tombol panggil/chat langsung.
  - Panduan Mandiri: Akordeon ringkas langkah pertolongan pertama.
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
- **Tablet (768px):**
  - Layout: `md:pl-[108px] pr-6 py-8 max-w-[1000px] mx-auto`.
  - Navigasi: Floating Zen Dock di sisi kiri (`w-[76px]`).
  - Banner Darurat: Susunan horizontal dengan nomor kontak berukuran display.
  - Grid Organisasi: 2 kolom `gap-6`.
- **Desktop (1280px):**
  - Layout: `md:pl-[108px] pr-8 py-10 max-w-[1240px] mx-auto`.
  - Banner Utama: `rounded-[24px]` melintang penuh dengan teks penenang dan tombol dialer instan.
  - Grid Organisasi: 3 kolom sejajar (`grid-cols-3 gap-6`) menampilkan mitra resmi.
  - Bagian Panduan: Komposisi split 2 kolom (sisi kiri protokol pertolongan pertama, sisi kanan etika saling menjaga).

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Tinta & Tipografi:** `text-brown-900` (`#3B2A20`) untuk judul berwibawa, `text-brown-700` (`#5A4636`) untuk narasi panduan, `text-brown-900/60` untuk nomor registrasi layanan.
- **Aksen Kehangatan & Perlindungan:**
  - `bg-orange-500` / `hover:bg-orange-600` untuk tombol panggilan darurat primer (kontras tajam dan mudah dikenali).
  - `bg-green-100` / `text-green-700` untuk badge layanan 24 Jam & Bebas Pulsa.
  - `border-brown-900/15` untuk garis batas taktil kertas.
- **Peringatan Warna Bahaya:** Dilarang menggunakan merah `danger` untuk kartu darurat; merah hanya digunakan untuk status koneksi terputus.

---

## 5. Komponen Kunci & Hirarki Radius

1. **Primary Crisis Lifeline Anchor (Sejiwa 119 ext. 8):**
   - Radius: `rounded-[24px]` (Major Sanctuary Anchor).
   - Container: `border-2 border-brown-900/20 bg-cream p-6 sm:p-8 shadow-sm`.
   - Ikon: Lucide `HeartHandshake` stroke 2px warna Brown 900.
   - Tombol Panggilan: Pill `rounded-full bg-orange-500 text-white min-h-[48px] px-8 text-base font-bold`.
2. **Directory Cards (Organisasi Mitra Terpercaya):**
   - Radius: `rounded-[20px]`.
   - Container: `border border-brown-900/10 bg-white/95 p-6 shadow-xs hover:border-brown-900/25 transition-all`.
   - Tombol Kontak: `rounded-full` pill sekunder `bg-brown-900 text-cream` atau `bg-green-100 text-green-800`.
3. **Psychological First Aid Accordion / Steps:**
   - Radius: `rounded-xl` (12px) untuk setiap langkah panduan interaktif.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Seluruh kontak darurat dan panduan tampil utuh, tombol telepon dapat diklik langsung membuka aplikasi telepon perangkat.
2. **Loading:** Kerangka skeleton kertas lembut memuat kartu kontak darurat tanpa pergeseran layout.
3. **Empty:** Tidak relevan (konten rujukan statis dan selalu tersedia).
4. **Active:** Mengklik langkah teknik napas atau panduan mandiri memperluas instruksi visual secara halus.
5. **Error:** Jika status jaringan terputus, nomor telepon penting tetap ditampilkan dari cache statis lokal agar pengguna tidak kehilangan akses nomor kontak darurat.
6. **Crisis:** Halaman ini adalah tujuan utama saat sistem mendeteksi krisis emosional pengguna dari fitur chat atau jurnal.

---

## 7. Interaksi & Motion

- **Akses Seketika:** Tombol `tel:` dan `https://wa.me/` langsung memicu intent bawaan OS tanpa jeda dialog konfirmasi yang memperlambat pertolongan.
- **Transisi Akordeon:** Langkah panduan mandiri membuka perlahan dengan transisi tinggi 200ms `ease-out`.
- **Reduced Motion:** Saat mode reduced motion aktif, akordeon membuka instan tanpa animasi pergeseran.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Target Sentuh:** Seluruh tombol dialer dan tautan kontak memiliki area sentuh minimal 48 x 48px untuk kemudahan akses saat tangan gemetar atau panik.
- **Label Aksesibilitas:** Tombol telepon memiliki `aria-label="Panggil Hotline Bebas Pulsa Sejiwa 119 Ekstensi 8"`.
- **Kontras:** Nomor telepon darurat menggunakan Manrope tebal 24px warna Brown 900 dengan rasio kontras 11.2:1 terhadap latar cream.
- **Keyboard Navigation:** Seluruh nomor kontak dapat diakses dengan tombol Tab dan diaktifkan dengan Enter.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- Mengimpor langsung konstanta `CRISIS_RESOURCES` dari `src/lib/crisisDetection.ts`.
- Mendukung tautan keluar aman:
  - Sejiwa: `tel:119,8`
  - Hotline LISA: `tel:08113855472`
  - Yayasan Pulih: `https://wa.me/628118436633`
- Tidak ada autentikasi yang diwajibkan untuk membuka `/guidebook`.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Kontak darurat Sejiwa 119 ext. 8 ditampilkan secara menonjol di bagian atas halaman.
- [ ] Tautan `tel:` memicu aplikasi telepon pada perangkat mobile dan desktop yang mendukung dialer.
- [ ] Tidak ada penggunaan warna merah alarm yang menakutkan pengguna.
- [ ] Panduan mandiri (Teknik Grounding 5-4-3-2-1) tersedia dan dapat dibaca dengan jelas.
- [ ] Halaman dapat diakses tanpa login dan mematuhi standar aksesibilitas WCAG AAA untuk nomor telepon darurat.
