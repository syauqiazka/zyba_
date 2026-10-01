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

// Patch symlinks for Windows standalone trace copying
if (process.platform === "win32") {
  const origPromisesSymlink = fs.promises.symlink ? fs.promises.symlink.bind(fs.promises) : null;
  if (origPromisesSymlink) {
    fs.promises.symlink = async function (target, dest, type) {
      try {
        const stats = await fs.promises.stat(target).catch(() => null);
        const resolvedType = stats && stats.isDirectory() ? "junction" : type;
        return await origPromisesSymlink(target, dest, resolvedType);
      } catch (err) {
        if (err.code === "EPERM" || err.code === "EACCES") {
          try {
            const stats = await fs.promises.stat(target).catch(() => null);
            if (stats && stats.isDirectory()) {
              return await origPromisesSymlink(target, dest, "junction");
            } else {
              return await fs.promises.copyFile(target, dest);
            }
          } catch {
            return;
          }
        }
        throw err;
      }
    };
  }

  const origSymlinkSync = fs.symlinkSync ? fs.symlinkSync.bind(fs) : null;
  if (origSymlinkSync) {
    fs.symlinkSync = function (target, dest, type) {
      try {
        const stats = fs.statSync(target, { throwIfNoEntry: false });
        const resolvedType = stats && stats.isDirectory() ? "junction" : type;
        return origSymlinkSync(target, dest, resolvedType);
      } catch (err) {
        if (err.code === "EPERM" || err.code === "EACCES") {
          try {
            const stats = fs.statSync(target, { throwIfNoEntry: false });
            if (stats && stats.isDirectory()) {
              return origSymlinkSync(target, dest, "junction");
            } else {
              return fs.copyFileSync(target, dest);
            }
          } catch {
            return;
          }
        }
        throw err;
      }
    };
  }
}
