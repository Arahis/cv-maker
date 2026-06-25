import type { FastifyReply, FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";
import { generateToken, hashToken } from "../../lib/tokens.js";
import {
  getRefreshTokenExpiresAt,
  setRefreshTokenCookie,
} from "../../lib/refresh-token-cookie.js";
import { getClientIp } from "../../lib/get-client-IP.js";
import { signAccessToken } from "../../lib/jwt.js";

export class AuthSessionService {
  private readonly refreshSessions;

  constructor(app: FastifyInstance) {
    this.refreshSessions = new RefreshSessionRepository(app.prisma);
  }

  async createSession({
    userId,
    email,
    request,
    reply,
  }: {
    userId: string;
    email: string;
    request: FastifyRequest;
    reply: FastifyReply;
  }) {
    const rawRefreshToken = generateToken();
    const refreshTokenHash = hashToken(rawRefreshToken);
    const refreshTokenExpiresAt = getRefreshTokenExpiresAt();

    await this.refreshSessions.create({
      userId,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      ...(request.headers["user-agent"]
        ? { userAgent: request.headers["user-agent"] }
        : {}),
      ipAddress: getClientIp(request),
    });

    setRefreshTokenCookie(reply, rawRefreshToken, refreshTokenExpiresAt);

    const accessToken = signAccessToken({
      sub: userId,
      email,
    });

    return {
      accessToken,
    };
  }
}
