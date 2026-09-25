# ZYBA Web — Next.js + Prisma + Neon

Scaffold awal versi desktop ZYBA. Mengimplementasikan Dashboard dan Mood Check-In
sebagai contoh pola; halaman lain (Zyba Companion, Smart Activity Planner, Zyba
Community, Resources) mengikuti pola file yang sama — lihat bagian "Menambah
Halaman Baru" di bawah.

## 1. Setup Database (Neon)

1. Buat akun/project baru di [neon.tech](https://neon.tech).
2. Buat database bernama `zyba`.
3. Dari dashboard Neon, buka **Connection Details**, copy dua connection string:
   - **Pooled connection** (ada `-pooler` di endpoint) → dipakai untuk `DATABASE_URL`
   - **Direct connection** (tanpa `-pooler`) → dipakai untuk `DIRECT_URL`
4. Copy `.env.example` jadi `.env` dan isi kedua URL tadi.

```bash
cp .env.example .env
```

## 2. Install & Sinkronisasi Skema

```bash
npm install
npm run db:push      # sinkronkan schema.prisma ke Neon (development cepat)
npm run db:seed      # isi data demo (1 user + mood entries)
```

> Untuk produksi, pakai `npm run db:migrate` supaya migration history tersimpan,
> bukan `db:push`.

## 3. Jalankan Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000` — otomatis redirect ke `/dashboard`.

## 4. Struktur Folder

```
src/
  app/
    layout.tsx          # root layout + sidebar nav
    dashboard/page.tsx   # Home
    mood-check-in/page.tsx
    api/mood/route.ts    # POST/GET mood entries
  components/
    Sidebar.tsx
    MoodSelector.tsx
  lib/
    prisma.ts            # Prisma client singleton
    crisisDetection.ts   # helper deteksi risiko + info hotline
prisma/
  schema.prisma          # seluruh data model (lihat AGENTS.md bagian 4 utk mapping fitur)
  seed.ts
```

## 5. Menambah Halaman Baru

Pola untuk tiap fitur di AGENTS.md (bagian 4 — Taksonomi Layar):

1. Buat folder route baru di `src/app/<nama-fitur>/page.tsx`.
2. Tambahkan entry di `NAV_ITEMS` pada `src/components/Sidebar.tsx`.
3. Kalau butuh data, tambah model baru di `prisma/schema.prisma`, lalu
   `npm run db:push` lagi.
4. Untuk fitur dengan input teks bebas dari pengguna (journal, chat companion,
   expression analysis) — **selalu** panggil `detectRisk()` dari
   `src/lib/crisisDetection.ts` sebelum menyimpan/merespons, dan tampilkan
   `CRISIS_RESOURCES` ke pengguna kalau `risk === true`. Jangan biarkan pesan
   berisiko diproses seperti curhatan biasa oleh AI companion.

## 6. Catatan Keamanan Penting

- Password di seed script pakai placeholder — implementasikan hashing asli
  (mis. `bcrypt`) sebelum ada form registrasi nyata.
- `crisisDetection.ts` saat ini heuristik keyword sederhana untuk demo. Di
  produksi, ini harus diperkuat (model klasifikasi + review manusia) dan
  terhubung ke protokol eskalasi nyata (notifikasi ke tim/psikolog mitra),
  bukan cuma menampilkan pesan otomatis di UI.

## 7. Mekanisme Fallback Storage Lokal

Aplikasi memiliki fallback storage lokal di `data/*.json` (dipakai oleh `backend/db/prisma.ts` dan `userRepository.ts` ketika koneksi Neon Postgres mengalami cold-start atau timeout >250ms).


cd /home/bismillahjogja/public_html
git pull origin main
pnpm install
pnpm run db:generate:all
pnpm run build

pnpm exec pm2 restart JHIC

> **Peringatan Penting Keamanan & Hosting:**
> - Direktori `data/*.json` dimasukkan ke `.gitignore` karena berisi bcrypt hash password dan data asesmen pengguna demo. Jangan pernah menonaktifkan aturan ini di repositori git.
> - Pada platform hosting serverless dengan sistem berkas ephemeral (seperti Vercel, Netlify, atau Render), sistem berkas lokal bersifat sementara dan **tidak persistent** saat redeploy. Data fallback lokal hanya berfungsi sebagai proteksi transien demo, bukan pengganti database persisten.

