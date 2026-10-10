import {
  buildFreeWellnessInsights,
  buildPremiumWellnessInsights,
} from "../src/lib/wellness/insightsService";

function runTests() {
  console.log("=== MEMULAI TEST SUITE INSIGHTS ===");

  // 1. Uji kondisi 0 data check-in
  const res0 = buildFreeWellnessInsights({ assessments: [], journals: [], activities: [] });
  if (res0.summary.checkIns !== 0) throw new Error("Gagal: checkIns harus 0");
  if (res0.patterns.hasEnoughData !== false) throw new Error("Gagal: hasEnoughData harus false saat 0 data");
  if (res0.patterns.items.length !== 0) throw new Error("Gagal: items harus kosong saat 0 data");
  if (!res0.patterns.emptyMessage.includes("Belum cukup data")) throw new Error("Gagal: emptyMessage salah");
  console.log("✓ Test 1: Skenario 0 data check-in berhasil (empty state informatif terpasang)");

  // 2. Uji kondisi 2 data check-in (di bawah ambang batas minimum 3)
  const res2 = buildFreeWellnessInsights({
    assessments: [
      { date: "2026-10-01", mood: "HAPPY", stressLevel: 2, sleepRating: 4, calculatedScore: 80 },
      { date: "2026-10-02", mood: "NEUTRAL", stressLevel: 3, sleepRating: 3, calculatedScore: 65 },
    ],
    journals: [],
    activities: [],
  });
  if (res2.patterns.hasEnoughData !== false) throw new Error("Gagal: hasEnoughData harus false saat 2 data");
  if (res2.patterns.dataPoints !== 2) throw new Error("Gagal: dataPoints harus 2");
  if (res2.patterns.minRequired !== 3) throw new Error("Gagal: minRequired harus 3");
  console.log("✓ Test 2: Skenario 2 data check-in berhasil (< 3 ambang batas)");

  // 3. Uji kondisi 5 data check-in (mencukupi ambang batas)
  const res5 = buildFreeWellnessInsights({
    assessments: [
      { date: "2026-10-01", mood: "HAPPY", stressLevel: 2, sleepRating: 4, calculatedScore: 80 },
      { date: "2026-10-02", mood: "HAPPY", stressLevel: 2, sleepRating: 5, calculatedScore: 85 },
      { date: "2026-10-03", mood: "SAD", stressLevel: 4, sleepRating: 2, calculatedScore: 50 },
      { date: "2026-10-04", mood: "NEUTRAL", stressLevel: 3, sleepRating: 3, calculatedScore: 65 },
      { date: "2026-10-05", mood: "HAPPY", stressLevel: 2, sleepRating: 4, calculatedScore: 82, reflection: "Refleksi diri yang baik" },
    ],
    journals: [{ createdAt: "2026-10-05", mood: "HAPPY", title: "Catatan Jurnal" }],
    activities: [
      { completed: true, type: "BREATHING", createdAt: "2026-10-05" },
      { completed: true, type: "WALKING", createdAt: "2026-10-04" },
    ],
  });
  if (res5.patterns.hasEnoughData !== true) throw new Error("Gagal: hasEnoughData harus true saat 5 data");
  if (res5.patterns.items.length === 0) throw new Error("Gagal: pola harus terdeteksi");
  if (res5.weekly.score === null) throw new Error("Gagal: weekly score harus terhitung");
  if (res5.recommendations.length === 0) throw new Error("Gagal: rekomendasi harus ada");
  console.log(`✓ Test 3: Skenario 5 data check-in berhasil (${res5.patterns.items.length} pola terdeteksi)`);

  // 4. Uji kondisi ZYBA Plus (Premium Insights)
  const resPrem = buildPremiumWellnessInsights({
    assessments: [
      { date: "2026-10-01", mood: "HAPPY", stressLevel: 2, sleepRating: 4, calculatedScore: 80 },
      { date: "2026-10-02", mood: "HAPPY", stressLevel: 2, sleepRating: 5, calculatedScore: 85 },
      { date: "2026-10-03", mood: "SAD", stressLevel: 4, sleepRating: 2, calculatedScore: 50 },
      { date: "2026-10-04", mood: "NEUTRAL", stressLevel: 3, sleepRating: 3, calculatedScore: 65 },
      { date: "2026-10-05", mood: "HAPPY", stressLevel: 2, sleepRating: 4, calculatedScore: 82 },
    ],
    journals: [{ createdAt: "2026-10-05", mood: "HAPPY", title: "Jurnal" }],
    activities: [{ completed: true, type: "BREATHING", createdAt: "2026-10-05" }],
  });
  if (resPrem.isPremium !== true) throw new Error("Gagal: isPremium harus true");
  if (resPrem.adaptivePlan.length !== 7) throw new Error("Gagal: adaptivePlan harus berisi 7 hari");
  if (!resPrem.longitudinalAnalysis) throw new Error("Gagal: longitudinalAnalysis harus ada");
  if (resPrem.deepTriggers.stressTriggers.length === 0) throw new Error("Gagal: stressTriggers harus ada");
  if (resPrem.deepTriggers.recoveryBoosters.length === 0) throw new Error("Gagal: recoveryBoosters harus ada");
  if (!resPrem.companionContext.summaryText) throw new Error("Gagal: companionContext harus ada");
  console.log("✓ Test 4: Skenario ZYBA Plus berhasil (Plan 7 Hari & Analisis Mendalam lengkap)");

  console.log("=== SEMUA TEST BERHASIL 100%! TIDAK ADA REGRESI ===");
}

runTests();
