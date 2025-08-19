import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '5mb',
    // Increase timeout for long-running AI tasks.
    // Default is 60s.
    // You may need to increase this further depending on generation time.
    // Note: this timeout only applies to production builds, not development.
    // In development, the timeout is effectively unlimited.
    // https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#executiontimeout
    executionTimeout: 120,
  },
};

export default nextConfig;
