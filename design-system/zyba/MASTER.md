# ZYBA Master Design System — "The Tactile Sanctuary"

> **LOGIC:** Dokumen ini adalah Master Design System hasil FASE 1 (The Architect), menggabungkan kecerdasan arsitektural `ui-ux-pro-max`, arahan seni `taste-skill` (The Tactile Sanctuary), kosakata presisi `impeccable`, metodologi rekayasa `obra/superpowers`, dan aturan kurasi `anti-slop`.
> **PAGES DIRECTORY CONTRACT:** Saat membangun halaman spesifik, selalu periksa berkas rincian di `design-system/zyba/pages/[nama-halaman].md`. Aturan pada mockdoc halaman melengkapi dan mengkhususkan aturan Master ini.
> **ATURAN MUTLAK WARNA:** Seluruh rekomendasi warna bawaan generator telah dibuang 100%. Sumber kebenaran tunggal warna terkunci adalah `design-system/PALETTE_LOCK.md`.

---

**Project:** ZYBA (Gen Z Wellness Support)  
**Direction:** Arah A — The Tactile Sanctuary (Earthy Editorial & Organic Craft)  
**Keywords:** mental health, wellness, mood tracker, calm companion, organic craft, editorial warmth, anti-slop, verifiable contracts  
**Stack:** Next.js 14 (App Router) + Tailwind CSS + Prisma ORM + Lucide React + Neon Postgres  

---

## 1. Locked Palette Matrix (Diff 0% vs PALETTE_LOCK.md)

| Token Semantic | Canonical Hex | Kelas Tailwind | WCAG AA Contrast | Karakter Penggunaan dalam "The Tactile Sanctuary" |
|---|---|---|---|---|
| **Canvas / Background** | `#F7F2E7` | `bg-cream`, `text-cream` | Base | Kanvas utama 75% layar, menyerupai kertas linen tebal alami |
| **Ink / Primary Text** | `#3B2A20` | `bg-brown-900`, `text-brown-900` | **11.2:1 (AAA)** | Teks utama, border struktur kertas, tombol komitmen primer |
| **Charcoal / Secondary** | `#5A4636` | `bg-brown-700`, `text-brown-700` | **7.4:1 (AAA)** | Teks pendukung, label domain, border halus netral |
| **Warmth Accent / CTA** | `#F2884B` | `bg-orange-500`, `text-orange-500` | **3.2:1 (Bold/Large)** | Titik fokus energi, tombol tindakan utama, highlight emosional |
| **Warmth Surface** | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | 1.15:1 | Latar kartu emosi hangat, chip tag refleksi, banner motivasi |
| **Vitality / Growth** | `#8FAE5D` | `bg-green-500`, `text-green-500` | **3.3:1 (Bold/Large)** | Indikator pemulihan batin, checkmark penyelesaian, badge |
| **Vitality Surface** | `#E4EED2` | `bg-green-100`, `text-green-100` | 1.12:1 | Latar kartu istirahat fisik & pernapasan, pill aktif navigasi |
| **Mood: Depressed** | `#A99BE0` | `bg-mood-depressed`, `text-mood-depressed` | 3.1:1 | Lavender tenang untuk duka/beban berat |
| **Mood: Sad** | `#EE8A5E` | `bg-mood-sad`, `text-mood-sad` | 3.5:1 | Terracotta lembut untuk gundah/resah |
| **Mood: Neutral** | `#6B5645` | `bg-mood-neutral`, `text-mood-neutral` | 5.8:1 | Earthy brown untuk hening/datar |
| **Mood: Happy** | `#E8C24A` | `bg-mood-happy`, `text-mood-happy` | 1.6:1 (Use dark text) | Golden sun untuk nyaman/senang |
| **Mood: Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed`, `text-mood-overjoyed` | 3.3:1 | Olive green untuk antusias/bersemangat |
| **Destructive / Danger** | `#D9534F` | `bg-danger`, `text-danger` | **4.6:1 (AA)** | **Khusus** aksi destruktif (delete akun). Dilarang untuk krisis |

---

## 2. Token Arsitektur "The Tactile Sanctuary"

### A. Tipografi (Editorial Warmth)
- **Display / Headings (`font-display`):** `Manrope`, sans-serif dengan proporsi elegan dan tracking alami.
- **Body / Antarmuka (`font-body`):** `DM Sans`, sans-serif dengan keterbacaan tinggi, leading lapang (`leading-relaxed` / 1.65–1.75), memberi ruang mata beristirahat.
- **Hierarki Skala:**
  - Hero Display: `font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brown-900 tracking-tight leading-tight`
  - Section Title: `font-display text-xl sm:text-2xl font-bold text-brown-900 tracking-normal`
  - Card Heading: `font-display text-base sm:text-lg font-bold text-brown-900`
  - Body Text: `font-body text-sm sm:text-base font-normal text-brown-700 leading-relaxed`
  - Micro / Meta: `font-body text-xs font-medium text-brown-700/80`

### B. Geometri & Bahasa Bentuk (Hierarki Radius Proporsional)
- **Floating Zen Dock / Shell Container:** `rounded-[28px]`, dermaga mengapung ramping yang menyatu lembut dengan margin layar.
- **Major Sanctuary Anchor Cards (Hero/Banner):** `rounded-[24px]`, menciptakan kanvas refleksi berwibawa tanpa sudut kaku.
- **Content Cards & Interactive Widgets:** `rounded-[20px]`, ukuran ideal kartu fungsional yang mudah dibaca.
- **Kartu Sub-modul, Row Items & Form Inputs:** `rounded-2xl` (16px) hingga `rounded-xl` (12px).
- **Elemen Kontrol, Pills & Action Buttons:** `rounded-full`, memberikan kesan pebble halus yang ergonomis.
- **Hairline Tactile Borders:** Menggantikan border tebal dengan garis kontak kertas tipis: `border border-brown-900/10` atau `border-brown-900/15`.
- **Anti-Pattern Guard:** Menolak penerapan seragam `rounded-[32px]` pada seluruh elemen. Setiap modul memiliki radius proporsional sesuai tingkat hierarkinya.

