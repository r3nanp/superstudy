import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@crawlee/cheerio", "crawlee"],
};

export default nextConfig;
