import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration optimized for both Next.js and Sanity Studio compatibility
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig;
