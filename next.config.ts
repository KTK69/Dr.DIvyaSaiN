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
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.drdivyaplasticsurgeon.com",
          },
        ],
        destination: "https://drdivyaplasticsurgeon.com/:path*",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/aboutus",
        permanent: true,
      },
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contactus",
        permanent: true,
      },
      {
        source: "/doctors-talk",
        destination: "/drvideo",
        permanent: true,
      },
      {
        source: "/experience",
        destination: "/aboutus",
        permanent: true,
      },
      {
        source: "/testimonials",
        destination: "/reviews",
        permanent: true,
      },
      {
        source: "/blog/natural-vs-artificial-dimples-differences",
        destination: "/blog/natural-vs-artificial-dimples",
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
