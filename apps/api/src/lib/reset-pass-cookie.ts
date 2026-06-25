import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";

export const PASSWORD_RESET_SESSION_COOKIE_NAME = "password_reset_session";
const PASSWORD_RESET_SESSION_EXPIRES_IN_MINUTES = 10;

export function getPasswordResetSessionExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setMinutes(
    expiresAt.getMinutes() + PASSWORD_RESET_SESSION_EXPIRES_IN_MINUTES,
  );

  return expiresAt;
}

export function setPasswordResetSessionCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date,
) {
  reply.setCookie(PASSWORD_RESET_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    signed: true,
    path: "/",
    expires: expiresAt,
  });
}

export function clearPasswordResetSessionCookie(reply: FastifyReply) {
  reply.clearCookie(PASSWORD_RESET_SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function getPasswordResetSessionTokenFromRequest(
  request: FastifyRequest,
): string | undefined {
  const signedToken = request.cookies?.[PASSWORD_RESET_SESSION_COOKIE_NAME];

  if (!signedToken) {
    return undefined;
  }

  const { valid, value } = request.unsignCookie(signedToken);

  return valid ? value : undefined;
}
