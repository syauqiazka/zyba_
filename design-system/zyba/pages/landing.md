# Gerbang Publik Mockdoc — Warm Invitation & Sanctuary Gateway (`/`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/` (Public Landing Page)  
> **Source Components:** `src/app/page.tsx`, `src/components/landing/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengunjung baru, mahasiswa, atau profesional muda Gen Z yang sedang mencari ruang aman untuk merawat kesehatan mental, fisik, dan sosialnya.
- **Mental Model:** *"Menemukan poster editorial hangat di dinding kafe tenang, membacanya sejenak, merasakan pengertian mendalam, dan memutuskan untuk melangkah masuk."*
- **Primary Job to Be Done (JTBD):** Memperkenalkan identitas ZYBA (Gen Z Wellness Support) secara transparan, menyajikan 4 pilar sanctuary utama, mendemonstrasikan data pasar kredibel (dari riset resmi pitch deck), dan mengarahkan pengunjung untuk masuk/daftar via `/onboarding`.
- **Riset Pasar Kredibel (Pitch Deck Resmi — Bukan Angka Karangan):**
  - **74,9 Juta:** Populasi Gen Z di Indonesia yang menghadapi fase transisi krusial.
  - **81,1%:** Generasi muda yang pernah mencurahkan isi hati kepada AI namun mendambakan respons yang lebih empatik dan aman.
  - **3 Dimensi:** Kesejahteraan holistik terpadu (Mental, Fisik, dan Sosial).
- **Data & API Binding:**
  - Halaman publik murni (Static Site Generation / ISR), tidak memerlukan cookie autentikasi untuk dibuka.

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Sunlight on Warm Linen*.
- **Antitesis Dark Mode SaaS Kuno:** Menolak template landing page teknologi generik (latar hitam pekat, gradient ungu-cyan, kartu mengkilap glassmorphism dengan efek glow berlebihan). ZYBA tampil bersahaja di atas kanvas Cream alami (`#F7F2E7`) dengan teks tinta tanah Brown 900 (`#3B2A20`), aksen Vital Green (`#8FAE5D`), dan kehangatan Orange 500 (`#F2884B`).
- **Tipografi Editorial Berwibawa:**
  - Headline Utama: `font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brown-900 tracking-tight leading-[1.15]`
  - Penekanan Warna: *"Pendamping Kesehatan Mental, <span className="text-green-500">Fisik</span>, dan <span className="text-orange-500">Sosial</span> untuk Gen Z"*
- **Nada Bicara:** Tulus, memberdayakan, tanpa klaim palsu (*"Ubah hidupmu dalam 7 hari!"* dilarang keras).

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): Max-Width 1280px Centered Layout**
  - Header: Ramping dengan logo ZYBA, menu tautan tenang (Fitur, Nilai, Komunitas), dan tombol *"Masuk / Daftar"* pill Brown 900.
  - Hero Section: Penataan terpusat dengan padding vertikal `pt-20 pb-24 px-8`.
  - Feature Grid: 4 kartu sejajar dalam 1 baris (`grid-cols-4 gap-6`).
  - Stat Row: 4 kolom angka tebal dengan garis pemisah tipis.
- **Tablet (768px – 1023px):**
  - Feature Grid: 2 kolom x 2 baris `gap-6`.
- **Mobile (< 768px):**
  - Header: Logo kiri + tombol masuk kanan (nav link disembunyikan agar bersih).
  - Spacing Layout: `px-5 pt-12 pb-20`.
  - Feature Cards: 1 kolom kartu sentuh empuk `gap-4`.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Navigation Header
- Container: `flex items-center justify-between px-6 sm:px-10 py-5 max-w-[1280px] mx-auto`
- Brand Mark: Ikon bunga 4 kelopak khas ZYBA (oranye-hijau) + teks `font-display font-bold text-xl text-brown-900`
- Navigation Links: `hidden md:flex items-center gap-8 text-sm font-medium text-brown-700 hover:text-brown-900 transition-colors`
- CTA Masuk: `rounded-full bg-brown-900 hover:bg-brown-900/90 text-cream px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all`

