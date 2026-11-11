# Tanya Zyba Mockdoc — Private Reflection Pavilion (`/companion`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/companion` (alias: `/companion/[slug]`)  
> **Source Components:** `src/app/companion/page.tsx`, `src/app/companion/components/*`, `src/hooks/useSTT.ts`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Individu yang membutuhkan kawan bicara empatik, aman, privat, dan tidak menghakimi saat mengalami kegelisahan, stres, atau overthinking.
- **Mental Model:** *"Duduk di beranda hening bersama seorang pendengar bijak yang tenang, yang mendengarkan tanpa memotong dan membantu mengurai kusutnya pikiran."*
- **Primary Job to Be Done (JTBD):** Menyediakan sesi curhat interaktif berbasis teks dan suara (`useSTT`), menyimpan riwayat percakapan secara aman, merefleksikan solusi bertahap, dan melindungi keselamatan pengguna melalui deteksi krisis otomatis (*Crisis Safety Banner*).
- **Data & API Binding:**
  - Prisma Models: `Conversation`, `Message` (`sender`, `content`, `riskLevel`, `createdAt`)
  - Endpoints: `GET /api/companion/conversations`, `POST /api/companion/chat`, `POST /api/companion/speech-to-text`
  - Realtime: HTTP Streaming / SSE untuk respons kata-per-kata yang mengalir alami (*typing rhythm*).

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Private Reflection Pavilion*.
- **Kanvas & Material:** Kanvas `bg-cream` (`#F7F2E7`), gelembung dialog bernuansa lembaran kertas halus (`bg-white/95` untuk pengguna dengan border tipis `border-brown-900/10`; dan `bg-orange-100/70` atau `bg-green-100/70` untuk Zyba Companion).
- **Tipografi Dialog:** `font-body text-sm sm:text-base text-brown-900 leading-relaxed font-normal`. Paragraf memiliki jarak bernapas yang cukup, tanpa blok teks padat yang membuat pusing.
- **Nada Emosional AI:** Hangat, tenang, sabar, bertutur dalam bahasa Indonesia alami yang santun dan empatik. Menghindari basa-basi hiperaktif khas bot AI generik ("Halo sahabat ZYBA! Wah seru banget ya!").

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): Two-Panel Sanctuary Layout**
  - **Panel Kiri (Daftar Sesi Percakapan):** Lebar 300px–320px, `rounded-[20px] bg-white/80 border border-brown-900/10 p-4 h-[calc(100vh-4rem)] flex flex-col`.
  - **Panel Kanan (Pavilion Chat Aktif):** Mengisi sisa kanvas, `rounded-[24px] bg-white/90 border border-brown-900/10 h-[calc(100vh-4rem)] flex flex-col overflow-hidden`.
  - Navigasi: Floating Zen Dock 76px di sisi kiri luar layout (`md:pl-[108px]`).
- **Tablet (768px – 1023px):**
  - Panel percakapan dapat di-toggle via sliding drawer samping. Fokus utama pada pavilion chat aktif.
- **Mobile (< 768px): Single Focused Chat Stream**
  - Header ramping dengan tombol kembali (`ArrowLeft`), tombol sesi baru, dan akses selector model.
  - Spacing: `pb-20 pt-2 px-3`.
  - Input chat menempel di atas area navigasi bawah dengan padding keyboard aman (`env(safe-area-inset-bottom)`).

---

## 4. Component Hierarchy & Tactile Micro-Interactions (pbakaus/impeccable)

### A. Crisis Safety Banner (Siaga Selalu)
- Posisi: Mengapung di bagian atas ruang chat.
- Styling: `bg-cream border border-brown-900/20 rounded-2xl p-3 sm:p-4 mb-4 flex items-center justify-between shadow-xs`
- Konten: Ikon `HeartHandshake` Lucide (1.8px), teks tenang *"Jika kamu sedang berada dalam bahaya emosional atau membutuhkan pertolongan darurat, bantuan resmi selalu tersedia."*
- CTA: Tombol telepon bebas pulsa langsung ke hotline Sejiwa 119 ext. 8 (`tel:119,8`).

### B. Chat Stream & Dialog Bubbles
- Gelembung Pengguna: `bg-white/95 text-brown-900 rounded-[20px] rounded-tr-xs p-4 border border-brown-900/10 max-w-[85%] sm:max-w-[75%] ml-auto shadow-xs`
- Gelembung Zyba: `bg-cream/90 text-brown-900 rounded-[20px] rounded-tl-xs p-4 border border-brown-900/10 max-w-[85%] sm:max-w-[75%] mr-auto shadow-xs`
- Kontrol Suara (TTS Playback): Ikon `Volume2` yang dapat disentuh langsung pada mobile (tidak disembunyikan di balik hover-only desktop).

