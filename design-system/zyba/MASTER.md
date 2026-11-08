# ZYBA Design System Master File — "The Tactile Sanctuary"

> **LOGIC:** Dokumen ini adalah Master Design System hasil FASE 1 (The Architect), menggabungkan kecerdasan arsitektural ui-ux-pro-max dengan **ARAH A: The Tactile Sanctuary** (Earthy Editorial & Organic Craft).
> **ATURAN MUTLAK:** Seluruh rekomendasi warna bawaan generator telah dibuang 100%. Sumber kebenaran tunggal warna terkunci adalah `design-system/PALETTE_LOCK.md`.

---

**Project:** ZYBA (Gen Z Wellness Support)  
**Direction:** Arah A — The Tactile Sanctuary  
**Keywords:** mental health, wellness, mood tracker, calm companion, organic craft, editorial warmth  
**Stack:** Next.js 14 (App Router) + Tailwind CSS + Prisma ORM + Lucide React  

---

## 1. Locked Palette Matrix (Diff 0% vs PALETTE_LOCK.md)

| Token Semantic | Hex Code | Kelas Tailwind | Karakter Penggunaan dalam "The Tactile Sanctuary" |
|---|---|---|---|
| **Canvas / Background** | `#F7F2E7` | `bg-cream`, `text-cream` | Kanvas utama 75% layar, menyerupai kertas linen tebal alami |
| **Ink / Primary Text** | `#3B2A20` | `bg-brown-900`, `text-brown-900` | Teks utama, border struktur kertas, tombol komitmen primer |
| **Charcoal / Secondary** | `#5A4636` | `bg-brown-700`, `text-brown-700` | Teks pendukung, label domain, border halus netral |
| **Warmth Accent / CTA** | `#F2884B` | `bg-orange-500`, `text-orange-500` | Titik fokus energi, tombol tindakan utama, highlight |
| **Warmth Surface** | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | Latar kartu emosi hangat, chip tag refleksi |
| **Vitality / Growth** | `#8FAE5D` | `bg-green-500`, `text-green-500` | Indikator pemulihan batin, checkmark penyelesaian, badge |
| **Vitality Surface** | `#E4EED2` | `bg-green-100`, `text-green-100` | Latar kartu istirahat fisik & pernapasan, pill aktif |
| **Mood: Depressed** | `#A99BE0` | `bg-mood-depressed`, `text-mood-depressed` | Lavender tenang untuk duka/beban berat |
| **Mood: Sad** | `#EE8A5E` | `bg-mood-sad`, `text-mood-sad` | Terracotta lembut untuk gundah/resah |
| **Mood: Neutral** | `#6B5645` | `bg-mood-neutral`, `text-mood-neutral` | Earthy brown untuk hening/datar |
| **Mood: Happy** | `#E8C24A` | `bg-mood-happy`, `text-mood-happy` | Golden sun untuk nyaman/senang |
| **Mood: Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed`, `text-mood-overjoyed` | Olive green untuk antusias/bersemangat |
| **Destructive / Danger** | `#D9534F` | `bg-danger`, `text-danger` | **Khusus** aksi destruktif (delete akun). Dilarang untuk krisis |

---

## 2. Token Arsitektur "The Tactile Sanctuary"

### A. Tipografi (Editorial Warmth)
- **Display / Headings (`font-display`):** `Manrope`, sans-serif dengan tracking sedikit longgar (`tracking-tight` pada ukuran besar $\ge 24\text{px}$, `tracking-normal` pada ukuran sedang).
- **Body / Antarmuka (`font-body`):** `DM Sans`, sans-serif dengan keterbacaan tinggi, leading lapang (`leading-relaxed` / `1.65–1.75`), memberi ruang mata beristirahat.
- **Hierarki Skala:**
  - Hero Display: `text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brown-900 tracking-tight`
  - Section Title: `text-xl sm:text-2xl font-bold text-brown-900`
  - Card Title: `text-base sm:text-lg font-bold text-brown-900`
  - Body Text: `text-sm sm:text-base font-normal text-brown-700 leading-relaxed`
  - Micro / Meta: `text-xs font-medium text-brown-700/80`

