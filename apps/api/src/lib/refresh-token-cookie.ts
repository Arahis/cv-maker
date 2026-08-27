import { env } from "../config/env.js";
import { FastifyReply, FastifyRequest } from "fastify";

export function getRefreshTokenExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshTokenTtlDays);

  return expiresAt;
}

export function setRefreshTokenCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date,
) {
  reply.setCookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    signed: true,
    path: "/",
    expires: expiresAt,
  });
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function getRefreshTokenFromRequest(
  request: FastifyRequest,
): string | undefined {
  const cookies = request.cookies as Record<string, string | undefined>;
  const signedToken = cookies[env.refreshCookieName];

  if (!signedToken) {
    return undefined;
  }

  const { valid, value } = request.unsignCookie(signedToken);

  return valid ? value : undefined;
}
