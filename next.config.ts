import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 一時的にESLintを無効化
  },
  productionBrowserSourceMaps: true, // 本番でもソースマップを有効化
};

export default nextConfig;