### C. Chat Input & Micro-Interactions (Jujur & Tactile)
- Container: `p-3 sm:p-4 bg-white/95 border-t border-brown-900/10`
- **Multiline Auto-Growing Textarea:**
  - `w-full rounded-xl bg-cream/40 border border-brown-900/15 p-3 text-sm text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 leading-relaxed max-h-[180px] resize-none`
  - Interaksi Keyboard: `Enter` mengirim pesan; `Shift + Enter` membuat baris baru.
- **Speech-to-Text Nyata (`useSTT` Web Speech API):**
  - Menggunakan API bawaan peramban (`lang: "id-ID"`).
  - Tombol Mic mengaktifkan perekaman suara, menampilkan status pill mengambang *"Mendengarkan..."* + tombol *"Selesai"*.
  - Menampilkan umpan balik ramah jika izin mic ditolak atau tidak didukung peramban.
- **Tombol Lampiran Berstatus Jujur:**
  - Fitur lampiran yang belum aktif diberi penanda visual non-aktif yang jujur (`aria-disabled="true"`, `cursor-not-allowed opacity-40`) dengan tooltip penjelasan, tanpa tautan palsu.
- **Tombol Kirim:** `rounded-full bg-orange-500 hover:bg-orange-500/90 text-white w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40`

### D. Model Selector Organik (Bebas Emoji)
- Dropdown selector bersih menggunakan ikon Lucide `Sparkles`, `ChevronDown`, dan `Search`.
- Tidak ada emoji bendera atau robot di dalam menu seleksi.

### E. Granular Token Meter & Quota Indicator
- **Sistem Kuota Berbasis Token (Granular Token System):**
  - Menggantikan batas pesan kaku per-chat dengan kuota token transparan:
    - *Paket Gratis (Free):* **20.000 token / hari** (ekuivalen ~25–35 percakapan mendalam).
    - *Paket Zyba Plus:* **150.000 token / hari** (ekuivalen ~200+ percakapan mendalam dengan akses model reasoning).
- **TokenMeterBadge (Pill Interaktif di Chat Header & Input):**
  - Menampilkan persentase sisa token secara *live* (`percentRemaining%`) dan jumlah nominal tersisa (mis. `16.4k / 20k Token`).
  - Indikator warna bertingkat: Hijau lembut (`>40%`), Oranye amber (`15%–40%`), Terracotta kritis (`<15%`).
  - Popover taktil: Rincian token terpakai, batas maksimal, penjelasan transparan cara penghitungan token, dan jam reset (00:00 WIB).
- **Sidebar Meter:** Kartu ringkas sisa kuota token di atas profil pengguna pada contextual sidebar.

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi / Penanganan |
|---|---|---|---|
| **Chat Idle** | Menunggu input curhat pengguna | Textarea lapang, tombol kirim non-aktif jika kosong, persentase token terlihat | Pengguna mengetik atau menekan mic |
| **STT Listening** | Pengguna menekan tombol mikrofon | Pill hangat *"Mendengarkan..."* berdenyut pelan | Suara ditranskripsi langsung ke textarea |
| **Streaming Response** | AI menghasilkan jawaban per kata | Kursor denyut lembut di akhir kalimat | Pengguna dapat membaca secara bertahap |
| **Quota Depleted** | Pengguna menghabiskan 100% token harian | Modal *"Batas Token Hari Ini Tercapai (0% tersisa)"* muncul santun | Pilihan upgrade ke Zyba Plus (150k token) atau tunggu reset 00:00 WIB |
| **Crisis Triggered** | Pesan terdeteksi bermuatan risiko tinggi | Dialog intervensi Sejiwa 119 ext. 8 terbuka otomatis | Prioritaskan keselamatan fisik pengguna |
| **Connection Lost** | Jaringan terputus saat streaming | Pesan jeda ramah *"Koneksi terhenti sejenak"* + tombol *"Kirim Ulang"* | Simpan pesan pengguna di input buffer |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan Lucide SVG garis 1.8px (`Send`, `Mic`, `MicOff`, `Volume2`, `RotateCcw`).
- [x] **Zero Futuristic AI Slop:** Tidak ada ilustrasi robot bersinar, tidak ada efek matriks atau partikel neon biru.
- [x] **No Card Inception:** Gelembung percakapan berdiri mandiri dalam kanvas pavilion chat.
- [x] **Radius Scale Hierarchy:** Chat Window 24px, Gelembung Pesan 20px, Textarea 12px, Action Pills 9999px.
- [x] **Accessible Contrast:** Teks pesan memenuhi rasio kontras 11.2:1 (AAA) pada latar Milk White dan Cream.
- [x] **Mobile First Touch Targets:** Seluruh tombol mikrofon, kirim, dan kontrol audio berukuran $\ge 44\text{px}$.

---

## 7. Verification Contract (obra/superpowers)

- **STT Verification:** `useSTT` hook menangani `SpeechRecognition` dan `webkitSpeechRecognition` dengan graceful fallback saat tidak didukung.
- **Safety Engine Test:** Verifikasi pemanggilan `detectRisk()` pada setiap muatan `POST /api/companion/chat`.
- **Contract Test Command:**
  ```powershell
  node scripts/unit-test-ai-router.js
  ```

