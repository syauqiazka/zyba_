# Gerbang Masuk & Autentikasi Mockdoc — Calm Authentication Pavilion (`/login`) — Redesign v2

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/login`  
> **Source Components:** `src/app/login/page.tsx`, `src/app/login/components/*`  
> **Single Source of Truth:** `design-system/zyba/MASTER.md`

---

## 1. Ringkasan & Persona

- **Target Persona:** Pengguna yang ingin masuk kembali ke sanctuary pribadinya atau pengguna baru yang hendak mendaftar melalui formulir terpadu yang tenang dan terlindungi.
- **Mental Model:** *"Mengetuk pintu kayu sebuah paviliun hening di tepi danau, menunjukkan identitas dengan aman, dan melangkah masuk ke dalam ruang perlindungan."*
- **Primary Job to Be Done (JTBD):** Memfasilitasi autentikasi pengguna secara instan dan aman (Email/Password, Google OAuth, dan alur Lupa Password) tanpa distraksi visual atau rasa frustrasi input.
- **Invarian Keamanan Mutlak:**
  - Password di-hash menggunakan bcrypt (cost 12) di server.
  - Sesi ditandatangani menggunakan JWT (`jose`, HS256) tersimpan di cookie HttpOnly.
  - Dilarang mengembalikan kode OTP atau token raw dalam response API.

---

## 2. Perubahan dari v1

- **Dihapus:** Lingkaran-lingkaran dekoratif acak, latar belakang gradien ungu-biru ala template AI, dan floating blur glow.
- **Dihapus:** Input field dengan border tipis tak kontras yang menyulitkan pengguna dengan gangguan penglihatan.
- **Baru:** Komposisi editorial split 50:50 pada desktop — panel kiri kutipan reflektif santai dan showcase sanctuary, panel kanan formulir login taktil berfokus tinggi.
- **Baru:** Tombol Google OAuth berlatar kertas bersih dengan ikon resmi dan batas kontak tegas `border-brown-900/15`.
- **Baru:** Toggle kata sandi ramah aksesibilitas dengan umpan balik fokus jelas.
- **Alasan:** Menghilangkan kecemasan digital, menghadirkan estetika *Tactile Sanctuary*, dan memastikan alur masuk yang cepat dan aman.

---

## 3. Layout & Komposisi Grid (3 Viewport: 375, 768, 1280)

- **Mobile (375px):**
  - Padding: `px-5 py-8`.
  - Header: Logo ZYBA mungil di atas dengan ucapan sambutan hangat.
  - Container Formulir: Kartu berlatar `bg-white/95 border border-brown-900/10 rounded-[20px] p-6 shadow-xs`.
  - Tombol Masuk: Lebar penuh, tinggi 48px, ramah ketukan jempol.
- **Tablet (768px):**
  - Layout: Terpusat dengan lebar maksimal `max-w-[480px] mx-auto py-16 px-6`.
  - Elevasi: Kartu taktil `rounded-[24px]` dengan bayangan kontak lembut.
- **Desktop (1280px):**
  - Layout: Grid 2 kolom seimbang (50:50) dalam kontainer `max-w-[1120px] mx-auto min-h-[85vh] items-center gap-12 px-8`.
  - Panel Kiri: `DesktopShowcase` — kutipan ketenangan batin berlatar linen hangat, status keheningan, dan ilustrasi napas ritmis.
  - Panel Kanan: Kartu formulir autentikasi `SignInCard` berlatar `bg-white/95 rounded-[24px] border border-brown-900/10 p-8 sm:p-10 shadow-xs`.

---

## 4. Token Visual yang Digunakan

- **Kanvas Utama:** `bg-cream` (`#F7F2E7`).
- **Tinta Teks:** `text-brown-900` (`#3B2A20`) untuk judul dan teks utama, `text-brown-700` (`#5A4636`) untuk label field dan panduan.
- **Border & Kontur:** `border-brown-900/10` untuk kontainer kartu, `border-brown-900/20` untuk input default.
- **Aksen Aksi:**
  - `bg-brown-900 text-cream hover:bg-brown-900/90` untuk tombol aksi utama (*Masuk*).
  - `ring-orange-500/40 border-orange-500` untuk fokus input aktif.
  - `text-orange-500 hover:text-orange-600` untuk tautan *"Lupa Kata Sandi?"*.
- **Danger:** `text-danger` (`#D9534F`) hanya untuk pesan kesalahan validasi kredensial.

---

## 5. Komponen Kunci & Hirarki Radius

1. **Auth Shell Container:**
   - Radius: `rounded-[24px]` pada desktop/tablet, `rounded-[20px]` pada mobile.
2. **Text Input Fields (Email & Password):**
   - Radius: `rounded-xl` (12px).
   - Tinggi: Minimal 46px.
   - Border: Kontak kertas organik `border-brown-900/15`, fokus `ring-2 ring-orange-500/40`.
3. **Primary Submit Button:**
   - Radius: `rounded-full` pill penuh.
   - Tinggi: 48px.
4. **Google OAuth Button:**
   - Radius: `rounded-full` pill sekunder berlatar `bg-white hover:bg-cream border border-brown-900/15`.
5. **Forgot Password Card / Modal:**
   - Radius: `rounded-[24px]` dengan alur pengiriman instruksi pemulihan.

---

## 6. Matriks 6 State (Default, Loading, Empty, Active, Error, Crisis)

1. **Default:** Formulir siap menerima input dengan kursor otomatis pada field email atau username.
2. **Loading:** Tombol submit menampilkan animasi titik berdenyut lembut (*"Menghubungkan..."*) dan menonaktifkan klik ganda.
3. **Empty:** Validasi inline menampilkan peringatan jika form disubmit dalam keadaan kosong tanpa merusak tata letak.
4. **Active:** Field yang sedang diketik mendapatkan sorotan cincin oranye lembut dan label melayang/jelas.
5. **Error:** Pesan kesalahan otentikasi ramah (*"Kombinasi email atau kata sandi tidak cocok. Silakan periksa kembali."*) berlatar `bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5`.
6. **Crisis:** Jika pengguna yang belum login mencari bantuan darurat, terdapat tautan cepat ke `/guidebook` di bagian bawah formulir.

---

## 7. Interaksi & Motion

- **Transisi Kartu:** Peralihan antara mode *"Masuk"* dan *"Lupa Kata Sandi"* menggunakan transisi opasitas 200ms `ease-out`.
- **Visibilitas Sandi:** Mengklik ikon mata memunculkan/menyembunyikan kata sandi secara instan dengan label aksesibilitas yang sesuai.
- **Reduced Motion:** Animasi transisi formulir ditiadakan saat mode reduced motion aktif.

---

## 8. Aksesibilitas (WCAG AA/AAA, Keyboard, Focus, Reduced Motion)

- **Label Form Semantik:** Setiap input wajib memiliki elemen `<label>` yang terhubung via atribut `htmlFor` dan `id`.
- **Keyboard Tab Order:** Urutan tab logis: Email -> Password -> Tampilkan Password -> Lupa Password -> Tombol Masuk -> Google OAuth -> Tautan Daftar.
- **Pemberitahuan Error:** Pesan error menggunakan `aria-live="polite"` agar dibacakan oleh pembaca layar.
- **Rasio Kontras:** Teks input Brown 900 di atas latar putih mencapai rasio kontras 12.8:1 (WCAG AAA).

---

## 9. Integrasi Data & API (Contract strictly preserved)

- **POST `/api/auth`**:
  - Request Body: `{ action: "login", email: string, password: string }`.
  - Response Success: `{ success: true, user: { id, email, name, onboardingCompleted } }`.
  - Cookie: `auth-token` diset otomatis via header `Set-Cookie`.
- **Redirect Rule**:
  - Jika `onboardingCompleted === false`, diarahkan ke `/assessment`.
  - Jika `onboardingCompleted === true`, diarahkan ke `/dashboard`.

---

## 10. Acceptance Criteria (Verifiable)

- [ ] Pengguna dapat masuk menggunakan email dan password yang valid.
- [ ] Pengguna dapat beralih ke alur Google OAuth secara mulus.
- [ ] Tombol visibilitas sandi berfungsi dan memiliki label screen reader.
- [ ] Tidak ada gradien ungu neon, lingkaran acak, atau radius seragam `rounded-[32px]`.
- [ ] Validasi error tampil manusiawi dan informatif.
- [ ] Seluruh alur lolos uji navigasi keyboard murni tanpa mouse.
