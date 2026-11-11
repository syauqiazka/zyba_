# Arrival & Assessment Mockdoc — Mindful Onboarding Ritual (`/onboarding` & `/assessment`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Routes:** `/onboarding` (Auth & Welcome) → `/assessment` (Profile Setup + Mental Health Questionnaire) → `/welcome` (Sanctuary Tour)  
> **Source Components:** `src/app/onboarding/page.tsx`, `src/app/assessment/page.tsx`, `src/app/welcome/components/WelcomeTour.tsx`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna baru yang mendaftar ke ZYBA; seringkali berada dalam kondisi lelah mental atau waspada terhadap privasi data pribadinya.
- **Mental Model:** *"Mengetuk pintu sebuah rumah singgah yang ramah, disambut dengan hangat, memilih identitas diri yang nyaman, dan menceritakan kondisi batin secara jujur tanpa rasa takut dibocorkan."*
- **Primary Job to Be Done (JTBD):** Melakukan pendaftaran aman (email/password/Google OAuth), verifikasi OTP 4 digit rahasia, personalisasi profil (avatar & preferensi notifikasi), serta evaluasi kesehatan holistik (tujuan, mood, tidur, stres, gejala mental).
- **Arsitektur Alur Tunggal (AGENTS.md Bagian 4.B & C):**
  - `/onboarding`: Welcome carousel (5 slide pengantar) + Form Sign Up/Sign In.
  - `/assessment`: **Satu alur 8-langkah berurutan** (Profile Setup + Kuisioner Mental Health terpadu).
  - Gating Middleware: Pengguna dengan `User.onboardingCompleted === false` dialihkan secara otomatis ke `/assessment` dan tidak dapat mengakses dashboard sampai menyelesaikan langkah terakhir (*"You're All Set Up"*).
- **Data & API Binding:**
  - Prisma Models: `User` (`name`, `avatarUrl`, `onboardingCompleted`), `Assessment`, `NotificationPref`
  - Endpoints: `POST /api/auth/register`, `POST /api/auth/verify-otp`, `POST /api/assessment`

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Arrival at the Threshold*.
- **Kanvas & Material:** Kanvas Cream (`#F7F2E7`) dengan kartu formulir putih susu `bg-white/95` bertepi kontak kertas halus `border-brown-900/10` dan bayangan lembut `shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]`.
- **Progress Stepper Organik (Breathing Stepper):** Menggantikan progress bar angka laboratorium klinis dengan rangkaian batu pijakan halus (*stepping stones*) yang bernapas lembut menunjukkan posisi langkah pengguna (1 sampai 8).
- **Nada Bicara:** Menentramkan, menjaga privasi, dan penuh empati.
  - Sapaan: *"Selamat datang di ZYBA. Luangkan waktu sejenak, tidak ada yang perlu diburu-buru di sini."*
  - Pernyataan Privasi: *"Semua jawabanmu terenkripsi dan hanya digunakan untuk merancang pendampingan yang tepat bagimu."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px): Two-Panel Sanctuary Form**
  - **Panel Kiri (Progress & Context Canvas):** Lebar 380px, `bg-white/80 rounded-[24px] border border-brown-900/10 p-8 flex flex-col justify-between`. Menampilkan refleksi langkah aktif dan ilustrasi garis tenang.
  - **Panel Kanan (Active Question Window):** Mengisi sisa kanvas (`max-w-[620px]`), `bg-white/95 rounded-[24px] border border-brown-900/10 p-8 shadow-xs`.
- **Tablet & Mobile (< 1024px): Single Stepper Flow**
  - Header ramping dengan progress bar garis halus warna Green 500 (`#8FAE5D`) di bagian atas.
  - Spacing Layout: `px-4 pt-6 pb-20`.
  - Formulir mengisi kartu sentuh terpusat `rounded-[20px] p-6`.

---

## 4. Urutan 8 Langkah `/assessment` & Komponen (pbakaus/impeccable)

