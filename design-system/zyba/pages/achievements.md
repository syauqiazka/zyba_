# Pencapaian Hening Mockdoc — Quiet Milestones & Hearth Badges (`/achievements`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/achievements`  
> **Source Components:** `src/app/achievements/page.tsx`, `src/app/achievements/BadgePickerModal.tsx`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna Gen Z yang merawat kesehatan batin secara perlahan, lelah terhadap perlombaan produktivitas toksik, dan membutuhkan pengakuan hening atas usaha kecil merawat diri sendiri tanpa paksaan kompetisi.
- **Mental Model:** *"Menyimpan kerikil halus di dalam saku kain, menandai setiap langkah kecil keberanian untuk hadir dan bernapas."*
- **Primary Job to Be Done (JTBD):** Memberikan apresiasi atas konsistensi hadir, latihan relaksasi, dan refleksi jurnal, serta memungkinkan pengguna menyematkan hingga 3 lencana utama pada profil pribadi (*Showcase Badges*).
- **Prinsip Anti-FOMO Mutlak:** Dilarang menggunakan *Leaderboard* (papan peringkat publik), bilah XP game arcade, atau perbandingan skor antar pengguna yang memicu inferioritas dan kecemasan sosial.

---

## 2. Perubahan dari v1

- **Dihapus:** Elemen trophy logam mengkilap, aksen glow neon, dan label streak api merah yang menekan.
- **Dihapus:** Penggunaan `rounded-[32px]` seragam pada seluruh kontainer kartu lencana.
- **Baru:** Format lencana kepingan tembikar organik (*Terracotta*, *Olive Sage*, *Warm Brass*) dengan garis halus Lucide stroke 1.8px.
- **Baru:** Dukungan penyematan fleksibel hingga 3 lencana aktif ke profil dengan modal pemilihan interaktif (*BadgePickerModal*).
- **Baru:** Kartu pencapaian dengan hierarki radius terstruktur (`rounded-[24px]` showcase banner, `rounded-[20px]` kartu grid, `rounded-xl` milestone step).
- **Alasan:** Menyelaraskan filosofi *Tactile Sanctuary*, menghilangkan tekanan gamifikasi arcade, dan memberikan ketenangan visual yang menghargai setiap proses pemulihan batin secara autentik.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-4 pt-4 pb-24`.
  - Header: Judul editorial ringkas dengan ringkasan lencana terbuka.
  - Showcase: 1 kartu banner ringkas memuat 1–3 lencana tersemat horizontal dengan tombol ganti cepat.
  - Grid Lencana: 2 kolom sentuh empuk `gap-3.5 sm:gap-4`.
  - Navigasi: Ergonomic Bottom Pill Nav di bagian bawah.
- **Tablet (768px):**
  - Layout: `md:pl-[108px] pr-6 py-8 max-w-[1000px] mx-auto`.
  - Navigasi: Floating Zen Dock di sisi kiri (`w-[76px]`).
  - Showcase: Kartu horizontal memanjang dengan preview profil dan detail lencana aktif.
  - Grid Lencana: 3 kolom `gap-5`.
- **Desktop (1280px):**
  - Layout: `md:pl-[108px] pr-8 py-10 max-w-[1240px] mx-auto`.
  - Header: Editorial split 65:35 — sisi kiri narasi kehangatan, sisi kanan ringkasan total lencana terkumpul.
  - Showcase: Banner utama `rounded-[24px]` berlatar `bg-orange-100/60` dengan 3 slot tembikar interaktif.
  - Grid Lencana: 4 kolom `grid-cols-4 gap-6`.

---

## 4. Token Visual yang Digunakan

- **Kanvas & Latar:** `bg-cream` (`#F7F2E7`), kartu utama `bg-white/95`, kartu terkunci `bg-white/60`.
- **Tinta & Teks:** `text-brown-900` (`#3B2A20`) untuk judul display, `text-brown-700` (`#5A4636`) untuk narasi deskripsi, `text-brown-900/50` untuk meta tanggal terbuka.
- **Aksen Tembikar:**
  - Terracotta: `#EE8A5E` / `bg-orange-100` / `text-orange-500` (kehangatan kehadiran).
  - Sage: `#8FAE5D` / `bg-green-100` / `text-green-700` (latihan napas & ketenangan).
  - Brass: `#E8C24A` / `bg-amber-100` / `text-amber-800` (refleksi mendalam & kejujuran rasa).
- **Border & Separator:** `border-brown-900/10` (kontak kertas taktil).

---

## 5. Komponen Kunci & Hirarki Radius

1. **Active Showcase Banner:**
   - Radius: `rounded-[24px]` (Major Anchor).
   - Container: `border border-orange-500/20 bg-orange-100/60 p-6 sm:p-7 shadow-xs`.
   - Menampilkan hingga 3 slot lencana tersemat dengan tombol buka `BadgePickerModal`.
