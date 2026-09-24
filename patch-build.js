// patch-build.js — Run before next build to silently ignore EPERM on Windows
// Usage: node patch-build.js
const fs = require("fs");
const { execSync } = require("child_process");

// Patch fs.readdirSync to swallow EPERM (Windows junction points)
const origReaddirSync = fs.readdirSync.bind(fs);
fs.readdirSync = function (p, opts) {
  try {
    return origReaddirSync(p, opts);
  } catch (e) {
    if (e.code === "EPERM" || e.code === "EACCES") {
      return [];
    }
    throw e;
  }
};

// Also patch readdir (async)
const origReaddir = fs.readdir.bind(fs);
fs.readdir = function (p, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = undefined;
  }
  origReaddir(p, opts, function (err, files) {
    if (err && (err.code === "EPERM" || err.code === "EACCES")) {
      return cb(null, []);
    }
    cb(err, files);
  });
};

console.log("[patch-build] fs.readdirSync patched — EPERM will be silenced");

// Now run next build
try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
} catch (e) {
  process.exit(1);
}
