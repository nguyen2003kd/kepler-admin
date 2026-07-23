/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/admin",
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'smeq-dev.meucorp.com',
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
