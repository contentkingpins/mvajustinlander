/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack: (config: any) => {
    return config;
  },
}

export default nextConfig;
