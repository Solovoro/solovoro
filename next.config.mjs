/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // keep default webpack; do NOT override resolve.alias
  webpack: (config) => config,
};

export default nextConfig;