2. **Milestone Badge Card:**
   - Radius: `rounded-[20px]`.
   - Container: `border border-brown-900/10 bg-white/95 p-5 text-center transition-all hover:border-brown-900/25 shadow-xs`.
   - Ikon kepingan tembikar 64px dengan lambang Lucide 28px stroke 1.8px.
   - Status terkunci: Opasitas 55%, ikon gembok kecil, bilah progres mikro `h-1.5 bg-brown-900/10 rounded-full`.
3. **Badge Picker Modal:**
   - Radius: `rounded-[24px]` pada desktop/tablet, bottom-sheet `rounded-t-[24px]` pada mobile.
   - Tombol Aksi: `rounded-full` pill primer `bg-brown-900 text-cream`.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Menampilkan banner showcase terisi, lencana yang terbuka dengan warna tembikar hangat, dan lencana terkunci dengan indikator progres lembut.
2. **Loading:** Skeleton shimmer bernuansa kertas lembut pada 1 banner showcase dan 8 grid kartu lencana (`bg-brown-900/5 animate-pulse rounded-[20px]`).
3. **Empty:** Apabila pengguna baru pertama kali bergabung dan belum membuka lencana, tampilkan kartu sambutan *"Langkah Pertamamu"* dengan tombol pintas menuju Check-In Hari Ini.
4. **Active:** Interaksi klik pada kartu lencana membuka drawer/modal detail narasi lencana beserta tanggal perolehan dan opsi sematkan ke profil.
5. **Error:** Banner kesalahan jaringan lembut dengan tombol *"Coba Muat Ulang"* tanpa menghilangkan navigasi Zen Dock.
6. **Crisis:** Jika pengguna memicu indikasi krisis saat bernavigasi, tampilkan Crisis Floating Banner hening di atas halaman dengan kontak Sejiwa 119 ext. 8.

---

## 7. Interaksi & Motion

- **Sentuhan Halus:** Hover pada kartu lencana memberikan elevasi lembut (`-translate-y-0.5 shadow-sm`) dengan durasi 200ms `ease-out`.
- **Badge Equip Animation:** Saat lencana berhasil disematkan, slot showcase memancarkan denyut kehangatan lembut (skala 1.02 ke 1.00) tanpa partikel confetti norak.
- **Modal Transition:** Fade backdrop `bg-brown-900/40 backdrop-blur-xs` dengan slide-up halus 240ms.
- **Reduced Motion:** Hormati `prefers-reduced-motion: reduce` dengan menonaktifkan translasi posisi dan menyederhanakan transisi ke perubahan opasitas instan.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Rasio Kontras:** Teks utama Brown 900 pada kanvas Cream mencapai kontras 11.2:1 (melampaui WCAG AAA). Teks sekunder Brown 700 mencapai kontras 6.4:1 (WCAG AA).
- **Akses Keyboard:** Setiap kartu lencana dan slot penyematan dapat difokuskan dengan tombol `Tab` dan diaktifkan dengan `Enter`/`Space`.
- **Focus Ring:** Fokus tampak tegas dengan cincin `focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2`.
- **Screen Reader:** Progres lencana diumumkan secara semantik menggunakan `role="progressbar"` dan `aria-valuenow`.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- **GET `/api/achievements`**:
  - Response: `{ badges: Badge[], userBadges: UserBadge[], equippedBadgeIds: string[] }`.
  - Model Prisma: `Badge` (`id`, `slug`, `title`, `description`, `category`, `iconName`), `UserBadge` (`id`, `userId`, `badgeId`, `unlockedAt`, `isEquipped`).
- **POST `/api/achievements/equip`**:
  - Request Body: `{ badgeIds: string[] }` (maksimal 3 id lencana).
  - Response: `{ success: true, equippedBadgeIds: string[] }`.
- **Tidak ada modifikasi skema database atau kontrak API endpoint.**

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Lencana yang telah terbuka menampilkan tanggal pembukaan dan status kepemilikan yang valid.
- [ ] Pengguna dapat memilih dan menyimpan hingga 3 lencana untuk disematkan pada profil pribadi via modal.
- [ ] Tidak ada leaderboard publik, kalkulasi level kompetitif, atau grafis trofi arcade generik.
- [ ] Komposisi responsif berjalan mulus pada 375px (2 kolom), 768px (3 kolom), dan 1280px (4 kolom).
- [ ] Seluruh kartu mematuhi skala radius proporsional (tanpa `rounded-[32px]`).
- [ ] Status keyboard traversal dan focus ring terverifikasi penuh di seluruh elemen interaktif.
