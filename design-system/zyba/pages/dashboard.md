# Dashboard Mockdoc — Sanctuary Overview (`/dashboard`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/dashboard`  
> **Source Components:** `src/app/dashboard/page.tsx`, `src/app/dashboard/components/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Gen Z yang baru bangun tidur, sedang rehat kuliah/kerja, atau bersiap tidur di malam hari; membutuhkan ikhtisar kondisi batin tanpa tekanan target angka.
- **Mental Model:** *"Membuka lembaran pertama jurnal harian yang tenang, melihat bagaimana kabarku hari ini, dan memulai satu niat kecil."*
- **Primary Job to Be Done (JTBD):** Memberikan evaluasi cepat kesejahteraan harian, pintu masuk check-in mood, akses kilat curhat ke Tanya Zyba, dan checklist rutinitas mikro yang tidak menghakimi.
- **Data & API Binding:**
  - Prisma Models: `User`, `MoodEntry`, `ActivityLog`, `JournalEntry`
  - Endpoint: `GET /api/user/me`, `GET /api/mood/today`, `GET /api/activities/today`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Organic Forest & Linen Spread* (Terinspirasi dari referensi visual kurasi: Deep Sage Craft Hero + Tactile Stone Pebbles + Warm Paper Right Rail).
- **Kanvas & Material:** Kanvas utama `bg-cream` (`#F7F2E7`) bertekstur kertas alami, berpadu dengan **Major Sage Craft Hero Container** (`bg-[#344638] text-cream rounded-[28px] border border-[#445B4A]`) yang memberikan nuansa ketenangan alam mendalam, dipadukan dengan panel samping kertas linen putih gading (`bg-[#FAF7F2]` / `bg-white/95 rounded-[28px] border border-brown-900/10`).
- **Komposisi Asimetris Golden Spread (68% : 32%):**
  - **Sisi Kiri (68% — Deep Sage Hero Sanctuary):**
    - Banner mikro santun: *"Setiap langkah kecil berharga. Kamu telah hadir hari ini."*
    - Sapaan hangat personal + tombol aksi hangat (*"Mulai Check-In"* / *"Lihat Asesmen"*).
    - **3 Tactile Mineral Pebble Cards:** Tiga kartu metrik kertas putih gading (`bg-[#FAF7F2] rounded-[22px]`) yang masing-masing dihiasi batu mineral alami 3D:
      1. *Ritual Konsistensi*: Batu Akik Merah / Terracotta Agate (`#EE8A5E`).
      2. *Sesi Curhat AI*: Batu Giok Hijau / Green Jade (`#8FAE5D`).
      3. *Zyba Score*: Batu Amber Madu / Tiger Eye (`#E8C24A`).
    - **Aktivitas Pekan Ini (Weekly Task Cards):** 4 sub-kartu berlatar sage pekat (`bg-[#304134] rounded-[20px]`) dengan indikator progress horizontal bar.
    - **Tanya Zyba Gateway & Stress Level Waveform.**
  - **Sisi Kanan (32% — Sanctuary Right Rail):**
    - **Tanya Zyba Specialist Card:** Status siaga 24/7 dengan tombol curhat cepat.
    - **Rutinitas Hari Ini (Today Tasks):** Checklist harian interaktif langsung dengan counter badge.
    - **Bottom Mood Check-In Banner:** Kartu terracotta hangat (`bg-orange-500 rounded-[24px] text-white`) dengan ajakan *"Check in sekarang ↗"*.
