import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Enable server actions if needed
    serverActions: {
      allowedOrigins: ["localhost:3000", "0.0.0.0:3000"],
    },
  },
};

export default nextConfig;
