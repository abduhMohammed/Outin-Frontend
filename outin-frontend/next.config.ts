import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // Only for local development against https://localhost:7114
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      // Production API
      {
        protocol: "https",
        hostname: "outin.runasp.net",
        pathname: "/Uploads/**",
      },
      // Local API (development only)
      ...(isDev
        ? [
            {
              protocol: "https" as const,
              hostname: "localhost",
              port: "7114",
              pathname: "/Uploads/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;