1. **Langkah 1 — Select Avatar & Profile Setup:**
   - Pemilihan avatar pebble (bunga brand ZYBA, cangkir teh, siluet daun, kucing tenang) + input nama panggilan & bio hening.
2. **Langkah 2 — Password Setup & Strength Meter:**
   - Input password dengan meter kekuatan organik 4 baris warna netral (bukan merah menyala yang mengintimidasi).
3. **Langkah 3 — Verifikasi OTP 4 Digit:**
   - 4 boks angka sentuh terpisah `w-12 h-14 rounded-xl border-2 border-brown-900/15 text-center font-display text-xl focus:border-orange-500`. Kode OTP dikirimkan via email asli (tidak pernah dikembalikan di response API).
4. **Langkah 4 — Device Biometric / PIN Setup (Opsional):**
   - Penawaran proteksi privasi perangkat lokal; tombol lewati jelas tersedia.
5. **Langkah 5 — Preferensi Notifikasi:**
   - Toggle ramah untuk `companionNotif`, `wellnessNotif`, dan `communityNotif`.
6. **Langkah 6 — Kuisioner Holistik & AI Expression Analysis:**
   - Pertanyaan tujuan utama, pola tidur, level stres (1–5), gejala fisik, dan analisis ekspresi bahasa batin (menggunakan contoh teks ekspresi reflektif santun — bebas dari teks krisis ekstrem dummy).
7. **Langkah 7 — Compiling Data (Loading Ritual):**
   - Transisi bernapas lembut: `animate-pulse duration-2000` dengan microcopy *"Menyusun ruang personal yang tepat untukmu..."*.
8. **Langkah 8 — "You're All Set Up":**
   - Kartu keberhasilan hangat dengan tombol utama *"Melangkah ke Dashboard →"*. Pada langkah ini, `User.onboardingCompleted` disetel menjadi `true`.

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Aksi Pengguna |
|---|---|---|---|
| **Step Active** | Pengguna mengisi input pada langkah aktif | Tombol *"Lanjutkan"* aktif jika input valid | Ketuk tombol untuk lanjut |
| **OTP Invalid** | Kode OTP tidak sesuai | Pesan ramah *"Kode verifikasi belum sesuai, silakan periksa kembali"* | Input ulang atau kirim ulang OTP |
| **Expression Crisis** | Teks ekspresi mengindikasikan bahaya diri | Dialog bantuan Sejiwa 119 ext. 8 terbuka sebelum melanjutkan | Beri nomor hotline darurat |
| **Data Compiling** | Jawaban sedang dienkripsi & disimpan | Denyut napas lembut di atas kanvas Cream | Layar berpindah otomatis saat selesai |
| **All Set** | Akun siap digunakan | Tombol CTA komitmen primer berwarna Brown 900 | Masuk ke Dashboard |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`User`, `ShieldCheck`, `KeyRound`, `Bell`, `Sparkles`, `CheckCircle2`).
- [x] **Zero Noisy Marketing Popups:** Tidak ada tawaran newsletter spam atau banner diskon selama onboarding.
- [x] **No Card Inception:** Tata letak dua panel bersih tanpa kartu berlapis di dalam kartu.
- [x] **Hierarki Radius:** Sanctuary Panels 24px, Avatar Selector 16px, Form Inputs 12px, CTA Buttons 9999px.
- [x] **Accessible Contrast:** Label input memenuhi rasio kontras 11.2:1 (AAA) pada Milk White.
- [x] **Motion Reduced:** Stepper transisi mematuhi `prefers-reduced-motion`.

---

## 7. Verification Contract (obra/superpowers)

- **Middleware Enforcement:** Akses ke `/dashboard` tanpa menyelesaikan langkah 8 wajib di-redirect ke `/assessment` dengan kode HTTP 307.
- **Contract Test Command:**
  ```powershell
  node scripts/test-registration-flow.mjs
  ```

