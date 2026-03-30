import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export default async function cookiePlugin(app: FastifyInstance) {
  const secret = process.env.COOKIE_SECRET;

  if (!secret) {
    throw new Error("COOKIE_SECRET is not set");
  }

  await app.register(cookie, {
    secret,
    hook: "onRequest",
  });
}
