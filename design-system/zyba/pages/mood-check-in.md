# Mood Check-In Mockdoc — Mindful Assessment Ritual (`/daily-assessment` & `/mood-check-in`)

> **Skills Integration:** Obra/Superpowers Engineering Rigor + Leonxlnx/Taste Art Direction + pbakaus/Impeccable Vocabulary + UI/UX Pro Max Intelligence + Anti-Slop Hygiene Filter.  
> **Canonical Route:** `/daily-assessment` (alias: `/mood-check-in`)  
> **Source Components:** `src/app/daily-assessment/page.tsx`, `src/app/daily-assessment/components/*`, `src/app/mood-check-in/*`

---

## 1. Page Context & User Journey (obra/superpowers)

- **Target Persona:** Pengguna yang ingin menuangkan suasana hati dan beban emosional secara jujur tanpa rasa takut dinilai atau dihakimi.
- **Mental Model:** *"Menulis di buku harian pribadi yang hangat, menamai perasaanku, dan mendapatkan pelukan emosional yang menenangkan."*
- **Primary Job to Be Done (JTBD):** Mencatat suasana hati (5 skala mood canonical), level stres (1–5), kualitas tidur & energi opsional, catatan reflektif bebas, serta menjalankan deteksi risiko krisis otomatis (*Crisis Safety Engine*).
- **Data & API Binding:**
  - Prisma Model: `MoodEntry` (`mood`, `stressLevel`, `note`, `sleepRating`, `energyTags`, `createdAt`), `JournalEntry`
  - Endpoint: `POST /api/mood`, `GET /api/mood/history`
  - Crisis Detection Integration: Wajib memanggil `detectRisk(note)` di `src/lib/crisisDetection.ts`.

---

## 2. Art Direction & Visual Atmosphere (Leonxlnx/taste-skill)

- **Arah Visual:** *The Tactile Sanctuary — Mindful Journal Sheet*.
- **Kanvas & Tata Letak Terpusat:** Kanvas Cream (`#F7F2E7`) dengan **Single Focused Sanctuary Card** di tengah layar (`max-w-[680px] mx-auto`). Menyingkirkan semua distraksi navigasi sekunder agar pengguna dapat fokus seutuhnya pada dirinya sendiri.
- **Pebbles Sentuh Empuk (5 Mood Pebbles):**
  - Menggantikan slider klinis yang dingin dengan 5 batu pipih sentuh halus (*pebbles*) `w-14 h-14 rounded-2xl` dengan border sesuai palet spektrum emosi:
    - *Depressed*: `#A99BE0` (Lavender teduh)
    - *Sad*: `#EE8A5E` (Terracotta lembut)
    - *Neutral*: `#6B5645` (Earthy brown)
    - *Happy*: `#E8C24A` (Golden warm)
    - *Overjoyed*: `#8FAE5D` (Olive sage)
- **Nada Bicara & Microcopy:** Santun, puitis, dan berempati.
  - Heading: *"Bagaimana cuaca batinmu saat ini?"*
  - Subtitle: *"Tidak ada emosi yang salah. Semua perasaanmu berharga dan diterima di sini."*
  - Placeholder Catatan: *"Tulis apa pun yang melintas di benakmu, sependek atau sepanjang yang kamu butuhkan..."*

---

## 3. Responsive Geometry & Breakpoints (ui-ux-pro-max-skill)

- **Desktop (≥ 1024px):**
  - Spacing Layout: `md:pl-[108px] pr-8 py-10 flex justify-center`.
  - Container Kartu: `w-full max-w-[680px] bg-white/90 rounded-[24px] border border-brown-900/10 p-8 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.05)]`.
- **Tablet (768px – 1023px):**
  - Spacing Layout: `pl-[96px] pr-6 py-8`.
  - Container Kartu: `w-full max-w-[600px] p-6 rounded-[24px]`.
- **Mobile (< 768px):**
  - Navigasi: Ergonomic Bottom Pill Nav di bawah.
  - Spacing Layout: `px-4 pt-4 pb-24`.
  - Container: Kartu mengisi lebar penuh dengan radius `rounded-[20px] p-5`.

---

## 4. Multi-Step Form Flow & Component Specs (pbakaus/impeccable)

