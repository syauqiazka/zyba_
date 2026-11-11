# Buku Panduan & Bantuan Mockdoc — Crisis Directory & Sanctuary Guide (`/guidebook`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/guidebook`  
> **Source Components:** `src/app/guidebook/page.tsx`, `src/lib/crisisDetection.ts`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna yang sedang mengalami krisis emosional mendalam, kerabat yang ingin membantu teman yang sedang terpuruk, atau pengguna baru yang ingin memahami tata krama di dalam ZYBA.
- **Mental Model:** *"Membuka lembaran peta darurat dan panduan ramah yang tertata rapi di sudut ruangan, mengetahui persis siapa yang bisa dihubungi saat situasi genting, dan merasa terlindungi."*
- **Primary Job to Be Done (JTBD):** Menyediakan daftar kontak hotline darurat resmi 24/7 (bebas pulsa Sejiwa 119 ext. 8, Yayasan Pulih, LISA, Into The Light), panduan pertolongan pertama psikologis mandiri (*Psychological First Aid*), dan etika menjaga kehangatan komunitas.
- **Data & API Binding:**
  - Sumber Kebenaran Krisis: `CRISIS_RESOURCES` di `src/lib/crisisDetection.ts`.
  - Akses Langsung: Tombol `tel:` dan tautan WhatsApp resmi tanpa memerlukan form login.

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Emergency Beacon in Quiet Earth*.
- **Antitesis Warna Alarm Merah Bahaya:** Menolak penggunaan warna merah menyala yang menakut-nakuti atau membuat panik pengguna dalam kondisi krisis. Menggunakan kanvas Cream (`#F7F2E7`), kartu berlatar putih bersih dengan garis batas tegas `border-brown-900/20`, ikon `HeartHandshake` pekat, dan tombol panggilan Warm Orange (`#F2884B`) yang kontras dan jelas terlihat.
- **Nada Bicara:** Menenangkan, berwibawa, penuh perlindungan, dan cepat tanggap.
  - Heading: *"Kamu tidak harus memikul semua ini sendirian."*
  - Subtitle: *"Bantuan profesional selalu siaga untuk mendengarkan dan mendampingimu melewati masa-masa terberat."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): 12-Column Guidebook Spread**
  - Spacing Layout: `md:pl-[108px] pr-8 py-8 max-w-[1240px] mx-auto`.
  - Section Atas: **Primary Crisis Lifeline Anchor Card** (`col-span-12`, `rounded-[24px]`).
  - Section Bawah: **Grid Organisasi Bantuan 3 Kolom** (`grid-cols-3 gap-6`).
- **Tablet (768px – 1023px):**
  - Grid 2 kolom berjarak `gap-6`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Tata Letak: Banner darurat utama di bagian paling atas dengan tombol telepon besar mudah diketuk (tinggi $\ge 48\text{px}$).

---

## 4. Component Specifications (pbakaus/impeccable)

### A. Primary Crisis Lifeline Anchor (Sejiwa 119 ext. 8)
- Container: `bg-cream rounded-[24px] border-2 border-brown-900/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm mb-8`
- Identitas Hotline:
  - Ikon: Lucide `HeartHandshake` stroke 2px warna Brown 900 (ukuran 36px)
  - Nama Layanan: `font-display text-xl sm:text-2xl font-extrabold text-brown-900` (*"Layanan Sejiwa 119 Ekstensi 8"*).
  - Penyelenggara: `font-body text-xs font-bold uppercase tracking-wider text-brown-700/80 mt-1` (*"Kemenkes RI & HIMPSI — 24 Jam Bebas Pulsa"*).
  - Keterangan: `font-body text-sm text-brown-700 leading-relaxed max-w-xl mt-2`
- Tombol Panggilan Darurat:
  - Styling: `inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-500/90 text-white px-7 py-3 text-sm font-bold shadow-xs transition-all min-h-[48px] cursor-pointer`
  - Aksi: `href="tel:119,8"` (membuka dialer telepon ponsel secara instan).

### B. Directory Cards (Organisasi Mitra Terpercaya)
- Container: `bg-white/95 rounded-[20px] border border-brown-900/10 p-6 flex flex-col justify-between shadow-xs hover:border-brown-900/25 transition-all`
- 3 Mitra Resmi:
  1. **Layanan LISA (Love Inside Suicide Awareness):** Konseling krisis multibahasa (Indonesia & Inggris).
  2. **Into The Light Indonesia:** Edukasi pencegahan bunuh diri dan panduan pendampingan sebaya.
  3. **Yayasan Pulih:** Pemulihan trauma psikologis dan kekerasan berbasis gender.
- Action Link: Tombol sekunder `bg-green-100 hover:bg-green-100/80 text-brown-900 rounded-full px-4 py-2 text-xs font-semibold text-center mt-4`

### C. Psychological First Aid Guide (Langkah Mandiri)
- Container: `bg-white/90 rounded-[20px] border border-brown-900/10 p-6 mt-8`
- Judul: `font-display text-lg font-bold text-brown-900 mb-4` (*"Langkah Sederhana Menstabilkan Diri Saat Panik"*)
- 3 Langkah Mikro:
  1. *Sentuh Permukaan Dingin (Grounding)* — Letakkan telapak tangan di atas meja atau basuh wajah dengan air sejuk.
  2. *Metode Napas 4-7-8* — Tarik napas 4 detik, tahan 7 detik, hembuskan perlahan 8 detik.
  3. *Hubungi Sahabat Tepercaya* — Kirim pesan singkat atau buka Tanya Zyba untuk merilis emosi.

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Guidebook Open** | Pengguna membuka `/guidebook` | Seluruh nomor darurat dan panduan tampil jelas | Ketuk nomor telepon darurat jika butuh |
| **Call Initiated** | Pengguna menekan tombol Sejiwa 119 | Sistem operasi membuka aplikasi dialer telepon | Lakukan panggilan darurat |
| **Offline Mode** | Tidak ada koneksi internet | Halaman tetap dapat dibaca karena nomor hotline disimpan lokal | Nomor telepon tetap bisa dihubungi |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`HeartHandshake`, `Phone`, `Shield`, `HeartPulse`, `ExternalLink`).
- [x] **Zero Alarm Red Slop:** Tidak ada background merah membara yang memperburuk kondisi kecemasan pengguna.
- [x] **No Card Inception:** Kartu hotline berdiri mandiri dalam kanvas Cream.
- [x] **Hierarki Radius:** Emergency Anchor 24px, Mitra Cards 20px, Guidance Box 20px, CTA Buttons 9999px.
- [x] **Accessible Contrast:** Teks keterangan 11.2:1 (AAA), nomor telepon darurat kontras tinggi.

---

## 7. Verification Contract (obra/superpowers)

- **Hotline Phone Integrity:** Tombol panggil darurat diverifikasi memiliki atribut `href="tel:119,8"` yang valid.
- **Contract Test Command:**
  ```powershell
  npm run build
  ```

