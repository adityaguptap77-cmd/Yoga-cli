/** @type {import('next').NextConfig} */
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:4000').replace(/\/+$/, '');

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  // The browser only ever talks to this app. API calls and uploaded images are proxied to the backend,
  // so cookies stay same-site and no CORS setup is needed.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default nextConfig;
