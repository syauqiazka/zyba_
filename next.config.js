/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint v9 tidak kompatibel dengan next lint. TypeScript strict check dipakai sebagai gantinya.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
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
};

module.exports = nextConfig;
