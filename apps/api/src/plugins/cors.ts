import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function corsPlugin(app: FastifyInstance) {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

  await app.register(cors, {
    origin: (origin, cb) => {
      const normalizedOrigin = origin?.trim().replace(/\/$/, "");

      if (
        !normalizedOrigin ||
        normalizedOrigin === "null" ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        cb(null, true);
      } else {
        app.log.warn({ origin }, "Rejected CORS origin");
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });
}

export default fp(corsPlugin);
