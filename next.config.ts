import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Enable linting during builds for production readiness
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  // Removed output: 'export' to allow server-side features
};

export default nextConfig;
