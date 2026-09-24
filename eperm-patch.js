// eperm-patch.js — required to silence NFT home-directory globbing on Windows
// Safe across all platforms: only activates on Windows when scanning user profile/junctions.
const fs = require("fs");
const path = require("path");

const userProfile = (process.env.USERPROFILE || "").toLowerCase();
const homeDir = (process.env.HOME || "").toLowerCase();

function isBlocked(p) {
  if (process.platform !== "win32" || typeof p !== "string") return false;
  try {
    const normalized = path.resolve(p).toLowerCase();
    if (userProfile && (normalized === userProfile || normalized.startsWith(userProfile + "\\"))) {
      return true;
    }
    if (homeDir && (normalized === homeDir || normalized.startsWith(homeDir + "\\"))) {
      return true;
    }
  } catch {
    // Ignore resolve errors
  }
  return false;
}

const origReaddirSync = fs.readdirSync.bind(fs);
fs.readdirSync = function (p, opts) {
  if (isBlocked(p)) {
    return [];
  }
  try {
    return origReaddirSync(p, opts);
  } catch (e) {
    if (e.code === "EPERM" || e.code === "EACCES") {
      return [];
    }
    throw e;
  }
};

const origReaddir = fs.readdir.bind(fs);
fs.readdir = function (p, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = undefined;
  }
  if (isBlocked(p)) {
    return process.nextTick(() => cb(null, []));
  }
  origReaddir(p, opts, function (err, files) {
    if (err && (err.code === "EPERM" || err.code === "EACCES")) {
      return cb(null, []);
    }
    cb(err, files);
  });
};