### C. Elevasi & Tekstur Material (Paper Material Depth)
- **Menolak Shadow Melayang Kaku:** Dilarang menggunakan shadow gelap tebal ala dashboard SaaS tradisional.
- **Tactile Paper Shadow:** `shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]` atau `shadow-xs`.
- **Surface Layering:** 
  1. Base: `bg-cream` (`#F7F2E7`)
  2. Main Surface: `bg-white/90 backdrop-blur-xs` bertepi `border-brown-900/10`
  3. Interactive Lift: `hover:border-brown-900/25 transition-all duration-300`

### D. Karakter Motion (Breathing Rhythm)
- **Timing:** 250ms–350ms `ease-[cubic-bezier(0.16,1,0.3,1)]` untuk gerakan mengalir alami seperti bernapas.
- **Hover Micro-Feedback:** Perubahan halus pada border dan kehangatan latar (`hover:bg-cream/60`), bukan efek scaling agresif.
- **Aksesibilitas Gerak:** Seluruh transisi dan animasi wajib mendukung `motion-reduce:transition-none` dan `motion-reduce:animate-none`.

---

## 3. Information Architecture (IA) & Alur Navigasi

```
[Onboarding: Arrival Ritual (/onboarding -> /assessment)]
          ↓
[Floating Zen Dock (Desktop) / Ergonomic Bottom Pill (Mobile)] 
    ├── 1. Dashboard (Sanctuary Overview) -> /dashboard
    ├── 2. Mood Check-In (Mindful Daily Assessment) -> /daily-assessment
    ├── 3. Tanya Zyba (Private Reflection Pavilion + Crisis Guardian) -> /companion
    ├── 4. Smart Activity Planner (Gentle Daily Rhythm) -> /activity
    ├── 5. Ruang Sehat (Holistic Wellness Journey) -> /wellness-journey
    ├── 6. Komunitas Zyba (Warm Support Circles) -> /community
    └── 7. Panduan & Wawasan (Resources & Crisis Directory) -> /resources & /guidebook
```

---

## 4. State Matrix Standard (Obra/Superpowers Taxonomy)

Setiap halaman dan komponen wajib mendukung 6 status antarmuka:
1. **Default State:** Komposisi lapang dengan data riil atau konten pembuka.
2. **Loading State:** Denyut napas lembut (*breathing pulse*): `animate-pulse duration-2000` dengan palet hangat dan microcopy puitis *"Menyiapkan ruang tenangmu..."*.
3. **Empty State:** Ilustrasi vektor garis tenang (daun tunggal / cangkir teh), tipografi hangat tidak menghakimi, dan 1 tombol aksi ramah (*"Mulai saat kamu siap"*).
4. **Active / Filled State:** Elemen input terisi dengan border kontak kertas yang lembut dan tombol komitmen aktif.
5. **Error State:** Penjelasan santun dan solutif (bukan kode error intimidatif) dengan tombol coba lagi berkontras jelas.
6. **Crisis Safety State:** Banner darurat siaga di atas chat Companion dan Panduan dengan nomor telepon langsung Sejiwa 119 ext. 8.

---

## 5. Anti-Slop Zero-Tolerance Checklist (miqdadbadjuber/anti-slop)

Sebelum mengirimkan perubahan kode atau desain:
- [ ] **Tidak ada emoji sebagai ikon:** Seluruh navigasi, indikator status, dan tombol wajib menggunakan Lucide SVG.
- [ ] **Tidak ada gradien ungu-biru / cyan glow:** Seluruh warna berakar dari palet Cream, Brown, Orange, Green, dan Mood Tokens.
- [ ] **Tidak ada kartu bersarang (card inception):** Struktur kartu hanya satu tingkat permukaan di atas kanvas Cream.
- [ ] **Tidak ada ikon dalam kotak rounded (icon-in-a-box syndrome):** Heading disajikan dengan tipografi bersih.
- [ ] **Tidak ada gamifikasi menekan:** Hearth Flame lilin konsistensi harian yang hening menggantikan api merah membara.
- [ ] **Tidak ada copy sensasional / statistik karangan:** Microcopy ramah, santun, dan menentramkan.
- [ ] **Hierarki radius berjenjang:** Tidak ada pemaksaan seragam `rounded-[32px]`.
- [ ] **Aksesibilitas penuh:** Memenuhi kontras WCAG AA $\ge 4.5:1$, keyboard focus ring `ring-orange-500/40`, target sentuh $\ge 44\text{px}$, dan `motion-reduce`.

---

## 6. Daftar Halaman Spesifik (Mockdocs)

Rincian spesifikasi mockdoc per halaman terletak di folder `pages/`:
1. `pages/dashboard.md`
2. `pages/mood-check-in.md`
3. `pages/companion.md`
4. `pages/activity.md`
5. `pages/wellness-journey.md`
6. `pages/community.md`
7. `pages/resources.md`
8. `pages/onboarding-assessment.md`
9. `pages/settings-billing.md`
10. `pages/achievements.md`
11. `pages/landing.md`
12. `pages/guidebook.md`
