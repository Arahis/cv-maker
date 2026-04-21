import Fastify from "fastify";
import corsPlugin from "./plugins/cors.js";
import cookiePlugin from "./plugins/cookie.js";
import prismaPlugin from "./plugins/prisma.js";
import healthRoutes from "./modules/health/health.route.js";
import authRoutes from "./modules/auth/auth.route.js";

export function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(corsPlugin);
  app.register(cookiePlugin);
  app.register(prismaPlugin);

  app.register(healthRoutes, { prefix: "/health" });
  app.register(authRoutes, { prefix: "/auth" });

  return app;
}
