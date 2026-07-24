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
    ],
  },
};

export default nextConfig;
