/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
