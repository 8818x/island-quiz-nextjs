import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, options) => {
    if (options.dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
