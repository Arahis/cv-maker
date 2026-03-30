import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export default async function corsPlugin(app: FastifyInstance) {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  });
}
