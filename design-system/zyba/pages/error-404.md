# Halaman Kesalahan & Not Found Mockdoc — Tactile Sanctuary Error Boundary (`not-found.tsx`, `error.tsx`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `not-found.tsx` (404), `error.tsx` (500)  
> **Source Components:** `src/app/not-found.tsx`, `src/app/error.tsx`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna yang tersesat ke tautan yang salah, artikel yang telah dipindahkan, atau mengalami interupsi jaringan/server saat sedang mengakses sanctuary.
- **Mental Model:** *"Salah melangkah ke sebuah lorong sepi berkabut di sudut taman, namun menemukan bangku kayu hangat dan papan penunjuk jalan yang ramah untuk kembali ke paviliun utama."*
- **Primary Job to Be Done (JTBD):** Menenangkan pengguna dari rasa bingung atau frustrasi teknologi, memberikan penjelasan manusiawi tanpa jargon kode yang menakutkan, dan menyediakan tombol kembali yang jelas ke Sanctuary Utama (`/dashboard`).

---

## 2. Perubahan dari v1

- **Dihapus:** Kode error teknis mentah (*"500 Internal Server Error"*, stack trace yang menakutkan) di hadapan pengguna biasa.
- **Dihapus:** Ilustrasi robot rusak atau kabel putus bergaya kartun generik.
- **Baru:** Komposisi penenang editorial dengan tipografi Manrope berwibawa (*"Jalan ini sedang hening sejenak."*).
- **Baru:** Lambang lentera hening atau kompas alam dengan garis ukir Lucide SVG stroke 1.8px.
- **Baru:** Tombol navigasi aksi ganda yang taktil (*"Kembali ke Dashboard"* dan *"Buka Panduan & Bantuan"*).
- **Alasan:** Menjaga suasana tenang batin pengguna bahkan saat terjadi kegagalan teknis, memperkuat identitas *Tactile Sanctuary*, dan mencegah kepanikan.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-5 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center`.
  - Kartu Pesan: `bg-white/95 border border-brown-900/10 rounded-[24px] p-6 w-full shadow-xs`.
  - Tombol: Tombol tumpuk vertikal dengan lebar penuh.
- **Tablet (768px):**
  - Layout: Terpusat dengan lebar `max-w-[520px] mx-auto py-16 px-6`.
  - Kartu Pesan: `rounded-[28px]` dengan ruang lapang dan ilustrasi kompas sentral.
- **Desktop (1280px):**
  - Layout: Terpusat sempurna dalam kanvas lapang `max-w-[620px] mx-auto min-h-[75vh] flex flex-col justify-center px-8`.
  - Kartu Pesan: Paviliun penenang `rounded-[28px] bg-white/95 border border-brown-900/10 p-10 sm:p-12 text-center shadow-xs`.
  - Tombol: Baris horizontal tombol pill berdampingan.

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Latar Kartu:** `bg-white/95 border border-brown-900/10`.
- **Tinta Teks:** `text-brown-900` (`#3B2A20`) untuk tajuk display, `text-brown-700` (`#5A4636`) untuk narasi penenang.
- **Aksen Aksi:**
  - Tombol Utama: `bg-brown-900 text-cream hover:bg-brown-900/90 rounded-full`.
  - Tombol Sekunder: `bg-white hover:bg-cream border border-brown-900/15 text-brown-900 rounded-full`.
- **Dilarang:** Menggunakan latar merah menyala atau border merah tebal pada layar 404/500.

---

## 5. Komponen Kunci & Hirarki Radius

1. **Error Shelter Shell:**
   - Radius: `rounded-[28px]` (Major Sanctuary Anchor).
   - Container: `border border-brown-900/10 bg-white/95 p-8 sm:p-12 text-center shadow-xs`.
2. **Serene Emblem Container:**
   - Radius: `rounded-full` atau `rounded-[20px]`.
   - Ukuran: 72px x 72px berlatar `bg-orange-100/60` dengan ikon Lucide `Compass` atau `Sparkles` warna Brown 900.
3. **Primary Action Button:**
   - Radius: `rounded-full` pill primer `px-7 py-3 text-sm font-semibold`.
4. **Secondary Action Button:**
   - Radius: `rounded-full` pill garis kontak `px-6 py-3 text-sm font-semibold`.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default (404 Not Found):** Menampilkan pesan ramah bahwa halaman tidak ditemukan beserta tautan kembali ke sanctuary.
2. **Loading (Error Boundary Reset):** Saat pengguna menekan *"Coba Muat Ulang"*, tombol memancarkan animasi denyut lembut sembari me-refresh boundary.
3. **Empty:** Tidak relevan.
4. **Active:** Kursor hover pada tombol aksi memicu elevasi mikro dan fokus ring tegas.
5. **Error (500 Server Error):** Menampilkan pesan penenang bahwa sistem sedang menata diri kembali, dengan opsi muat ulang atau kembali ke dashboard.
6. **Crisis:** Jika pengguna yang tersesat membutuhkan bantuan emosional segera, tombol rujukan ke `/guidebook` (Sejiwa 119) tersedia jelas di bawah aksi utama.

---

## 7. Interaksi & Motion

- **Fade In Halus:** Komponen penenang muncul perlahan dengan transisi opasitas 250ms saat render fallback terjadi.
- **Tindakan Reset:** Tombol `reset()` pada `error.tsx` mencoba memulihkan React Error Boundary tanpa me-reload penuh tab browser jika memungkinkan.
- **Reduced Motion:** Tidak ada animasi bergoyang yang memusingkan.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Judul Terbaca:** Heading level `h1` berbunyi *"Halaman Tidak Ditemukan"* atau *"Terjadi Kendala Sejenak"* agar pembaca layar langsung memahami konteks.
- **Focus Trap Prevention:** Fokus otomatis dialihkan ke heading atau tombol kembali pertama agar pengguna keyboard tidak tertinggal di area kosong.
- **Rasio Kontras:** Teks penjelasan memenuhi kontras minimal 6.4:1 terhadap latar putih kartu.

---

## 9. Integrasi Data & API (Contract strictly preserved)

- Komponen `src/app/not-found.tsx`: Menggunakan Next.js App Router Not Found handler.
- Komponen `src/app/error.tsx`: Menggunakan Next.js Client Error Boundary (`{ error, reset }`).
- Logging: Error teknis dicatat secara hening di konsol/monitoring server tanpa diekspos mentah ke pengguna.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Membuka rute yang tidak terdaftar (contoh `/halaman-acak`) memicu halaman 404 yang tenang.
- [ ] Tombol *"Kembali ke Dashboard"* mengarahkan kembali ke `/dashboard`.
- [ ] Tombol bantuan ke `/guidebook` berfungsi dan mudah ditemukan.
- [ ] Tidak ada kode error teknis mentah (stack trace) yang bocor ke UI publik.
- [ ] Radius mematuhi skala proporsional tanpa `rounded-[32px]`.
- [ ] Responsif sempurna pada viewport 375px, 768px, dan 1280px.
