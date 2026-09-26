#!/bin/bash
# deploy.sh — jalankan ini di SSH Terminal panel Webuzo tiap ada update dari GitHub
# Usage: bash deploy.sh
set -e

echo "==> [1/4] Pulling latest code from GitHub..."
git pull origin main

echo "==> [2/4] Installing dependencies..."
pnpm install

echo "==> [3/4] Generating Prisma clients (all 3 schemas)..."
pnpm run db:generate:all

echo "==> [4/4] Building Next.js production bundle..."
rm -rf .next/cache
pnpm run build

echo ""
echo "✅ Build selesai!"
echo ""
echo "⚠️  LANGKAH MANUAL TERAKHIR:"
echo "   Restart Node App lewat panel Webuzo:"
echo "   Applications > List Applications > (cari zyba / jhic) > Restart"
echo ""
echo "   Setelah restart, buka https://jhic.zyba.my.id dan pastikan tidak ada error."
