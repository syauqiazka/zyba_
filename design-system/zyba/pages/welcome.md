# Tur Sambutan Mockdoc — Welcome Carousel Tour (`/welcome`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/welcome`  
> **Source Components:** `src/app/welcome/page.tsx`, `src/app/welcome/components/WelcomeTour.tsx`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna yang baru saja menyelesaikan proses pendaftaran awal dan siap diperkenalkan dengan filosofi sanctuary serta fitur-fitur kunci ZYBA secara bertahap tanpa beban kognitif tinggi.
- **Mental Model:** *"Dipandu pelan-pelan melewati serambi paviliun, diperkenalkan pada sudut-sudut ketenangan, dan dipersilakan bernapas sejenak sebelum memulai perjalanan batin."*
- **Primary Job to Be Done (JTBD):** Memandu pengguna melalui 5 kartu tur sambutan (Filosofi Kehadiran, Zyba Companion Empatik, Check-In Rasa, Smart Activity, dan Komunitas Saling Jaga) dengan navigasi lancar dan opsi lewati yang jelas.

---

## 2. Perubahan dari v1

- **Dihapus:** Animasi lottie berlebihan, ilustrasi kartun generik, dan tombol geser yang kaku.
- **Dihapus:** Teks panjang berbelit-belit yang membuat pengguna enggan membaca.
- **Baru:** Format kartu editorial taktil berlatar linen dengan tipografi Manrope bernapas.
- **Baru:** Indikator slide berbasis *Pebble Dots* organik yang membesar lembut saat aktif.
- **Baru:** Narasi 5 slide yang ringkas, hangat, dan memfokuskan perhatian pada pemulihan diri.
- **Alasan:** Memberikan pengalaman onboarding visual yang menenangkan, berkarakter editorial, dan membangun rasa aman sejak detik pertama.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-5 py-6 flex flex-col justify-between min-h-[90vh]`.
  - Kartu Slide: Kartu tunggal berlatar `bg-white/95 border border-brown-900/10 rounded-[24px] p-6 text-center`.
  - Navigasi: Indikator titik di tengah bawah, tombol *"Lanjut"* lebar penuh.
- **Tablet (768px):**
  - Layout: Terpusat dengan lebar `max-w-[560px] mx-auto py-12 px-6`.
  - Kartu Slide: `rounded-[28px]` dengan bantalan spasi lega.
- **Desktop (1280px):**
  - Layout: Terpusat elegan dalam kontainer `max-w-[640px] mx-auto min-h-[80vh] flex flex-col justify-center px-8`.
  - Kartu Slide: Kartu editorial berbingkai taktil `rounded-[28px] bg-white/95 border border-brown-900/10 p-10 sm:p-12 shadow-sm`.
  - Aksi: Tombol ganda sejajar (Kiri: Lewati, Kanan: Lanjutkan).

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Latar Kartu:** `bg-white/95` dengan garis kontak halus `border-brown-900/10`.
- **Tinta Teks:** `text-brown-900` (`#3B2A20`) untuk judul slide, `text-brown-700` (`#5A4636`) untuk narasi panduan.
- **Aksen Titik Navigasi:**
  - Titik Aktif: `bg-orange-500 w-8 h-2 rounded-full transition-all duration-300`.
  - Titik Non-Aktif: `bg-brown-900/20 w-2 h-2 rounded-full`.
- **Tombol Aksi:** Pill `bg-brown-900 text-cream hover:bg-brown-900/90`.

---

## 5. Komponen Kunci & Hirarki Radius

1. **Tour Presentation Shell:**
   - Radius: `rounded-[28px]` (Major Sanctuary Anchor).
   - Border: `border border-brown-900/10`.
2. **Slide Visual Illustration / Emblem:**
   - Radius: `rounded-[20px]` untuk wadah lambang tembikar atau ikon representatif.
   - Ikon: Lucide SVG stroke 1.8px (Bunga ZYBA, Heart, Compass, Sparkles, ShieldCheck).
3. **Pebble Indicator Dots:**
   - Radius: `rounded-full` (8px pill memanjang dinamis).
4. **Action Buttons:**
   - Tombol Lanjut: `rounded-full` pill primer `bg-brown-900 text-cream px-8 py-3 text-sm font-semibold`.
   - Tombol Lewati: `rounded-full` teks sekunder `text-brown-700 hover:text-brown-900 text-xs font-medium`.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Menampilkan slide aktif pertama (*"Selamat Datang di Sanctuary ZYBA"*) dengan tombol navigasi siap diklik.
2. **Loading:** Transisi antar slide halus berdurasi 250ms tanpa flicker.
3. **Empty:** Tidak relevan (5 slide sambutan bersifat pasti).
4. **Active:** Pengguna dapat menggeser slide via gestur swipe pada layar sentuh atau tombol navigasi panah keyboard.
5. **Error:** Jika status progress penyimpanan lokal gagal, alur tur tetap mengizinkan pengguna melanjutkan ke langkah berikutnya.
6. **Crisis:** Tombol pintas bantuan darurat Sejiwa 119 tetap dapat diakses di bagian footer atau header jika pengguna sedang dalam krisis.

---

## 7. Interaksi & Motion

- **Carousel Slide:** Perpindahan slide menggunakan transisi horizontal halus dengan pelunakan kurva kubik `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Swipe Touch Support:** Mendukung gesture swipe kiri/kanan pada mobile dengan ambang batas jarak 50px.
- **Pebble Morph:** Titik indikator melebar dan mengecil secara plastis saat indeks slide berpindah.
- **Reduced Motion:** Saat mode reduced motion aktif, transisi pergeseran ditiadakan dan diganti dengan fade transisi 100ms.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Keyboard Traversal:** Tombol panah kiri (`ArrowLeft`) dan kanan (`ArrowRight`) dapat digunakan untuk berpindah slide.
- **ARIA Landmark:** Komponen dibungkus dalam atribut semantik `role="region" aria-roledescription="carousel"` dan `aria-label="Tur Sambutan ZYBA"`.
- **Slide Announcer:** Perubahan slide diumumkan ke screen reader via elemen tersembunyi `aria-live="polite"`.
- **Focus Ring:** Tombol navigasi dan titik slide memiliki ring fokus kontras `focus-visible:ring-2 focus-visible:ring-orange-500/60`.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- **Route Source:** `/welcome`.
- **Penyelesaian Tur:** Menyelesaikan tur atau mengklik *"Lewati"* mengarahkan pengguna ke route `/assessment` (untuk melengkapi profil dan assessment awal).
- **State Persistence:** Status `hasSeenWelcomeTour` disimpan di cookie atau local storage klien.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Tur terdiri dari 5 slide sambutan berurutan dengan judul dan deskripsi yang jelas.
- [ ] Pengguna dapat berpindah slide maju, mundur, dan langsung melompat via indikator titik.
- [ ] Tombol *"Lewati"* selalu tersedia dan mengarahkan langsung ke langkah berikutnya.
- [ ] Pada slide ke-5, tombol utama berubah menjadi *"Mulai Perjalanan"*.
- [ ] Desain terbebas dari kartun template AI atau warna ungu neon.
- [ ] Lolos pengujian responsivitas 375px, 768px, dan 1280px.
