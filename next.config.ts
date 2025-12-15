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
}

export default nextConfig
