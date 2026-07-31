import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["boastful-shudder-diligent.ngrok-free.dev"],
  turbopack: {
    // Monorepo root so Turbopack can resolve hoisted deps
    root: path.resolve(__dirname, "../.."),
  },
  // Keep tracing root aligned with turbopack.root
  outputFileTracingRoot: path.resolve(__dirname, "../.."),
  images: {
    unoptimized: true, // Turn off img optimization
  },
  async rewrites() {
    const apiRoutes = [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:4000/auth/:path*",
      },
      {
        source: "/api/resumes/:path*",
        destination: "http://localhost:4000/resumes/:path*",
      },
      {
        source: "/api/uploads/:path*",
        destination: "http://localhost:4000/uploads/:path*",
      },
      {
        source: "/api/anonymous-resumes/:path*",
        destination: "http://localhost:4000/anonymous-resumes/:path*",
      },
      {
        source: "/api/pars-resume",
        destination: "http://localhost:4000/pars-resume",
      },
      {
        source: "/api/pars-resume/:path*",
        destination: "http://localhost:4000/pars-resume/:path*",
      },
    ];

    return { beforeFiles: apiRoutes };
  },
};

export default nextConfig;
