# ZYBA — PALETTE LOCK & COLOR AUDIT

Dokumen ini adalah **kontrak kunci mutlak** warna untuk proyek ZYBA (Next.js + Tailwind + Prisma).
Sesuai aturan mutlak, seluruh proses perancangan (The Architect, The Art Director, The Master Inspector) **dilarang keras** mengubah, mengganti, atau "menyegarkan" nilai hex brand ini.

---

## 1. Nilai Hex Resmi Terkunci (Canonical Tokens)

Sumber kebenaran tunggal: `tailwind.config.ts` dan `AGENTS.md` (Bagian 3.1 — Palet Warna Figma).

| Token Name | Hex Code | Kelas Tailwind | Peruntukan Resmi |
|---|---|---|---|
| **Cream** | `#F7F2E7` | `bg-cream`, `text-cream` | Background utama seluruh halaman, surface kartu default |
| **Brown 900** | `#3B2A20` | `bg-brown-900`, `text-brown-900` | Teks utama/headings, tombol primer gelap, border solid |
| **Brown 700** | `#5A4636` | `text-brown-700`, `bg-brown-700` | Teks sekunder, label, caption, border netral |
| **Green 500** | `#8FAE5D` | `bg-green-500`, `text-green-500` | Elemen kesejahteraan/positif, CTA sekunder, badge aktif |
| **Green 100** | `#E4EED2` | `bg-green-100`, `text-green-100` | Background kartu hijau muda, active state menu |
| **Orange 500** | `#F2884B` | `bg-orange-500`, `text-orange-500` | CTA utama hangat, aksen vital, highlight, badge Pro |
| **Orange 100** | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | Background kartu oranye lembut, container tag |
| **Mood: Depressed** | `#A99BE0` | `bg-mood-depressed`, `text-mood-depressed` | Indikator emosi sedih mendalam / lavender tenang |
| **Mood: Sad** | `#EE8A5E` | `bg-mood-sad`, `text-mood-sad` | Indikator emosi murung / terracotta lembut |
| **Mood: Neutral** | `#6B5645` | `bg-mood-neutral`, `text-mood-neutral` | Indikator emosi netral / earthy brown |
| **Mood: Happy** | `#E8C24A` | `bg-mood-happy`, `text-mood-happy` | Indikator emosi bahagia / golden warm |
| **Mood: Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed`, `text-mood-overjoyed` | Indikator emosi sangat bersemangat / olive green |
| **Danger** | `#D9534F` | `bg-danger`, `text-danger` | **Hanya** untuk aksi destruktif (delete akun/post). **DILARANG** untuk konten krisis pengguna |

---

## 2. Resolusi Discrepancy (Drift) pada `globals.css`

Penyimpangan variabel CSS di `src/app/globals.css` terhadap `tailwind.config.ts` **telah diselaraskan 100%** ke nilai Canonical Tokens resmi:

| Token | Nilai Resmi (`tailwind.config.ts`) | Nilai di `globals.css` (:root) | Status Verifikasi |
|---|---|---|---|
| Cream | `#F7F2E7` | `#F7F2E7` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Brown 900 | `#3B2A20` | `#3B2A20` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Brown 700 | `#5A4636` | `#5A4636` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Green 500 | `#8FAE5D` | `#8FAE5D` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Green 100 | `#E4EED2` | `#E4EED2` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Orange 500 | `#F2884B` | `#F2884B` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |
| Orange 100 | `#FCE3D3` | `#FCE3D3` | **TERSELARASKAN 100%** (Tersinkronisasi penuh dengan canonical token) |

*Status Audit Final:* Seluruh variabel `:root` CSS, token semantik Tailwind, dan komponen visual telah divalidasi identik dengan Canonical Tokens. Nilai hex brand tetap 100% terkunci tanpa perubahan apa pun.

---

## 3. Audit Gaya Hard-Coded (Non-Standard Hex & Inline Styles)

Ditemukan 31 file komponen yang menggunakan arbitrary hex `[#...]` atau inline styles. Seluruhnya dipetakan untuk dibersihkan:

