/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["localhost:3000"],
    },

    // =================================================
    // SERVER HOSTING RESOURCE LIMIT
    // Batasi worker agar tidak kena EAGAIN / thread limit
    // =================================================
    workerThreads: false,
    cpus: 1,

    outputFileTracingRoot: path.resolve(__dirname),
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  images: {
    formats: ["image/webp"],
    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
    ],
    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
    ],
    minimumCacheTTL:
      60 * 60 * 24 * 7,
  },

  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;