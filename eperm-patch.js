// eperm-patch.js — required via NODE_OPTIONS=--require to silence EPERM on Windows
// This file is loaded before any other module including Next.js/webpack.
const fs = require("fs");

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
