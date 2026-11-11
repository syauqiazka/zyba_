# Komunitas Zyba Mockdoc — Warm Support Circles (`/community`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/community` (alias: `/community/[slug]`, `/community/profile`)  
> **Source Components:** `src/app/community/page.tsx`, `src/app/community/components/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Gen Z yang merasa terisolasi, kesepian, atau memikul beban emosional yang sulit dibagikan ke lingkaran sosial nyata karena takut dicap lemah.
- **Mental Model:** *"Duduk melingkar di ruang hangat bersama sahabat-sahabat yang saling mengerti, mendengarkan cerita tanpa prasangka, dan saling menguatkan."*
- **Primary Job to Be Done (JTBD):** Menyediakan wadah berbagi cerita anonim/pseudonim yang aman, menyaring postingan berdasarkan topik emosional, memberikan dukungan empati (*Kirim Pelukan* alih-alih like kompetitif), dan menjaga etika komunitas melalui moderasi otomatis + pelaporan santun.
- **Data & API Binding:**
  - Prisma Models: `CommunityPost`, `Comment`, `Like`
  - Endpoints: `GET /api/community/posts`, `POST /api/community/posts`, `POST /api/community/posts/[id]/hug`, `POST /api/community/report`
  - Crisis Check: Teks postingan dan komentar bebas wajib melewati `detectRisk()` sebelum diterbitkan.

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Fireplace Support Circle*.
- **Antitesis Algoritma Medsos Toksik:** Menolak feed hiruk-pikuk ala Twitter atau TikTok dengan metrik viralitas dan tombol interaksi yang memicu kecanduan dopamine. Setiap unggahan diperlakukan layaknya **Surat Refleksi Kertas** (`bg-white/95` bertepi `border-brown-900/10` dengan bayangan kontak lembut).
- **Interaksi Empatik ("Kirim Pelukan"):** Menggantikan tombol jempol / hati merah media sosial konvensional dengan tindakan empati yang tulus: ikon Lucide `HeartHandshake` atau `Heart` garis halus dengan label *"Kirim Pelukan"* (`Hug`).
- **Nada Bicara:** Hangat, santun, menjaga batas, dan penuh kasih.
  - Sapaan Kotak Tulis: *"Bagikan apa yang sedang singgah di hatimu. Komunitas ini hadir untuk merangkulmu."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 3-Column Community Spread**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Kolom Kiri (`col-span-3`): **Community Navigation & Category Filters** (Pilihan Topik: Refleksi, Hubungan, Kecemasan, Syukur).
  - Kolom Tengah (`col-span-6`): **Compose Box** + **Empathetic Stream Feed**.
  - Kolom Kanan (`col-span-3`): **Sanctuary Guidelines & Crisis Hotline Card**.
- **Tablet (768px – 1023px):**
  - 2 Kolom (Feed utama di kiri + Sidebar panduan ringkas di kanan).
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-3 pb-24`.
  - Tata Letak: Filter kategori horizontal scroll di atas, disusul tombol buat cerita mengambang ramah (`Fab`) atau kotak tulis kompak.

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Compose Box (Kotak Tulis Cerita)
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-5 shadow-xs mb-6`
- Header Tulis: Avatar lingkaran netral + label *"Berbagi sebagai: Anonim / Nama Pena"*
- Textarea: `w-full rounded-xl bg-cream/40 border border-brown-900/15 p-3.5 text-sm text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 leading-relaxed min-h-[100px] resize-none`
- Selector Tag Emosi: Deretan chip filter `rounded-full px-3 py-1 text-xs font-medium border border-brown-900/15 text-brown-700 hover:border-orange-500`
- Tombol Publikasi: `bg-brown-900 text-cream hover:bg-brown-900/90 rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer`

### B. Post Card (Surat Refleksi Kertas)
- Container: `bg-white/95 rounded-[20px] border border-brown-900/10 p-5 sm:p-6 mb-4 shadow-xs hover:border-brown-900/20 transition-all`
- Author Meta:
  - Avatar: `w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-brown-900 font-bold text-xs`
  - Nama & Waktu: `font-display text-sm font-bold text-brown-900` + `text-xs text-brown-700/60 ml-2`
  - Tag Topik: `rounded-full px-2.5 py-0.5 bg-cream text-brown-700 text-[11px] font-semibold border border-brown-900/10`
- Isi Cerita: `font-body text-sm sm:text-base text-brown-900 leading-relaxed my-3`
- Action Row:
  - Tombol Pelukan: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100/60 hover:bg-orange-100 text-orange-500 text-xs font-semibold transition-colors cursor-pointer`
  - Tombol Balasan: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-cream text-brown-700 text-xs font-medium transition-colors cursor-pointer`
  - Tombol Lapor Santun: `ml-auto text-xs text-brown-700/50 hover:text-danger transition-colors cursor-pointer`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Feed Populated** | Postingan komunitas termuat | Alur surat berjarak lega, interaksi aktif | Baca, kirim pelukan, atau balas |
| **Posting Crisis Detected** | Konten terindikasi krisis berat | Muncul dialog hangat Sejiwa 119 ext. 8; postingan ditahan | Arahkan pengguna ke bantuan resmi |
| **Hug Given** | Pengguna menekan *"Kirim Pelukan"* | Angka pelukan bertambah +1, ikon hati terisi lembut | Umpan balik haptik/halus |
| **Filtered by Tag** | Pengguna memilih tag *"Kecemasan"* | Feed menyaring daftar secara instan tanpa reload | Jelajahi cerita yang relevan |
| **Report Submitted** | Pengguna melaporkan unggahan ofensif | Postingan disamarkan seketika dengan pesan *"Terima kasih telah menjaga ruang ini"* | Postingan diajukan ke admin |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`HeartHandshake`, `MessageCircle`, `Tag`, `Flag`, `ShieldCheck`).
- [x] **Zero Toxic Vanity Metrics:** Tidak ada jumlah follower yang mencolok atau tanda centang verifikasi elitis.
- [x] **No Card Inception:** Post Card mandiri langsung di atas kanvas Cream, komentar disajikan dalam alur indented tipis.
- [x] **Hierarki Radius:** Post Card 20px, Compose Area 20px, Input Textarea 12px, Pills & Tags 9999px.
- [x] **Accessible Contrast:** Teks cerita memenuhi rasio kontras 11.2:1 (AAA) pada Milk White.
- [x] **Reduced Motion:** Animasi pembukaan thread komentar mematuhi `motion-reduce:transition-none`.

---

## 7. Verification Contract (obra/superpowers)

- **Sanitization & Safety:** Postingan diproses melalui HTML sanitizer sebelum disimpan; `detectRisk()` berjalan secara asynchronous.
- **Contract Test Command:**
  ```powershell
  node scripts/clean-and-seed-community.js
  ```

