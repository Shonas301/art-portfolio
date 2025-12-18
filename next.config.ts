import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // enable react 19 features
  reactStrictMode: true,

  // output directory
  distDir: '.next',

  // typescript/eslint during builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

export default nextConfig
