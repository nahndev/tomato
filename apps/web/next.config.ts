import { STORAGE_FILE_MAX_SIZE } from "@tomato/constants";
import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:3001";
const COPILOT_URL = process.env.COPILOT_URL ?? "http://localhost:3004";
const STORAGE_URL = process.env.STORAGE_URL ?? "http://localhost:3006";
const MULTIPART_OVERHEAD = 1024 * 1024;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@tomato/image-map"],
  experimental: {
    agentUpgrade: "security",
    // Rewrites cut request bodies at 10 MB by default.
    proxyClientMaxBodySize: STORAGE_FILE_MAX_SIZE + MULTIPART_OVERHEAD,
  },
  async rewrites() {
    return [
      {
        source: "/rest/copilotkit/:path*",
        destination: `${COPILOT_URL}/copilotkit/:path*`,
      },
      {
        source: "/rest/storage/:path*",
        destination: `${STORAGE_URL}/rest/:path*`,
      },
      {
        source: "/rest/core/:path*",
        destination: `${API_URL}/rest/:path*`,
      },
    ];
  },
};

export default nextConfig;
