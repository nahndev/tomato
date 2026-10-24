import type { NextConfig } from 'next';

const COPILOT_URL = process.env.COPILOT_URL ?? 'http://localhost:3004';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    agentUpgrade: 'security',
  },
  async rewrites() {
    return [{ source: '/copilotkit/:path*', destination: `${COPILOT_URL}/copilotkit/:path*` }];
  },
};

export default nextConfig;
