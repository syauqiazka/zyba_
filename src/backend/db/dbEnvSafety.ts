/**
 * Database Environment Safety Module for ZYBA
 * 
 * Strict Environment Rules:
 * 1. In production runtime, explicit DATABASE_URL_* / DIRECT_URL_* is mandatory.
 *    Silent fallback to localhost is strictly prohibited to prevent data pollution or accidental local binding.
 * 2. In development or testing, explicit localhost fallback is allowed with clear diagnostic logging.
 * 3. During Next.js static build phase (phase-production-build), safe placeholder is used
 *    to prevent static page metadata collection from failing.
 */

export function resolveDatabaseUrl(
  envKey: string,
  directKey: string,
  fallbackDatabaseName: string
): string {
  const configuredUrl = process.env[envKey] || process.env[directKey];
  if (configuredUrl) {
    return configuredUrl;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.BUILDING === "true" ||
    process.env.NEXT_BUILD === "true";

  // Production runtime check: MUST NOT silently fallback to localhost!
  if (isProduction && !isBuildPhase) {
    const errorMsg =
      `[DATABASE_CONFIG_ERROR] Variabel lingkungan ${envKey} atau ${directKey} tidak ditemukan di environment production. ` +
      `Sistem ZYBA menolak fallback diam-diam ke localhost pada runtime production demi keamanan integritas data.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Development / test explicit fallback
  if (!isProduction) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        `[DATABASE_DEV_FALLBACK] ${envKey} tidak diset. Menggunakan database lokal untuk development: postgresql://localhost:5432/${fallbackDatabaseName}`
      );
    }
    return `postgresql://postgres:postgres@localhost:5432/${fallbackDatabaseName}`;
  }

  // Static build phase placeholder (only executed during next build page collection)
  return `postgresql://postgres:postgres@localhost:5432/${fallbackDatabaseName}`;
}
