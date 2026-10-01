/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  // Optimisasi Docker
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["localhost:3000"],
    },

    // Batasi resource build VPS
    workerThreads: false,
    cpus: 1,

    outputFileTracingRoot: path.resolve(__dirname),

    // Tree-shake lucide-react & ably — eliminasi ~250kB dari client bundle
    optimizePackageImports: ["lucide-react", "ably"],
  },

  // Apache menangani kompresi (gzip/brotli) — hindari double-compress
  compress: false,

  // Jangan tampilkan X-Powered-By
  poweredByHeader: false,

  reactStrictMode: true,
  swcMinify: true,

  // Optimisasi gambar
  images: {
    formats: ["image/avif", "image/webp"],

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

    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // Cache static assets + security headers ringan
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },

      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },

      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },

      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  webpack(config) {
    return config;
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

module.exports = withBundleAnalyzer(nextConfig);
