/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.outsourcestrategies.com',
        pathname: '/wp-content/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/9.x/**'
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**'
      }
    ]
  },
  experimental: {
    scrollRestoration: true
  }
};

export default nextConfig;
