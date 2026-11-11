import assert from "node:assert";
import { resolveDatabaseUrl } from "../src/backend/db/dbEnvSafety.ts";

console.log("Testing DB Environment Safety...");

// Scenario 1: Development fallback works
process.env.NODE_ENV = "development";
delete process.env.TEST_DB_URL;
delete process.env.TEST_DIRECT_URL;
const devUrl = resolveDatabaseUrl("TEST_DB_URL", "TEST_DIRECT_URL", "test_db");
assert(devUrl.includes("test_db"), "Development returns fallback");
console.log("✅ Development fallback works");

// Scenario 2: Explicit URL is honored
process.env.TEST_DB_URL = "postgresql://real_user:real_pass@remote.host:5432/real_db";
const explicitUrl = resolveDatabaseUrl("TEST_DB_URL", "TEST_DIRECT_URL", "test_db");
assert.strictEqual(explicitUrl, "postgresql://real_user:real_pass@remote.host:5432/real_db", "Explicit URL honored");
console.log("✅ Configured URL is honored");

// Scenario 3: Production runtime throws if missing
process.env.NODE_ENV = "production";
delete process.env.TEST_DB_URL;
delete process.env.NEXT_PHASE;
delete process.env.BUILDING;
delete process.env.NEXT_BUILD;

let threwInProd = false;
try {
  resolveDatabaseUrl("TEST_DB_URL", "TEST_DIRECT_URL", "test_db");
} catch (e) {
  threwInProd = true;
  assert(e.message.includes("DATABASE_CONFIG_ERROR"), "Error message contains code");
}
assert(threwInProd, "Must throw in production if database URL is missing");
console.log("✅ Production runtime rejects silent localhost fallback");

// Scenario 4: Next.js build phase allows static compilation without throwing
process.env.NEXT_PHASE = "phase-production-build";
const buildUrl = resolveDatabaseUrl("TEST_DB_URL", "TEST_DIRECT_URL", "test_db");
assert(buildUrl.includes("test_db"), "Build phase returns build-safe dummy URL");
console.log("✅ Next.js build phase handled safely");

console.log("\nAll DB Environment Safety scenarios passed successfully!");
