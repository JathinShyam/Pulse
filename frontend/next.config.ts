import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
