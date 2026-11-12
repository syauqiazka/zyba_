# Zyba Companion (Private Reflection Pavilion) — Redesign v2

> **Canonical Route:** `/companion`, `/companion/[slug]`  
> **Source Components:** `src/app/companion/page.tsx`, `src/app/companion/[slug]/page.tsx`, `src/components/companion/*`

---

## Perubahan dari v1

1. **DIBUANG:** Toolbar lebar penuh di bagian atas halaman. Model selector dan tombol gaya dipindahkan ke **dalam/menempel pada wadah input chat**, persis seperti antarmuka percakapan modern Claude.ai.
2. **DIBUANG:** Border tebal berwarna dan badge mood mencolok di setiap item riwayat percakapan. Item sidebar kini berupa daftar baris minimal yang bersih dengan hover/active state tipis (`bg-brown-900/5`).
3. **DIBUANG:** Fitur-fitur scope creep non-kesehatan mental seperti sub-section Projects/Artifacts/Code. Halaman `[slug]` kini murni mewakili ID percakapan individual yang tersinkronisasi ke URL.
4. **DIBUANG:** Ikon robot generik "Bot" dan nama template "Tanya Zyba AI". Nama resmi dikunci menjadi **Zyba Companion**.
5. **BARU:** Area chat lapang dengan bubble pesan bertekstur kertas halus, tipografi DM Sans yang nyaman untuk teks panjang, dan avatar persona hewan hangat.
6. **BARU:** Input box multiline auto-growing (Enter kirim, Shift+Enter baris baru) dengan tombol audio mic (STT) dan speaker (TTS) terintegrasi secara ergonomis.
7. **BARU:** Modal kuota harian habis yang elegan dengan penawaran Zyba Plus tanpa rasa memaksa.

---

## Tujuan pengguna & fitur yang dipertahankan

- **Tujuan Pengguna:** Menuangkan beban pikiran secara bebas tanpa takut dihakimi, berdialog interaktif dengan AI empatik berbasis psikologi, mendengarkan respon suara lembut, dan mengelola arsip percakapan pribadi.
- **Fitur yang Dipertahankan:**
  - Riwayat sesi percakapan per slug URL (`/companion/[slug]`)
  - Pemilihan 3 persona: Zyba Empathy, Zyba Mindful, Zyba Solution
  - Multi-provider AI selector (Gemini, Groq, Mistral, OpenRouter)
  - Fitur rekam suara (Speech-to-Text via `useSTT`) & Text-to-Speech (TTS)
  - Quota meter & modal kuota habis terhubung ke billing
  - Deteksi krisis instan dengan banner hotline Sejiwa 119

---

## Layout (Mobile 375 / Tablet 768 / Desktop 1280)

### Desktop 1280px (Contextual Sidebar 300px : Jendela Chat Aktif)
```
+-----------------------------------------------------------------------------------+
| [Zen Dock] | COMPANION SIDEBAR (300px) |           ACTIVE CHAT WINDOW (LAPANG)    |
|            |                           |                                          |
|            | [<- Kembali ke ZYBA]      | Header: Nama Persona (Empathy) + Quota   |
|            | [+ Sesi Baru]             | ---------------------------------------- |
|            | [Cari percakapan...]      | Messages Stream:                         |
|            |                           | - User Bubble (bg-brown-900, text-white) |
|            | Riwayat:                  | - Zyba Bubble (bg-white/90, text-brown)  |
|            | - Hari Ini                |                                          |
|            |   * Cemas Tugas Akhir     | [Typing Indicator: Denyut Halus]         |
|            |   * Ritme Napas Siang     | ---------------------------------------- |
|            | - Kemarin                 | Input Bar:                               |
|            |   * Refleksi Emosi        | [Textarea Multiline Auto-Grow..........] |
|            |                           | (Mic STT) (Model: Gemini) [Kirim ->]     |
+-----------------------------------------------------------------------------------+
```

### Mobile 375px
- Sidebar percakapan dapat dibuka/tutup melalui drawer menu di header chat.
- Jendela percakapan memenuhi seluruh layar, touch target mikrofon dan kirim pesan minimal 48x48px.

---

## Komponen & token yang dipakai

- **Bubble Chat User:** `bg-brown-900 text-cream rounded-[20px] rounded-br-xs px-5 py-3.5 shadow-xs max-w-xl self-end`.
- **Bubble Chat Zyba:** `bg-white/90 text-brown-900 border border-brown-900/10 rounded-[20px] rounded-bl-xs px-5 py-3.5 shadow-xs max-w-2xl self-start`.
- **Input Container:** `bg-white/95 border border-brown-900/12 rounded-[22px] p-3 shadow-xs focus-within:ring-2 focus-within:ring-orange-500/30`.
- **Item Riwayat Sidebar:** `px-3.5 py-2.5 rounded-xl hover:bg-brown-900/5 text-sm text-brown-700 hover:text-brown-900 transition-colors`.

---

## State: Default / Loading / Empty / Error / Crisis / Locked(Plus)

1. **Default:** Percakapan aktif termuat, daftar riwayat tampil di sidebar, input siap menerima ketikan.
2. **Loading (Streaming Response):** Indikator denyut 3 titik halus (`bg-brown-900/30`) mengalir sebelum token kata muncul.
3. **Empty (Percakapan Baru):** Layar sambutan hangat dengan 3 prompt starter santun: *"Bagaimana perasaanmu sekarang?"*, *"Bantu aku meredakan cemas"*, *"Latihan napas sejenak"*.
4. **Error:** Pesan halus *"Koneksi jeda sejenak"* + tombol *"Kirim Ulang Pesan"*.
5. **Crisis Detected:** Balasan pendamping beralih ke nada tenang memprioritaskan keselamatan, disertai kartu bantuan Sejiwa 119 ext. 8.
6. **Locked (Kuota Habis):** Modal elegan *"Batas percakapan harian tercapai. Lanjutkan tanpa batas dengan Zyba Plus"*.

---

## Interaksi & motion

- **Auto-Grow Textarea:** Ketinggian kotak membesar mulus dari 1 baris hingga maksimal 5 baris sebelum mengaktifkan scroll.
- **Scroll to Bottom:** Auto-scroll ke pesan terbaru dengan lereng transisi halus (*smooth easing*).
- **Reduced Motion:** Animasi streaming dan drawer diganti dengan pergantian state langsung tanpa transisi.

---

## Aksesibilitas

- Input chat diberi label `aria-label="Tulis pesan ke Zyba Companion"`.
- Tombol STT memiliki umpan balik suara dan indikator visual status mendengarkan (`aria-pressed`).
- Pesan suara (TTS) dapat dihentikan kapan saja dengan tombol jeda yang jelas.

---

## Kriteria penerimaan

- [x] Tidak ada toolbar mengambang lebar penuh di atas header chat.
- [x] Model AI selector berada di area input bawah.
- [x] Item sidebar aktif tidak memakai border warna-warni mencolok.
- [x] Input mendukung multiline Enter / Shift+Enter dan speech-to-text.

---

## Referensi yang dipakai

- **Ref 9 & Ref 18 (Sereno):** Jendela percakapan terpadu dengan prompt starter hangat, bubble chat ramah mata, dan integrasi kontrol input bersih.
