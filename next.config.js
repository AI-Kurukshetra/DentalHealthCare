/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.outsourcestrategies.com',
        pathname: '/wp-content/uploads/**'
      }
    ]
  },
  experimental: {
    scrollRestoration: true
  }
};

export default nextConfig;

