import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['golem-vita-mahjong.singularitybridge.net'],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, must-revalidate' },
      ],
    },
  ],
};

export default nextConfig;
