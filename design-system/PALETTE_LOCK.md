# ZYBA — PALETTE LOCK & COLOR AUDIT — Redesign v2

> **Sumber Kebenaran Warna Terkunci:** Dokumen ini mengunci nilai hex brand dan aturan pemakaian warna untuk ZYBA Redesign v2. Dilarang menambahkan warna baru atau memakai arbitrary hex di luar token canonical.

---

## Perubahan dari v1

1. **DIBUANG:** Hex liar ad-hoc (`#1b3c53`, `#456882`, `#8B5CF6`, `#faf7f2`, `#e2ebd2`, dsb.) yang sebelumnya tersebar di 31 berkas.
2. **DIBUANG:** Warna hijau tua `#344638` yang membuat tampilan hero gelap dan tidak lapang.
3. **BARU:** Aturan pemakaian ketat:
   - **Soil Brown (`#3B2A20`):** Identitas brand, teks utama, border struktur kertas, tombol primer.
   - **Secondary Brown (`#5A4636`):** Teks sekunder, label, border netral.
   - **Terracotta Orange (`#F2884B`):** Hanya untuk **SATU** aksi utama per layar (CTA fokus) dan highlight hangat terarah.
   - **Sage Green (`#8FAE5D`):** Elemen status positif, sehat, recovery, dan tombol sekunder.
   - **5 Mood Tokens:** Dibatasi strictly hanya untuk visualisasi data emosional.
   - **Danger (`#D9534F`):** Eksklusif untuk aksi destruktif (hapus akun/post). Dilarang untuk konten krisis pengguna.
4. **BARU:** Token semantik resmi yang dipetakan langsung ke `globals.css` dan `tailwind.config.ts`.

---

## 1. Nilai Hex Resmi Terkunci (Canonical Tokens)

| Token Name | Hex Code | Kelas Tailwind | Peruntukan Resmi |
|---|---|---|---|
| **Cream** | `#F7F2E7` | `bg-cream`, `text-cream` | Background utama seluruh halaman, surface kartu default |
| **Brown 900** | `#3B2A20` | `bg-brown-900`, `text-brown-900` | Teks utama/headings, tombol primer gelap, border solid |
| **Brown 700** | `#5A4636` | `text-brown-700`, `bg-brown-700` | Teks sekunder, label, caption, border netral |
| **Green 500** | `#8FAE5D` | `bg-green-500`, `text-green-500` | Elemen kesejahteraan/positif, CTA sekunder, badge aktif |
| **Green 100** | `#E4EED2` | `bg-green-100`, `text-green-100` | Background kartu hijau muda, active state menu |
| **Orange 500** | `#F2884B` | `bg-orange-500`, `text-orange-500` | Satu CTA utama hangat per layar, aksen fokus |
| **Orange 100** | `#FCE3D3` | `bg-orange-100`, `text-orange-100` | Background kartu oranye lembut, container tag |
| **Mood: Depressed** | `#A99BE0` | `bg-mood-depressed`, `text-mood-depressed` | Indikator emosi sedih mendalam / lavender tenang |
| **Mood: Sad** | `#EE8A5E` | `bg-mood-sad`, `text-mood-sad` | Indikator emosi murung / terracotta lembut |
| **Mood: Neutral** | `#6B5645` | `bg-mood-neutral`, `text-mood-neutral` | Indikator emosi netral / earthy brown |
| **Mood: Happy** | `#E8C24A` | `bg-mood-happy`, `text-mood-happy` | Indikator emosi bahagia / golden warm |
| **Mood: Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed`, `text-mood-overjoyed` | Indikator emosi sangat bersemangat / olive green |
| **Danger** | `#D9534F` | `bg-danger`, `text-danger` | **Hanya** untuk aksi destruktif (delete akun/post). Dilarang untuk krisis |

---

## 2. Pembersihan Hex Liar (Audit Target)

| Kategori Hex Liar | Contoh Nilai | Status Redesign v2 | Resolusi Pengganti |
|---|---|---|---|
| **Alien Blues** | `#1b3c53`, `#456882` | **DIBERSIHKAN** | Ganti ke `text-brown-900` & `text-brown-700` |
| **Tailwind Defaults** | `#8B5CF6`, `#F97316`, `#EAB308` | **DIBERSIHKAN** | Ganti ke token mood canonical (`bg-mood-*`) |
| **Ad-hoc Creams** | `#faf7f2`, `#fbf9f5`, `#f0ede4` | **DIBERSIHKAN** | Standardisasi ke `bg-cream` atau `bg-white/90` |
| **Ad-hoc Greens** | `#e2ebd2`, `#eaf2dd`, `#d8e3c6` | **DIBERSIHKAN** | Satukan ke `bg-green-100` |
| **Deep Forest** | `#344638`, `#445B4A` | **DIBERSIHKAN** | Ganti ke kanvas lapang `bg-white/90 border-brown-900/10` |
