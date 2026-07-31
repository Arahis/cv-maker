import Fastify from "fastify";
import { env } from "./config/env.js";
import multipart from "@fastify/multipart";
import corsPlugin from "./plugins/cors.js";
import cookiePlugin from "./plugins/cookie.js";
import prismaPlugin from "./plugins/prisma.js";
import healthRoutes from "./modules/health/health.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import resumeRoutes from "./modules/resumes/resume.route.js";
import uploadRoutes from "./modules/uploads/upload.route.js";
import openapiTestRoutes from "./modules/pars-resume/pars.route.js";
import anonymousResumeRoutes from "./modules/anonymous-resumes/anonymous-resume.route.js";

export function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(corsPlugin);
  app.register(cookiePlugin);
  app.register(prismaPlugin);
  app.register(multipart, {
    limits: {
      files: 1,
      fileSize: env.resumeImportMaxFileSizeBytes,
    },
  });

  app.register(healthRoutes, { prefix: "/health" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(resumeRoutes, { prefix: "/resumes" });
  app.register(uploadRoutes, { prefix: "/uploads" });
  app.register(anonymousResumeRoutes, { prefix: "/anonymous-resumes" });
  app.register(openapiTestRoutes, { prefix: "/" });

  return app;
}
