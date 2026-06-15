import { FastifyReply } from "fastify";
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
