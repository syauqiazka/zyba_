# ZYBA Master Design System — Redesign v2

> **Sumber Kebenaran Tunggal:** Dokumen ini adalah acuan arsitektur visual dan komponen tertinggi untuk ZYBA Redesign v2. Jika terdapat pertentangan antara dokumen lain (`AGENTS.md`, mockdoc spesifik, catatan lama), aturan di dalam **MASTER.md ini yang menang mutlak**.
> **Arah Desain:** "Tactile Sanctuary, Versi Lebih Lapang" — Editorial hangat, banyak ruang napas, minim elemen warna-warni, data nyata sebagai pahlawan bukan dekorasi.

---

## Perubahan dari v1

1. **DIBUANG:** Card inception (kartu bertingkat di dalam kartu). Grup konten kini dipisahkan oleh whitespace dan garis pembatas halus (`border-brown-900/10`), bukan kotak bersarang.
2. **DIBUANG:** Warna asing di luar token resmi. Tidak ada hijau tua `#344638`, tile pastel mint/biru-lavender, ikon ungu/kuning, atau gradient dekoratif `from-* to-*`.
3. **DIBUANG:** Gamifikasi menekan. Dihapus total streak api, angka XP, target karangan ("/30", "20/20"), dan leaderboard. Digantikan oleh **Hearth Flame** (nyala lilin tenang) dan pencapaian hening (*Quiet Milestones*).
4. **DIBUANG:** Ikon dekoratif tanpa fungsi (*Sparkles*, bintang, dot dekoratif di samping heading). Semua ikon UI kini murni SVG **Lucide** (stroke 1.6–1.8).
5. **BARU:** Token semantik terpusat (`surface`, `surface-raised`, `ink`, `ink-muted`, `line`, `accent`, `positive`). Kode antarmuka menggunakan token semantik terstandarisasi.
6. **BARU:** Tata letak editorial lapang 12-kolom (maksimal 1280px) yang memanfaatkan lebar layar secara seimbang, menghilangkan ruang kosong janggal (>25% margin kosong) dan menyamakan tinggi kolom.
7. **BARU:** MoodPebble interaktif 5 warna kanonikal bertekstur sentuh empuk untuk check-in emosi harian.
8. **BARU:** Penyatuan sumber data (single source of truth) antara client-side state dan backend API, mengeliminasi ketidakkonsistenan angka skor, streak, dan riwayat antarhalaman.

---

## 1. Locked Palette Matrix & Semantic Design Tokens

### 1.1 Palet Kanonikal Terkunci
| Token | Hex | Kelas Tailwind | Penggunaan Resmi |
|---|---|---|---|
| **Cream** | `#F7F2E7` | `bg-cream`, `text-cream` | Kanvas utama 70–80% viewport (tekstur kertas linen alami) |
| **Soil Brown** | `#3B2A20` | `bg-brown-900`, `text-brown-900` | Teks utama, border struktur kertas, tombol primer |
| **Secondary Brown** | `#5A4636` | `bg-brown-700`, `text-brown-700` | Teks pendukung, label domain, instruksi sekunder |
| **Sage Green** | `#8FAE5D` | `bg-green-500`, `text-green-500` | Indikator kesehatan, status positif, pemulihan, tombol sekunder |
| **Green 100** | `#E4EED2` | `bg-green-100`, `text-green-900` | Latar badge sukses, kartu aktivitas rileks |
| **Terracotta Orange**| `#F2884B` | `bg-orange-500`, `text-orange-500` | Satu aksi utama per layar (CTA fokus), highlight lembut |
| **Orange 100** | `#FCE3D3` | `bg-orange-100`, `text-orange-900` | Latar badge perhatian hangat, highlight hari ini |
| **Danger** | `#D9534F` | `bg-danger`, `text-danger` | **Khusus** aksi destruktif (hapus akun/post). Dilarang untuk krisis |

