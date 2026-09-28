/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // OpenNext 1.20 não distingue os segmentos com prefetchInlining ativo.
    // https://github.com/opennextjs/opennextjs-aws/issues/1212
    ...(process.env.CLOUDFLARE_BUILD === '1' ? { prefetchInlining: false } : {}),
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
  images: {
    // A beta usa os arquivos locais na CDN, sem depender de Cloudflare Images.
    unoptimized: process.env.CLOUDFLARE_BUILD === '1',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