- **Nada Emosional & Copywriting:** Hangat, santun, tidak menghakimi.

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px):**
  - Navigasi: Floating Zen Dock di kiri (lebar 76px, fixed mengapung `md:left-4`, `rounded-[28px]`, `bg-white/90 backdrop-blur-md`).
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1280px] mx-auto`.
  - Grid: Asymmetric 12-column grid (`col-span-8` untuk Deep Sage Hero Sanctuary : `col-span-4` untuk Sanctuary Right Rail).
- **Tablet (768px – 1023px):**
  - Navigasi: Floating Zen Dock 76px tetap aktif dengan tooltip via React Portal.
  - Spacing Layout: `pl-[96px] pr-6 py-6`.
  - Grid: Stack vertikal berjarak lapang `gap-6`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav (tinggi 56px, `rounded-full`, floating 12px dari tepi bawah).
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Grid: 1 kolom tumpuk berurutan: Deep Sage Hero Card (Greeting + 3 Pebble Cards + Tasks) → Tanya Zyba Gateway → Right Rail Checklist & Mood Check Banner.

---

## 4. Component Hierarchy & Tailwind Specs (pbakaus/impeccable)

### A. Major Sanctuary Hero Card (Deep Sage Craft Container)
- Container: `rounded-[28px] bg-[#344638] text-cream border border-[#445B4A] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col gap-6`
- Top Micro Bar: `flex items-center justify-between pb-4 border-b border-white/10 text-xs text-cream/90`
- Greeting Bar: Avatar dengan kontrol ganti foto + `font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cream` + tombol CTA `rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs`

### B. Three Tactile Mineral Pebble Cards (`TactileMetricCards`)
- Container: `grid grid-cols-1 sm:grid-cols-3 gap-4 w-full`
- Kartu Metrik: `bg-[#FAF7F2] text-brown-900 rounded-[22px] border border-brown-900/10 p-5 shadow-xs hover:border-orange-500/40 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group`
- 3 Batu Mineral Tactile:
  - Red Agate (`type="agate"`): SVG kurva batu organik berlapis pita mineral Terracotta (`#EE8A5E`).
  - Green Jade (`type="jade"`): SVG giok hijau sutra dengan kilau spesular lembut (`#8FAE5D`).
  - Amber Quartz (`type="amber"`): SVG madu keemasan hangat dengan pantulan mineral (`#E8C24A`).

### C. Weekly Task Cards (`WeeklyTaskCards`)
- Container: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5`
- Card Item: `bg-[#304134] hover:bg-[#384c3d] border border-white/10 rounded-[20px] p-4 flex flex-col justify-between min-h-[140px] text-cream transition-all`
- Progress Bar: `w-full h-1.5 rounded-full bg-black/20 overflow-hidden` dengan bar pengisian `bg-orange-400`.

### D. Sanctuary Right Rail (`SanctuaryRightRail`)
- Container: `bg-[#FAF7F2] rounded-[28px] border border-brown-900/10 p-5 sm:p-6 shadow-xs flex flex-col gap-6`
- Tanya Zyba Specialist Box: `bg-white/90 rounded-2xl p-3 border border-brown-900/10 flex items-center justify-between`
- Rutinitas Hari Ini: List row interaktif langsung dengan checkmark circular `w-6 h-6`.
- Bottom Mood Check Banner: `bg-orange-500 rounded-[24px] p-6 text-white shadow-xs` dengan tombol *"Check in sekarang ↗"*.

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Default** | Data pengguna, mood, dan aktivitas termuat | Asymmetric layout lengkap, data terkini | Klik mood pebble / rutinitas / chat |
| **Loading** | Menunggu respon `/api/user/me` | Breathing pulse skeleton `animate-pulse duration-2000` di kanvas Cream | Layar tetap stabil tanpa layout-shift |
| **Empty** | Akun baru belum ada catatan | Kartu selamat datang lembut, ajakan *"Mari mulai langkah pertamamu"* | Klik tombol *"Isi Check-In Hari Ini"* |
| **Error** | Gagal mengambil data backend | Pesan ramah *"Ruang tenang sedang jeda sejenak"* + tombol *"Coba Segarkan"* | Klik refresh tanpa kehilangan sesi |
| **Crisis Detected** | Catatan sebelumnya mengindikasikan risiko tinggi | Banner Sejiwa 119 ext. 8 muncul di bagian atas dashboard dengan latar Cream | Tombol telepon bebas pulsa langsung |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Ikon Lucide garis 1.8px digunakan di seluruh kartu (`Sparkles`, `CheckCircle2`, `Heart`, `Compass`).
- [x] **Zero Purple/Blue AI Gradients:** Warna berakar 100% pada `#F7F2E7`, `#3B2A20`, `#F2884B`, `#8FAE5D`.
- [x] **No Card Inception:** Kartu berdiri langsung di atas kanvas `bg-cream`, tidak ada lapisan kartu bersarang.
- [x] **No Icon-in-a-box:** Heading disajikan dengan teks Manrope elegan tanpa boks kotak rounded warna-warni di atasnya.
- [x] **Anti-Slop Radius Scale:** Zen Dock 28px, Major Anchor 24px, Widgets 20px, Sub-items 12px, Buttons pill.
- [x] **Accessibility WCAG AA:** Teks utama kontras 11.2:1, teks sekunder 7.4:1, focus ring `ring-orange-500/40`.
- [x] **Reduced Motion:** Mendukung penuh `motion-reduce:transition-none motion-reduce:animate-none`.

---

## 7. Verification Contract (obra/superpowers)

- **Type Integrity:** `npx tsc --noEmit` wajib menghasilkan 0 error pada `src/app/dashboard`.
- **Render Verification:** Halaman wajib merender tanpa overflow horizontal pada viewport 375px, 768px, 1280px.
- **Contract Test Command:**
  ```powershell
  # Jalankan verifikasi build lokal
  npm run build
  ```

