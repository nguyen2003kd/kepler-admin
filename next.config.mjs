/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: "/admin",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kepler-dev.meucorp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4100',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'http://localhost:4100'}/api/storage/:path*`,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;

