import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["read-excel-file"],
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
