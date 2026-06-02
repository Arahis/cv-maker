import type { FastifyRequest } from "fastify";

export function getClientIp(request: FastifyRequest): string {
  const rawIp =
    request.headers["cf-connecting-ip"] ?? request.headers["x-forwarded-for"];

  const value = Array.isArray(rawIp) ? rawIp[0] : rawIp;

  return value?.split(",")[0]?.trim() || request.ip;
}
