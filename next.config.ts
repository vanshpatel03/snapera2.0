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
    // Increase timeout for video generation.
    // Default is 60s, which is not enough for Veo.
    serverActions: {
        bodySizeLimit: '5mb',
        // Increase timeout for video generation.
        // Default is 60s, which is not enough for Veo.
        // You may need to increase this further depending on video generation time.
        // Note: this timeout only applies to production builds, not development.
        // In development, the timeout is effectively unlimited.
        // https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#executiontimeout
        executionTimeout: 120,
    },
  }
};

export default nextConfig;
