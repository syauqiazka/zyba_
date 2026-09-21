/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
              return `npm.${packageName?.replace('@', '')}`;
            },
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
