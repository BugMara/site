import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes out/ which any static host can serve.
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
