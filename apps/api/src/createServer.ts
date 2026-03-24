import Fastify from "fastify";
import corsPlugin from "./plugins/cors.js";
import cookiePlugin from "./plugins/cookie.js";
import healthRoutes from "./modules/health/health.route.js";

export function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(corsPlugin);
  app.register(cookiePlugin);

  app.register(healthRoutes, { prefix: "/health" });

  return app;
}
