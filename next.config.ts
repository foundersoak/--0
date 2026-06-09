import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the Redis client out of the bundle; require it at runtime in the
  // Node.js serverless function instead.
  serverExternalPackages: ["ioredis"],
};

export default nextConfig;
