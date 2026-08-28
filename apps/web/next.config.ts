import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"],
      ".jsx": [".tsx", ".jsx"],
    };
    config.resolve.alias["@cv-maker/resume-renderer$"] = path.resolve(
      __dirname,
      "../../packages/resume-renderer/src/index.ts",
    );
    config.resolve.alias["@cv-maker/resume-renderer/pagination.css"] =
      path.resolve(
        __dirname,
        "../../packages/resume-renderer/src/pagination/pagination.css",
      );
    config.resolve.alias["@cv-maker/resume-renderer/renderer.css"] =
      path.resolve(
        __dirname,
        "../../packages/resume-renderer/src/renderer.css",
      );
    return config;
  },
  allowedDevOrigins: ["boastful-shudder-diligent.ngrok-free.dev"],
  turbopack: {
    // Monorepo root so Turbopack can resolve hoisted deps
    root: path.resolve(__dirname, "../.."),
    resolveAlias: {
      "@cv-maker/resume-renderer": "./packages/resume-renderer/src/index.ts",
      "@cv-maker/resume-renderer/renderer.css":
        "./packages/resume-renderer/src/renderer.css",
    },
  },
  // Keep tracing root aligned with turbopack.root
  outputFileTracingRoot: path.resolve(__dirname, "../.."),
  images: {
    unoptimized: true, // Turn off img optimization
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
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
        source: "/api/pdf",
        destination: "http://localhost:4000/pdf",
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