### 1.2 Token Mood Emosional (Khusus Data Emosi)
| Emosi | Hex | Token Class |
|---|---|---|
| **Depressed** | `#A99BE0` | `bg-mood-depressed` (Lavender tenang) |
| **Sad** | `#EE8A5E` | `bg-mood-sad` (Terracotta teduh) |
| **Neutral** | `#6B5645` | `bg-mood-neutral` (Cokelat tanah stabil) |
| **Happy** | `#E8C24A` | `bg-mood-happy` (Kuning madu hangat) |
| **Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed` (Hijau zaitun segar) |

*Aturan Warna:* Dilarang menggunakan warna di luar tabel di atas. Hex mentah di JSX dilarang keras.

---

## 2. Tipografi & Skala Teks

- **Display / Heading:** `Manrope` (`font-display`, weight 600/700/800).
- **Body / Antarmuka:** `DM Sans` (`font-body`, weight 400/500/600/700).
- **Skala Ukuran Resmi:**
  - Display Utama: `text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.1] tracking-tight`
  - H1 / Section Title: `text-2xl sm:text-3xl font-extrabold leading-tight`
  - H2 / Sub-Section: `text-xl sm:text-2xl font-bold leading-snug`
  - H3 / Card Title: `text-base sm:text-lg font-bold leading-normal`
  - Body Normal: `text-sm sm:text-base font-normal leading-relaxed text-brown-700`
  - Body Small / Caption: `text-xs sm:text-sm font-medium text-brown-700/80`
  - Micro Label: Minimal 12px (label kapital 11px hanya bila kontras ≥ 4.5:1 dan dibatasi satu per kartu).

---

## 3. Geometri, Skala Radius & Elevasi

### 3.1 Skala Radius Bertingkat
- **Shell / Zen Dock / Sheet:** `rounded-[24px]` hingga `rounded-[28px]`
- **Kartu Utama / Section Hero:** `rounded-[24px]`
- **Kartu Fungsional / Widget:** `rounded-[16px]` hingga `rounded-[20px]`
- **Form Controls / Inputs / Sub-items:** `rounded-xl` (12px)
- **Buttons / Chips / Badges / Pebbles:** `rounded-full`

### 3.2 Anti-Card Inception Rule
Konten dalam satu kartu utama dipisahkan dengan:
1. Ruang vertikal terukur (`gap-4` / `gap-6` / `space-y-4`)
2. Garis rambut kontak kertas (`divide-y divide-brown-900/10` atau `border-t border-brown-900/10`)
3. Dilarang menaruh kartu berlatar abu-abu/putih di dalam kartu putih lainnya.

### 3.3 Elevasi Halus
- Border kontak alami: `border border-brown-900/10`
- Bayangan kontak lembut: `shadow-xs` atau `shadow-[0_4px_20px_-4px_rgba(59,42,32,0.05)]`
- Dilarang bayangan tebal gelap, glow neon, atau blur berlebihan.

---

## 4. Sistem Navigasi

- **Desktop & Tablet (≥768px):** **Floating Zen Dock**
  - Lebar: 76px tetap mengapung (`left-4` / `fixed`), `rounded-[28px]`, latar `bg-white/90 backdrop-blur-md border border-brown-900/10`.
  - Layout padding konten: `md:pl-[104px]`.
  - State aktif: `bg-brown-900/8 text-brown-900 font-bold` (tanpa border berwarna mencolok).
  - Tooltip: Dirender via React Portal ke `document.body` dengan penempatan dinamis via `getBoundingClientRect()`.
- **Mobile (<768px):** **Ergonomic Bottom Pill Nav**
  - Tinggi 56px, `rounded-full`, mengapung 12px dari bawah layar, bayangan lembut.
- **Profile Popover:**
  - Desktop: Berlabuh di `left: 92px` sejajar tombol avatar di dock.
  - Mobile: Menjadi modal bottom-sheet yang naik dari bawah.

---

## 5. Pola Komponen Inti (`src/components/ui/`)

1. **Button:**
   - *Primary:* `rounded-full bg-brown-900 hover:bg-orange-500 text-cream px-6 py-3 text-sm font-bold shadow-xs transition-all`
   - *Secondary:* `rounded-full bg-white hover:bg-cream text-brown-900 border border-brown-900/15 px-5 py-2.5 text-sm font-bold`
   - *Ghost:* `rounded-full hover:bg-brown-900/5 text-brown-700 hover:text-brown-900 px-4 py-2 text-sm font-semibold`
   - *Destructive:* `rounded-full bg-danger/10 hover:bg-danger text-danger hover:text-white px-5 py-2.5 text-sm font-bold`
2. **MoodPebble:** Lingkaran sentuh berdiameter 44px–52px dengan warna sesuai 5 token mood, feedback visual saat dipilih (ring seleksi lembut).
3. **ProgressRing:** Lingkaran skor proporsional berlatar cream halus dengan stroke warna dinamis sesuai ambang batas nilai nyata.
4. **HearthFlame:** Ikon nyala lilin konsistensi harian yang hening menggantikan streak api merah yang menekan.
5. **CrisisBanner:** Banner bantuan krisis berlatar netral cream tebal berbingkai halus (`bg-cream border border-brown-900/20 text-brown-900`), menyajikan hotline Sejiwa 119 ext. 8 tanpa tombol dismiss otomatis.

---

## 6. Matriks State Universal

Setiap halaman di ZYBA wajib menyediakan penanganan eksplisit untuk 6 state:
1. **Default:** Data nyata tampil bersih dan tertata secara hierarkis.
2. **Loading:** Skeleton berdenyut lembut (`animate-pulse duration-2000`) pada kanvas cream tanpa layout-shift.
3. **Empty:** Sapaan ramah dan ajakan langkah pertama yang hangat, bukan kolom kosong.
4. **Error:** Pesan pemulihan kontekstual dan tombol coba lagi tanpa memutus sesi.
5. **Crisis Detected:** Banner hotline bantuan darurat tampil menonjol namun tenang saat terdeteksi kata berisiko.
6. **Locked (Plus):** Pratinjau edukatif dan tombol CTA upgrade Zyba Plus yang elegan tanpa mengunci data dasar.