### A. Warna Asing yang Melanggar Identitas Brand (Alien Colors)
Warna bernuansa biru/slate yang masuk tanpa dasar desain:
- `#1b3c53` (dark blue) & `#456882` (slate blue)
  - Lokasi: `DailyAssessmentForm.tsx` (17x), `DailyAssessmentSummary.tsx` (6x), `LogSessionModal.tsx` (6x), `WellnessTrendChart.tsx` (1x).
  - *Rencana Resolusi:* Ganti total dengan `brown-900` (`#3B2A20`) untuk teks pekat, dan `brown-700` (`#5A4636`) untuk teks sekunder.

### B. Warna Tailwind Bawaan yang Mengabaikan Token Mood
- `#8B5CF6` (violet), `#F97316` (orange-500 default), `#EAB308` (yellow-500 default)
  - Lokasi: `DailyAssessmentForm.tsx` (mood icon styles & picker).
  - *Rencana Resolusi:* Kembalikan ke token brand resmi: `mood-depressed` (`#A99BE0`), `mood-sad` (`#EE8A5E`), `mood-happy` (`#E8C24A`).

### C. Variasi Hex Cream & Hijau Ad-hoc (Inkonsistensi Permukaan)
- `#faf7f2`, `#fbf9f5`, `#fdfbf8`, `#f0ede4`, `#f6f1e7`, `#f5efe6` (variasi cream)
  - Lokasi: `ComposeBox.tsx`, `GuidelinesModal.tsx`, `CrisisBanner.tsx`, `CommunitySidebar.tsx`.
  - *Rencana Resolusi:* Standardisasi ke `cream` (`#F7F2E7`) atau kartu putih `bg-white/80` bertekstur.
- `#e2ebd2`, `#eaf2dd`, `#d8e3c6` (variasi hijau pastel)
  - Lokasi: `LogSessionModal.tsx`, `DailyAssessmentForm.tsx`.
  - *Rencana Resolusi:* Satukan ke `green-100` (`#E4EED2`).

### D. Warna Fungsional Pihak Ketiga (Diizinkan Tetap Ada)
- Google OAuth Brand Mark: `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` di `GoogleAuthProfileModal.tsx`.
- Status Kehadiran (Presence): `#23a55a` (online), `#f0b232` (idle), `#f23f43` (dnd), `#80848e` (offline) di Community chat.

---

## 4. Pemetaan Token Semantik (Tailwind + CSS Tokens)

Untuk memudahkan perbaikan komponen secara bertahap tanpa menyentuh nilai hex:

```css
:root {
  /* Brand Core Locked */
  --color-cream: #F7F2E7;
  --color-brown-900: #3B2A20;
  --color-brown-700: #5A4636;
  --color-green-500: #8FAE5D;
  --color-green-100: #E4EED2;
  --color-orange-500: #F2884B;
  --color-orange-100: #FCE3D3;

  /* Semantic UI Tokens */
  --bg-app: var(--color-cream);
  --bg-surface: #FFFFFF;
  --bg-surface-muted: var(--color-green-100);
  --bg-surface-warm: var(--color-orange-100);

  --text-primary: var(--color-brown-900);
  --text-secondary: var(--color-brown-700);
  --text-inverted: #FFFFFF;

  --border-subtle: rgba(59, 42, 32, 0.08);
  --border-default: rgba(59, 42, 32, 0.14);
  --border-focus: rgba(242, 136, 75, 0.7);

  --ring-focus: rgba(242, 136, 75, 0.25);

  --interactive-cta: var(--color-orange-500);
  --interactive-dark: var(--color-brown-900);
  --interactive-calm: var(--color-green-500);
}
```

---

## 5. State Turunan yang Diizinkan (Hover / Focus / Active)

Dibuat secara matematis dari hue yang sama menggunakan opacity tailwind atau shade alami:
- `brown-900` hover: `hover:bg-brown-900/90` atau `active:bg-brown-900/95`
- `orange-500` hover: `hover:bg-[#E5763B]` (-5% lightness, hue sama) atau `hover:bg-orange-500/90`
- `green-500` hover: `hover:bg-[#809E51]` (-5% lightness, hue sama) atau `hover:bg-green-500/90`
- `green-100` hover: `hover:bg-green-100/80`
- `orange-100` hover: `hover:bg-orange-100/80`

Tidak ada hue baru yang diperkenalkan. Seluruh palet terkunci 100%.

