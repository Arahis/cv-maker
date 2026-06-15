import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";

export const EMAIL_VERIFICATION_SESSION_COOKIE_NAME =
  "emailVerificationSession";

export function setEmailVerificationSessionCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date,
) {
  reply.setCookie(EMAIL_VERIFICATION_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    signed: true,
    path: "/auth/email-verification",
    expires: expiresAt,
  });
}

export function clearEmailVerificationSessionCookie(reply: FastifyReply) {
  reply.clearCookie(EMAIL_VERIFICATION_SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/auth/email-verification",
  });
}

export function getEmailVerificationSessionTokenFromRequest(
  request: FastifyRequest,
): string | undefined {
  const signedToken = request.cookies?.[EMAIL_VERIFICATION_SESSION_COOKIE_NAME];

  if (!signedToken) {
    return undefined;
  }

  const { valid, value } = request.unsignCookie(signedToken);

  return valid ? value : undefined;
}