### B. Hero Section
- Badge Atas: `inline-block rounded-full bg-orange-100 text-orange-500 text-xs font-bold px-4 py-1.5 mb-6 border border-orange-500/20` (*"GEN Z WELLNESS SUPPORT"*)
- Subheadline: `font-body text-base sm:text-lg text-brown-700 max-w-2xl mx-auto mt-6 leading-relaxed` (*"Curhat, dapatkan pemahaman, ubah menjadi program nyata — semua dalam satu ruang aman, privat, dan bebas dihakimi."*)
- CTA Group:
  - Tombol Primer: `rounded-full bg-orange-500 hover:bg-orange-500/90 text-white px-7 py-3 text-sm font-bold shadow-xs transition-all` (*"Mulai Melangkah →"*)
  - Tombol Sekunder: `rounded-full border border-brown-900/20 hover:bg-white text-brown-900 px-6 py-3 text-sm font-medium transition-colors` (*"Kenali Fitur Sanctuary"*)

### C. Stat Row Kredibel
- Container: `grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 my-12 border-y border-brown-900/10 text-center`
- Item Stat:
  - Angka: `font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight`
  - Label: `font-body text-xs sm:text-sm text-brown-700/80 font-medium mt-1`

### D. 4 Pilar Sanctuary Cards
- Container Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-16`
- 4 Kartu:
  1. **Zyba Companion:** Ikon Lucide `MessageSquareHeart` warna Warm Orange. *"Curhat kapan saja ke kawan AI empatik yang mendengarkan tanpa menghakimi."*
  2. **Mood Check-In:** Ikon Lucide `Smile` warna Olive Sage. *"Catat cuaca batinmu, kenali polanya, dan temukan ketenangan diri."*
  3. **Smart Activity Planner:** Ikon Lucide `Wind` warna Vital Green. *"Latihan pernapasan dan gerak tubuh sederhana yang disesuaikan energimu."*
  4. **Zyba Community:** Ikon Lucide `HeartHandshake` warna Terracotta. *"Ruang berbagi cerita anonim yang suportif dan saling merangkul."*
- Card Styling: `bg-white/95 rounded-[20px] border border-brown-900/10 p-6 shadow-xs hover:border-brown-900/25 transition-all flex flex-col justify-between`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Public Visitor** | Pengguna membuka domain root `/` | Halaman landing tampil lengkap | Klik CTA daftar atau login |
| **Authenticated User** | Pengguna sudah memiliki cookie token sesi | Header menampilkan tombol *"Buka Sanctuary →"* | Masuk langsung ke `/dashboard` |
| **Mobile Menu** | Pengguna membuka di layar kecil | Tampilan navigasi bersih tanpa drawer berat yang memblokir layar | Fokus pada CTA utama |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`MessageSquareHeart`, `Smile`, `Wind`, `HeartHandshake`, `ArrowRight`).
- [x] **Zero AI Gradient Glows:** Kanvas bebas dari radial blur orbs atau lighting ungu-biru.
- [x] **Zero Fake Testimonials:** Tidak ada kutipan rekaan dengan foto stok orang asing.
- [x] **No Card Inception:** 4 kartu fitur berdiri sejajar langsung di atas kanvas Cream.
- [x] **Hierarki Radius:** Sanctuary Cards 20px, CTA Buttons 9999px, Stat Dividers 0px.
- [x] **Accessible Contrast:** Teks isi kontras 11.2:1 (AAA), tombol CTA kontras jelas.

---

## 7. Verification Contract (obra/superpowers)

- **Route Availability:** Mengunjungi `GET /` mengembalikan status 200 OK dengan HTML utuh tanpa redirect paksa ke dashboard untuk tamu belum terautentikasi.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

