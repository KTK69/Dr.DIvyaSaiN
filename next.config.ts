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
};

export default nextConfig;
