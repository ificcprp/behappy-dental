import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["read-excel-file"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
