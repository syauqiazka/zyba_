# Pencapaian Hening Mockdoc — Quiet Milestones & Hearth Badges (`/achievements`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/achievements`  
> **Source Components:** `src/app/achievements/page.tsx`, `src/app/achievements/BadgePickerModal.tsx`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna yang membutuhkan pengakuan hening atas usaha kecil merawat diri sendiri, tanpa dipaksa bersaing dengan pengguna lain.
- **Mental Model:** *"Menyimpan batu-batu kerikil kenangan di dalam saku kain, menandai setiap saat aku berhasil bertahan dan menyayangi diri sendiri."*
- **Primary Job to Be Done (JTBD):** Menampilkan lencana apresiasi konsistensi kehadiran, kebiasaan latihan napas, dan refleksi batin; memungkinkan penyematan lencana utama pada profil pribadi (*Showcase Badge*).
- **Prinsip Anti-FOMO Mutlak:** Dilarang menggunakan *Leaderboard* (papan peringkat publik) atau perbandingan skor antar pengguna yang memicu inferioritas dan kecemasan sosial.
- **Data & API Binding:**
  - Prisma Models: `Badge`, `UserBadge` (`unlockedAt`, `isEquipped`)
  - Endpoints: `GET /api/achievements`, `POST /api/achievements/equip`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Chamber of Hearth Tokens*.
- **Desain Lencana Organik:** Menolak trofi kartun emas mencolok atau pita juara kompetitif. Lencana ZYBA dirancang layaknya **Kepingan Tembikar Organik** (bentuk lingkaran batu halus bernuansa Terracotta `#EE8A5E`, Olive Sage `#8FAE5D`, dan Kuningan Hangat `#E8C24A` dengan garis ukir Lucide tipis).
- **Kanvas & Material:** Kanvas Cream (`#F7F2E7`), kartu lencana `bg-white/95` dengan border kontak tipis `border-brown-900/10`.
- **Nada Bicara:** Menghangatkan hati dan menghargai keberanian untuk bertahan.
  - Heading: *"Setiap langkah kecilmu berharga."*
  - Subtitle: *"Pencapaian di sini bukan tentang siapa yang tercepat, melainkan tentang kesediaanmu untuk kembali hadir merawat diri."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Badge Gallery**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Section Atas: **Sanctuary Milestone Banner** (Lencana aktif tersemat di profil + Ikhtisar kehadiran hening).
  - Section Bawah: **Grid Lencana 4 Kolom** (`grid-cols-4 gap-6`).
- **Tablet (768px – 1023px):**
  - Grid 3 kolom berjarak `gap-5`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Tata Letak: Grid 2 kolom sentuh empuk `gap-4`.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Active Showcase Badge Card
- Container: `bg-orange-100/60 rounded-[24px] border border-orange-500/20 p-6 sm:p-7 flex flex-col md:flex-row items-center gap-6 mb-8 shadow-xs`
- Lencana Utama: Kepingan tembikar berdiameter 72px dengan latar `#FFFFFF` dan ikon Lucide `Flame` warna Warm Orange.
- Teks Apresiasi:
  - Label: `font-body text-xs font-bold uppercase tracking-widest text-orange-500` (*"Lencana Tersemat"*).
  - Judul: `font-display text-xl font-bold text-brown-900` (*"Penjaga Nyala Hening"*).
  - Keterangan: `font-body text-sm text-brown-700 leading-relaxed` (*"Hadir mengisi check-in dan meluangkan waktu hening selama 7 hari berturut-turut."*).
- Tombol Ganti Lencana: `bg-white hover:bg-cream text-brown-900 border border-brown-900/15 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer`

### B. Badge Grid Card (Kepingan Tembikar)
- Container: `bg-white/95 rounded-[20px] border border-brown-900/10 p-5 flex flex-col items-center text-center shadow-xs hover:border-brown-900/25 transition-all group cursor-pointer`
- Token Kepingan:
  - Kondisi Terbuka (`Unlocked`): `w-14 h-14 rounded-2xl bg-cream border border-brown-900/15 flex items-center justify-center text-brown-900 shadow-xs mb-3 group-hover:scale-105 transition-transform`
  - Kondisi Terkunci (`Locked`): `w-14 h-14 rounded-2xl bg-cream/40 border border-brown-900/10 flex items-center justify-center text-brown-700/30 opacity-60 mb-3`
- Judul Lencana: `font-display text-sm font-bold text-brown-900 mb-1`
- Syarat & Status: `font-body text-xs text-brown-700/70 leading-relaxed`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Badge Unlocked** | Syarat tercapai (mis. 5x latihan napas) | Popover notifikasi lembut berbunyi *"Lencana baru singgah di sakumu"* | Buka halaman untuk melihat |
| **Badge Equipping** | Pengguna memilih lencana showcase | Modal konfirmasi pebble terbuka, lencana terpilih ter-highlight | Klik *"Sematkan di Profil"* |
| **Locked Inspected** | Pengguna mengetuk lencana terkunci | Dialog petunjuk santun menjelaskan cara membukanya | Pelajari langkah kecil yang dibutuhkan |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`Flame`, `Wind`, `Heart`, `Sparkles`, `Shield`, `Award`).
- [x] **Zero Leaderboard Slop:** Tidak ada daftar peringkat kompetisi, tidak ada persentase "kamu mengalahkan 95% user lain".
- [x] **No Card Inception:** Grid lencana teratur di atas kanvas Cream.
- [x] **Hierarki Radius:** Showcase Banner 24px, Badge Card 20px, Token Kepingan 16px, Selector Pills 9999px.
- [x] **Accessible Contrast:** Teks keterangan lencana memenuhi rasio kontras 7.4:1 (AAA).

---

## 7. Verification Contract (obra/superpowers)

- **Badge Seeding Contract:** Skrip `prisma/seed-badges.ts` menghasilkan setidaknya 12 lencana resmi dengan kunci identitas unik.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

