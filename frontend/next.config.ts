import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',           // Required for Docker multi-stage builds
  reactStrictMode: true,
  poweredByHeader: false,         // Remove X-Powered-By header for security
  compress: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
