#!/usr/bin/env bash
# ─── loadtest/bench.sh ───────────────────────────────────────────────────────
# Quick load test pakai `ab` (Apache Benchmark) — sudah tersedia di semua Ubuntu.
# Jalankan dari VPS atau mesin yang punya akses ke domain.
#
# Penggunaan:
#   chmod +x loadtest/bench.sh
#   ./loadtest/bench.sh https://jhic.zyba.my.id
# ─────────────────────────────────────────────────────────────────────────────

BASE_URL="${1:-https://jhic.zyba.my.id}"
CONCURRENCY=10
REQUESTS=100

echo "═══════════════════════════════════════════════"
echo "  ZYBA Load Test  —  $BASE_URL"
echo "  Concurrency: $CONCURRENCY  |  Total: $REQUESTS"
echo "═══════════════════════════════════════════════"

run_bench() {
  local label="$1"
  local url="$2"
  echo ""
  echo "── $label ──────────────────────────────────────"
  ab -n "$REQUESTS" -c "$CONCURRENCY" -H "Accept-Encoding: gzip" \
    -k "$url" 2>&1 | grep -E "Requests per second|Time per request|Failed requests|Transfer rate"
}

# ── Static asset (harus 100% cache hit, <5ms) ─────────────────────────────
run_bench "/_next/static (JS chunk)" "$BASE_URL/_next/static/chunks/main.js"

# ── Health endpoint ───────────────────────────────────────────────────────
run_bench "/api/health"              "$BASE_URL/api/health"

# ── Landing page (SSR) ───────────────────────────────────────────────────
run_bench "/ (landing)"             "$BASE_URL/"

# ── Resources API (cached) ───────────────────────────────────────────────
run_bench "/api/resources (cached)" "$BASE_URL/api/resources"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Done. Target: >50 req/s, <500ms mean latency"
echo "═══════════════════════════════════════════════"