### Step 1: Penentuan Mood Utama (Pebble Selection)
- Grid 5 Kolom: `grid grid-cols-5 gap-3 sm:gap-4 my-6`
- Tiap Pebble: `flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 cursor-pointer`
- Active State: Background tinted lembut + ring kontak border 2px + sedikit elevasi `scale-105 shadow-xs`.

### Step 2: Level Stres & Beban Pikiran (Gentle Stepper)
- Skala 1 sampai 5 dengan label hangat:
  1. *Sangat Tenang*
  2. *Relatif Terkendali*
  3. *Sedikit Kewalahan*
  4. *Beban Berat*
  5. *Butuh Jeda Penuh*
- Elemen Kontrol: 5 tombol pill `rounded-full h-10 border border-brown-900/15 font-medium text-xs sm:text-sm transition-all aria-pressed:bg-brown-900 aria-pressed:text-cream`.

### Step 3: Catatan Refleksi & Deteksi Krisis
- Textarea Refleksi: `w-full rounded-xl bg-cream/30 border border-brown-900/15 p-4 text-sm text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70 leading-relaxed min-h-[140px]`
- **Crisis Guardian Gate:** Jika teks mengandung frasa risiko krisis (bunuh diri / self-harm), tombol submit memicu modal darurat Sejiwa 119 ext. 8 dengan hangat dan menawarkan bantuan segera.

### Step 4: Tombol Simpan Komitmen
- Container: `flex items-center justify-between pt-6 border-t border-brown-900/10`
- Tombol Lewati: `text-xs font-semibold text-brown-700/70 hover:text-brown-900 transition-colors`
- Tombol Simpan: `bg-orange-500 hover:bg-orange-500/90 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-xs transition-all`

---

## 5. State Matrix & Edge Cases (obra/superpowers)

| State | Kondisi Pemicu | Visual Feedback | Tindakan Sistem |
|---|---|---|---|
| **Default** | Pengguna membuka form check-in | Pebble dalam kondisi default tanpa seleksi | Menampilkan sapaan lembut |
| **Pebble Selected** | Pengguna memilih 1 dari 5 mood | Pebble membesar halus, border aktif, muncul opsi stres | Form bergulir lembut ke pertanyaan kedua |
| **Submitting** | Pengguna menekan *"Simpan Check-In"* | Tombol menampilkan spinner tenang *"Menyimpan catatan batinmu..."* | Request `POST /api/mood` terkirim |
| **Saved Success** | Respons 200 OK diterima | Tampilan bertransisi ke kartu rangkuman hangat + rekomendasi aktivitas mikro | Redirect opsional ke Dashboard/Activity |
| **Crisis Triggered** | `detectRisk()` menghasilkan tingkat HIGH | Layar memunculkan dialog Sejiwa 119 ext. 8 berlatar Cream tanpa tombol alarm merah | Berikan hotline langsung bebas pulsa |
| **Network Error** | Neon DB timeout atau offline | Catatan disimpan sementara di localStorage + notifikasi *"Catatanmu aman tersimpan di perangkat"* | Retry otomatis saat kembali online |

---

## 6. Anti-Slop Audit Checklist (miqdadbadjuber/anti-slop)

- [x] **Zero Emoji as Icons:** Menggunakan SVG Lucide (`HeartHandshake`, `Sparkles`, `Clock`, `ArrowLeft`).
- [x] **No Card Inception:** Form check-in berada langsung di dalam satu Sanctuary Card tunggal.
- [x] **No Icon-in-a-box:** Form inputs dan steppers menggunakan garis bersih tanpa kotak warna-warni berlebih.
- [x] **Anti-Slop Radius Scale:** Form Card 24px, Pebble 16px, Textarea 12px, Stepper Pill 9999px.
- [x] **WCAG AA Compliance:** Teks pertanyaan 11.2:1 (AAA), label stres 7.4:1 (AAA).
- [x] **No Hype:** Tidak ada kalimat motivasi toksik (*"Semangat dong!"* dilarang keras).

---

## 7. Verification Contract (obra/superpowers)

- **Input Validation:** Catatan bebas dicek sanitasi XSS; mood wajib salah satu dari `DEPRESSED`, `SAD`, `NEUTRAL`, `HAPPY`, `OVERJOYED`.
- **Crisis Test Case:** String *"aku lelah dan ingin mengakhiri hidup"* wajib memicu Crisis Intervene state secara deterministik.
- **Contract Test Command:**
  ```powershell
  node scripts/test-insights-unit.ts
  ```

