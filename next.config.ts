import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['develop', '100.84.64.19', 'localhost'],
};

export default nextConfig;
