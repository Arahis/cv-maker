import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo root so Turbopack can resolve hoisted deps
    root: path.resolve(__dirname, "../.."),
  },
  // Keep tracing root aligned with turbopack.root
  outputFileTracingRoot: path.resolve(__dirname, "../.."),
  images: {
    unoptimized: true, // Turn off img optimization
  },
};

export default nextConfig;
