import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";

const ANONYMOUS_RESUME_COOKIE_NAME = "anonymous_resume_token";
const ANONYMOUS_RESUME_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export function setAnonymousResumeCookie(reply: FastifyReply, token: string) {
  reply.setCookie(ANONYMOUS_RESUME_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    signed: true,
    path: "/",
    maxAge: ANONYMOUS_RESUME_COOKIE_MAX_AGE_SECONDS,
  });
}

export function getAnonymousResumeToken(
  request: FastifyRequest,
): string | undefined {
  const cookies = request.cookies as Record<string, string | undefined>;
  const signedToken = cookies[ANONYMOUS_RESUME_COOKIE_NAME];

  if (!signedToken) {
    return undefined;
  }

  const { valid, value } = request.unsignCookie(signedToken);

  return valid ? value : undefined;
}
