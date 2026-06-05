import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
  },
  reactCompiler: false,
  async redirects() {
    return [
      {
        source: "/home/save",
        destination: "/api/appointments",
        permanent: false,
      },
      {
        source: "/home/getServices",
        destination: "/api/services",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:filename",
        destination: "/api/uploads/:filename",
      },
    ];
  },
};

export default nextConfig;
