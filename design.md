# ZYBA Design Authority (design.md)

<!-- impeccable:design-schema 1 -->

> **Otoritas Desain Gabungan**: Master Design System (UI/UX Pro Max) + Product Context (Impeccable) + Taste Art Direction.  
> **COLOR PALETTE TERKUNCI**: Bagian warna pada dokumen ini 100% identik dengan `design-system/PALETTE_LOCK.md`. Dilarang mengubah nilai hex.

---

## 1. Direction (Arah Visual)

### Konsep Inti: "Sanctuary of Warmth & Quiet Clarity" (Ruang Teduh & Kejernihan Hening)
ZYBA adalah tempat perlindungan digital bagi pengguna yang membutuhkan ketenangan emosional. Antarmuka ZYBA menghindari tampilan dingin aplikasi medis konvensional maupun kehebohan visual aplikasi sosial media biasa.
- **Karakter Visual**: Ruang yang luas (*generous calm whitespace*), sudut melengkung organik yang lembut (*rounded pill & gentle curves*), sentuhan warna bumi hangat (*warm cream, earthy brown, sage green, soft terracotta*), dan kontras yang ramah di mata.
- **Satu Ide Visual**: "Buku Harian yang Berbicara Lembut" (*A softly spoken sanctuary*). Setiap layar terasa seperti membuka lembaran buku catatan berkualitas dengan tata letak lapang, tipografi tenang, dan tanpa interupsi visual yang agresif.

---

## 2. Locked Color Palette (PALETTE_LOCK.md)

| Token Semantik | Token Nama | Canonical Hex | Kelas Tailwind | Keterangan |
|---|---|---|---|---|
| Background Utama | Cream | `#F7F2E7` | `bg-cream` | Kanvas utama seluruh antarmuka |
| Kartu / Panel Konten | White Soft | `#FFFFFF` | `bg-white` | Surface kartu utama (opacity 85-100%) |
| Teks Utama / Judul | Brown 900 | `#3B2A20` | `text-brown-900` | Headings, teks terbaca tinggi |
| Teks Sekunder / Label | Brown 700 | `#5A4636` | `text-brown-700` | Keterangan, timestamp, panduan |
| Aksi Utama / Vital | Orange 500 | `#F2884B` | `bg-orange-500` | CTA hangat, submit, badge aktif |
| Aksen Positif / Sehat | Green 500 | `#8FAE5D` | `bg-green-500` | Status sehat, tombol sekunder |
| Kartu Aksen Lembut | Green 100 | `#E4EED2` | `bg-green-100` | Surface kartu rileks, nav aktif |
| Kartu Aksen Hangat | Orange 100 | `#FCE3D3` | `bg-orange-100` | Surface catatan hangat, badge tag |
| Border Halus | Border Subtle | `rgba(59, 42, 32, 0.10)` | `border-brown-900/10` | Garis pemisah organik |
| Focus Ring | Focus Warm | `rgba(242, 136, 75, 0.40)` | `ring-orange-500/40` | Status keyboard navigable |
| Aksi Destruktif | Danger | `#D9534F` | `bg-danger` | Khusus delete akun/post |

### Mood Tokens
- `mood-depressed`: `#A99BE0` (Lavender teduh)
- `mood-sad`: `#EE8A5E` (Terracotta lembut)
- `mood-neutral`: `#6B5645` (Earthy brown)
- `mood-happy`: `#E8C24A` (Golden warm)
- `mood-overjoyed`: `#8FAE5D` (Olive sage)

---

## 3. Tipografi & Hirarki

- **Display & Headings**: `Manrope` (`font-display`, sans-serif)
  - Display Page Title: `font-display text-2xl sm:text-3xl font-bold text-brown-900 tracking-tight`
  - Section Headings: `font-display text-lg sm:text-xl font-semibold text-brown-900`
  - Card Titles: `font-display text-base font-semibold text-brown-900`
- **Body & Controls**: `DM Sans` (`font-body`, sans-serif)
  - Paragraph: `font-body text-sm sm:text-base text-brown-700 leading-relaxed`
  - Controls & Buttons: `font-body text-sm font-semibold tracking-wide`
  - Micro-copy / Meta: `font-body text-xs text-brown-700/80`

---

## 4. Pola Navigasi & Alur Terstandarisasi

Struktur alur navigasi aplikasi (`Sidebar.tsx` & `MobileBottomNav.tsx`):
1. **Dashboard** (`/dashboard`)
2. **Mood Check-In** (`/daily-assessment`)
3. **Tanya Zyba** (`/companion`)
4. **Kegiatan Rutin** (`/activity`)
5. **Ruang Sehat** (`/wellness-journey`)
6. **Komunitas Zyba** (`/community`)
7. **Wawasan** (`/resources`)

Navigasi sekunder:
- **Pencapaian** (`/achievements`)
- **Buku Panduan** (`/guidebook`)
- **Analisis Mendalam** (`/settings/zyba-plus/insights`)

---

## 5. Aturan Komponen & Interaksi

1. **Button Primer**: Bentuk `rounded-pill` dengan latar `bg-brown-900 text-cream` atau `bg-orange-500 text-white`, transisi `150ms ease-out`, micro-scale halus saat aktif (`active:scale-[0.99]`).
2. **Button Sekunder**: `bg-green-100 text-brown-900 hover:bg-green-100/80 rounded-pill`.
3. **Card Container**: `rounded-3xl bg-white/90 border border-brown-900/10 shadow-sm p-6 sm:p-7`. Tidak ada kartu bersarang di dalam kartu tanpa fungsi nyata.
4. **Input Field**: `rounded-2xl bg-white/90 border border-brown-900/15 focus:ring-2 focus:ring-orange-500/30 text-brown-900`.
5. **Aksesibilitas & Ketenangan**:
   - Rasio kontras teks minimal 4.5:1.
   - Fokus keyboard jelas di setiap interaktif: `focus-visible:ring-2 focus-visible:ring-orange-500/40`.
   - Mengganti seluruh emoji yang berfungsi sebagai ikon tombol/navigasi dengan ikon SVG garis halus (`lucide-react`).
   - Patuh pada `prefers-reduced-motion: reduce`.

