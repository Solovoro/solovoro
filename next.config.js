/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // keep default webpack; do NOT override resolve.alias
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
