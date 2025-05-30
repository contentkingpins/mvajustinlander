/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    return config;
  },
  // Ensure we're using the correct output
  output: 'standalone',
  // Disable powered by header
  poweredByHeader: false,
}

module.exports = nextConfig;
