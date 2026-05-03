import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
  },
  reactCompiler: false,
  async redirects() {
    return [
      { source: "/about", destination: "/aboutus", permanent: true },
      { source: "/testimonials", destination: "/reviews", permanent: true },
      { source: "/doctors-talk", destination: "/drvideo", permanent: true },
      { source: "/contact", destination: "/contactus", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      {
        source: "/services/reconstructive/:slug",
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: "/services/cosmetic/:slug",
        destination: "/services/:slug",
        permanent: true,
      },
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
