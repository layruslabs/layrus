import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The project was renamed after it shipped, so the old case-study URL is
      // still in the wild and in search results.
      {
        source: "/projects/ai-sales-employee",
        destination: "/projects/peengly",
        permanent: true,
      },
      // Renamed a second time when peeng.com turned out to be taken. Anything
      // shared or indexed under the shorter name still resolves.
      {
        source: "/projects/peeng",
        destination: "/projects/peengly",
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
