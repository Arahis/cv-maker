import type { FastifyInstance } from "fastify";

export default async function healthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    await app.prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
      service: "api",
      db: "ok",
    };
  });
}