### B. Geometri & Bahasa Bentuk (Soft Organic Curves)
- **Container Utama / Kartu Besar:** `rounded-3xl` (24px) hingga `rounded-[32px]` (32px), menciptakan siluet ramah tanpa sudut tajam.
- **Kartu Sub-modul / Input:** `rounded-2xl` (16px) hingga `rounded-xl` (12px).
- **Elemen Kontrol & Tombol:** `rounded-pill` (`rounded-full`), memberikan kesan pebble halus yang ergonomis.
- **Hairline Tactile Borders:** Menggantikan border tebal dengan garis kontak kertas tipis: `border border-brown-900/10` atau `border-brown-900/15`.

### C. Elevasi & Tekstur Material (Paper Material Depth)
- **Menolak Shadow Melayang Kaku:** Dilarang menggunakan shadow gelap tebal ala dashboard SaaS tradisional.
- **Tactile Paper Shadow:** `shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]` atau `shadow-xs`.
- **Surface Layering:** 
  1. Base: `bg-cream` (`#F7F2E7`)
  2. Main Surface: `bg-white/90 backdrop-blur-xs` bertepi `border-brown-900/10`
  3. Interactive Lift: `hover:border-brown-900/25 transition-all duration-300`

### D. Karakter Motion (Breathing Rhythm)
- **Timing:** 300ms–500ms `ease-[cubic-bezier(0.16,1,0.3,1)]` untuk gerakan mengalir alami seperti bernapas.
- **Hover Micro-Feedback:** Perubahan halus pada border dan kehangatan latar (`hover:bg-cream/60`), bukan efek scaling agresif.
- **Aksesibilitas Gerak:** Seluruh transisi dan animasi wajib mendukung `motion-reduce:transition-none` dan `motion-reduce:animate-none`.

---

## 3. Information Architecture (IA) & Alur Navigasi

```
[Onboarding: Arrival Ritual]
          ↓
[Floating Zen Dock] 
   ├── 1. Dashboard (Sanctuary Overview)
   ├── 2. Mood Check-In (Mindful Daily Assessment)
   ├── 3. Tanya Zyba (Private Reflection Pavilion + Crisis Guardian)
   ├── 4. Smart Activity Planner (Gentle Daily Rhythm)
   ├── 5. Ruang Sehat (Holistic Wellness Journey)
   ├── 6. Komunitas Zyba (Warm Support Circles)
   └── 7. Panduan & Bantuan (Resources & Crisis Hotline 24/7)
```

### Navigasi Baru: **Floating Zen Dock**
- **Desktop:** Menghilangkan sidebar 260px konvensional yang memotong kanvas secara agresif. Menggantinya dengan **Floating Zen Dock** (lebar kompak 72px–80px mengapung dengan padding tepi, berlatar `bg-white/80 backdrop-blur-md` dengan border `brown-900/10`). Memberikan ruang 85%+ untuk kanvas konten utama.
- **Mobile:** **Ergonomic Bottom Pill Nav** yang melayang nyaman di atas jempol pengguna dengan label yang jernih dan touch target $\ge 44\text{px}$.

---

## 4. Spesifikasi State

1. **Loading State:** 
   - Denyut napas lembut (*breathing pulse*): `animate-pulse duration-2000` dengan palet hangat.
   - Microcopy: *"Menyiapkan ruang tenangmu..."*
2. **Empty State:**
   - Ilustrasi vektor tipis menenangkan (cangkir teh hangat atau tanaman daun tunggal), tipografi puitis dan empatik.
   - Satu tombol tindakan yang ramah dan tidak menghakimi (*"Mulai saat kamu siap"*).
3. **Error State:**
   - Nada bicara tenang, santun, dan menentramkan. Tidak ada pesan kode error intimidatif.
   - Tombol coba lagi dengan kontras jelas.
4. **Crisis Safety State:**
   - Selalu siaga di atas chat Companion dan halaman panduan.
   - Background netral tenang `bg-cream`, garis batas tegas `border-brown-900/20`, ikon resmi `HeartHandshake`, dan tombol telepon langsung ke hotline 119 ext. 8.
