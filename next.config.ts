import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    BACKEND_URL: process.env.BACKEND_URL
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  }
};

export default nextConfig;
