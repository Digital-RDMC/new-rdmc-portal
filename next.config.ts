import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint during builds (you can run it separately)
    ignoreDuringBuilds: true,
    // Directories/files to ignore
    dirs: ['**/*.stories.tsx', '.storybook', 'storybook-static']
  },
  
  // Configure external domains for images and API calls
  images: {
    domains: ['n8n.srv869586.hstgr.cloud', 'lh3.googleusercontent.com', 'photos.rdmc-portal.com']
  },
  
  // Configure rewrites for API proxy (optional)
  async rewrites() {
    return [
      {
        source: '/api/n8n/:path*',
        destination: 'https://n8n.srv869586.hstgr.cloud/:path*',
      },
    ];
  },
  
  // Headers for CORS handling
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
