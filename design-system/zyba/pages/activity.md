# Smart Activity Planner Mockdoc — Gentle Daily Rhythm (`/activity`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/activity`  
> **Source Components:** `src/app/activity/page.tsx`, `src/app/activity/components/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Gen Z yang merasa lelah secara fisik dan mental, terjebak dalam rasa bersalah karena merasa tidak cukup produktif, atau membutuhkan pemulihan tubuh yang lembut tanpa tekanan fitnes berat.
- **Mental Model:** *"Melangkah ke kebun hijau yang sejuk, menarik napas lega, dan melakukan satu peregangan kecil yang membuat tubuh terasa lebih ringan."*
- **Primary Job to Be Done (JTBD):** Menyediakan latihan relaksasi pernapasan terpandu (metode 4-7-8), menyusun 2–3 rencana aktivitas fisik mikro harian yang fleksibel, dan memvalidasi kondisi tubuh tanpa penilaian performa toksik.
- **Data & API Binding:**
  - Prisma Models: `ActivityLog` (`title`, `category`, `durationMin`, `completed`, `date`)
  - Endpoints: `GET /api/activities/today`, `POST /api/activities/complete`, `POST /api/activities/custom`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Green Herb Garden*.
- **Kanvas & Palet Vitalitas:** Kanvas Cream (`#F7F2E7`) berpadu Green 100 (`#E4EED2`) untuk latar kartu latihan pernapasan, Green 500 (`#8FAE5D`) untuk checkmark pemulihan, dan Orange 100 (`#FCE3D3`) untuk kartu energi matahari.
- **The Breathing Circle (Taman Bernapas):**
  - Lingkaran konsentris bernapas organik (diameter 180px di desktop, 150px di mobile) dengan kurva lembut yang membesar saat tarik napas (4 detik), menahan napas (7 detik), dan menyusut lembut saat buang napas (8 detik).
- **Nada Bicara:** Menenangkan, membumi, dan tidak menuntut.
  - Heading: *"Tubuhmu adalah rumahmu. Berikan ia ruang untuk beristirahat sejenak."*
  - Subtitle: *"Tidak ada target kalori atau jarak tempuh di sini. Cukup hadir dan gerakkan tubuh semampumu."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Sanctuary Grid**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Kolom Kiri (`col-span-7`): **Breathing Exercise Garden** (kartu interaktif utama) + **Daily Condition Insight**.
  - Kolom Kanan (`col-span-5`): **Gentle Daily Plan** (daftar aktivitas mikro) + **Zyba Recommendations**.
- **Tablet (768px – 1023px):**
  - Spacing Layout: `pl-[96px] pr-6 py-6`.
  - Grid: 2 baris modular berjarak `gap-6`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Tata Letak: Latihan pernapasan di bagian atas, diikuti daftar aktivitas dalam kartu sentuh lapang.

---

## 4. Component Specs & Tactile Micro-Interactions (pbakaus/impeccable)

### A. Major Sanctuary Anchor Card (Breathing Exercise Pavilion)
- Container: `bg-green-100/70 rounded-[24px] border border-green-500/20 p-6 sm:p-8 flex flex-col items-center shadow-xs`
- Heading: `font-display text-xl sm:text-2xl font-bold text-brown-900 mb-2`
- Breathing Circle:
  - Lingkaran Utama: `w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-white/90 border-2 border-green-500/40 flex flex-col items-center justify-center transition-transform duration-[4000ms] ease-in-out`
  - Teks Fase: `font-display text-base font-bold text-brown-900` (*"Tarik Napas"*, *"Tahan"*, *"Hembuskan"*)
  - Timer Hitung Mundur: `font-body text-xs font-semibold text-green-500 mt-1`
- Tombol Kontrol:
  - Mulai/Jeda: `bg-brown-900 text-cream hover:bg-brown-900/90 rounded-full px-6 py-2.5 text-sm font-medium mt-6 transition-all`

### B. Daily Condition Card
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-5 sm:p-6 mt-6`
- Header: `flex items-center justify-between font-display text-base font-bold text-brown-900`
- Meter Energi: Baris 4 batu energi sentuh horizontal yang menunjukkan stamina hari ini tanpa angka timbangan atau BMI.

### C. Gentle Daily Plan (Daftar Aktivitas Mikro)
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-5 sm:p-6`
- Heading: `font-display text-base font-bold text-brown-900 flex items-center justify-between`
- Kartu Aktivitas:
  - `flex items-center justify-between p-3.5 rounded-xl border border-brown-900/10 hover:border-green-500/30 hover:bg-green-100/20 transition-all cursor-pointer`
  - Ikon: Lucide `Footprints`, `Sun`, `StretchHorizontal` stroke 1.8px.
  - Checkbox: Lingkaran sentuh `w-6 h-6 rounded-full border border-brown-900/20 checked:bg-green-500 checked:text-white`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Breathing Idle** | Pengguna membuka halaman latihan napas | Lingkaran dalam posisi diam seimbang, tombol *"Mulai Bernapas"* aktif | Tekan tombol mulai |
| **Breathing Running** | Siklus 4-7-8 sedang berjalan | Lingkaran membesar dan mengecil berirama, teks panduan berganti | Ikuti ritme napas |
| **Breathing Completed** | 4 siklus latihan selesai | Gelombang hijau lembut berkedip sekali, teks *"Tubuhmu kini lebih rileks"* | Selesai atau ulangi sesi |
| **Activity Checked** | Pengguna mencentang satu aktivitas mikro | Checkmark hijau terisi, coret tipis halus, audio pop hening | Tercatat di riwayat harian |
| **Custom Added** | Pengguna menambahkan aktivitas pribadi | Baris baru meluncur masuk dari atas tanpa reload halaman | Tersimpan di database |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`Wind`, `Footprints`, `Smile`, `CheckCircle2`, `Plus`).
- [x] **No Toxic Gamification:** Tidak ada indikator streak yang putus berwarna merah menyeramkan jika pengguna melewatkan sehari.
- [x] **No Card Inception:** Komponen aktivitas berupa list row di dalam satu kartu kontainer, bukan kartu bersarang.
- [x] **Hierarki Radius:** Breathing Anchor 24px, Activity Box 20px, Row Items 12px, Control Pills 9999px.
- [x] **Accessible Contrast:** Teks petunjuk napas 11.2:1 (AAA), label aktivitas 7.4:1 (AAA).
- [x] **Respect Reduced Motion:** Jika `prefers-reduced-motion` aktif, animasi pernapasan digantikan hitungan teks angka statis.

---

## 7. Verification Contract (obra/superpowers)

- **Breathing Timer Rigor:** Siklus 4 detik tarik, 7 detik tahan, 8 detik hembus diverifikasi secara deterministik via `setInterval` clock.
- **Activity Log Contract:** `POST /api/activities/complete` mengembalikan status log terbaru dan memperbarui state tanpa me-refresh halaman.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

