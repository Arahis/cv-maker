import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "../config/env.js";

async function cookiePlugin(app: FastifyInstance) {
  const secret = env.cookieSecret;

  if (!secret) {
    throw new Error("COOKIE_SECRET is not set");
  }

  await app.register(cookie, {
    secret,
    hook: "onRequest",
  });
}

export default fp(cookiePlugin);
