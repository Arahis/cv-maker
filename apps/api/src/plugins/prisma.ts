import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { prisma } from "../db/client.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

async function prismaPlugin(app: FastifyInstance) {
  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await app.prisma.$disconnect();
  });
}

export default fp(prismaPlugin);
