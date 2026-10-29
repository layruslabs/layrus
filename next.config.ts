import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The project was renamed after it shipped, so the old case-study URL is
      // still in the wild and in search results.
      {
        source: "/projects/ai-sales-employee",
        destination: "/projects/peeng",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
