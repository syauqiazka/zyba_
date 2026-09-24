/** @type {import('next').NextConfig} */

// Fix: On Windows, webpack's glob scanner follows pnpm symlinks into
// C:\Users\PC05 and hits junction points (Application Data, Local Settings)
// that throw EPERM. Patch process.env.HOME to a safe dir before Next.js loads.
//
// Also set outputFileTracingRoot to keep tracing within the project.

const path = require("path");

const nextConfig = {
  eslint: {
    // ESLint v9 tidak kompatibel dengan next lint. TypeScript strict check dipakai sebagai gantinya.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
    // Limit output file tracing to the project root only —
    // prevents Next.js from walking up into C:\Users during build.
    outputFileTracingRoot: path.resolve(__dirname),
  },
  // Optimasi performa device kentang
  compress: true, // gzip compression
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/webp'], // webp lebih ringan dari png/jpg
    deviceSizes: [640, 750, 828, 1080, 1200], // breakpoint realistis
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // size thumbnail
    minimumCacheTTL: 60 * 60 * 24 * 7, // cache 7 hari
  },
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
