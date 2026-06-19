import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.exoticindia.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
