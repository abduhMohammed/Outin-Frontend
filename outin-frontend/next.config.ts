import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7114",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "your-backend-domain.runasp.net", 
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;