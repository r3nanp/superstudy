import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@crawlee/cheerio", "crawlee", "@dqbd/tiktoken"],
};

export default nextConfig;
