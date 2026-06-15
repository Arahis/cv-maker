import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { z } from "zod";
import { generateToken, hashToken } from "../../lib/tokens.js";
import { UserRepository } from "../users/user.repository.js";
import { EmailVerificationTokenRepository } from "./email-verification-token.repository.js";
import { EmailVerificationSessionRepository } from "./email-verification-session.repository.js";
import {
  clearEmailVerificationSessionCookie,
  getEmailVerificationSessionTokenFromRequest,
} from "../../lib/cookies.js";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";
import {
  getRefreshTokenExpiresAt,
  setRefreshTokenCookie,
} from "../../lib/refresh-token.js";
import { signAccessToken } from "../../lib/jwt.js";
import { getClientIp } from "../../lib/get-client-IP.js";

const verifyEmailBodySchema = z.object({
  token: z.string().min(1),
});

export class EmailVerificationService {
  private readonly users;
  private readonly emailVerification;
  private readonly emailVerificationSessions;
  private readonly refreshSessions;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.emailVerification = new EmailVerificationTokenRepository(app.prisma);
    this.emailVerificationSessions = new EmailVerificationSessionRepository(
      app.prisma,
    );
    this.refreshSessions = new RefreshSessionRepository(app.prisma);
  }

  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    const parsedBody = verifyEmailBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        message: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    const { token } = parsedBody.data;

    const tokenHash = hashToken(token);

    const verificationToken =
      await this.emailVerification.findByTokenHash(tokenHash);

    if (!verificationToken) {
      reply.code(400);
      return {
        status: "invalid_token",
      };
    }

    if (verificationToken.expiresAt < new Date()) {
      await this.emailVerification.deleteById(verificationToken.id);

      reply.code(400);
      return {
        status: "expired_token",
      };
    }

    await this.users.markEmailAsVerified(verificationToken.userId);

    await this.emailVerification.deleteById(verificationToken.id);

    return {
      status: "verified",
    };
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    const rawSessionToken = getEmailVerificationSessionTokenFromRequest(request);

    if (!rawSessionToken) {
      reply.code(401);
      return {
        status: "invalid_session",
      };
    }

    const sessionHash = hashToken(rawSessionToken);
    const session =
      await this.emailVerificationSessions.findBySessionHash(sessionHash);

    if (!session) {
      clearEmailVerificationSessionCookie(reply);
      reply.code(401);
      return {
        status: "invalid_session",
      };
    }

    if (session.expiresAt < new Date()) {
      clearEmailVerificationSessionCookie(reply);
      await this.emailVerificationSessions.deleteById(session.id);
      reply.code(401);
      return {
        status: "expired_session",
      };
    }

    const user = await this.users.findById(session.userId);

    if (!user) {
      clearEmailVerificationSessionCookie(reply);
      await this.emailVerificationSessions.deleteById(session.id);
      reply.code(404);
      return {
        status: "user_not_found",
      };
    }

    if (user.emailVerifiedAt === null) {
      return {
        status: "pending",
      };
    }

    const rawRefreshToken = generateToken();
    const refreshTokenHash = hashToken(rawRefreshToken);
    const refreshExpiresAt = getRefreshTokenExpiresAt();

    await this.refreshSessions.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshExpiresAt,
      ...(request.headers["user-agent"]
        ? { userAgent: request.headers["user-agent"] }
        : {}),
      ipAddress: getClientIp(request),
    });

    setRefreshTokenCookie(reply, rawRefreshToken, refreshExpiresAt);
    clearEmailVerificationSessionCookie(reply);
    await this.emailVerificationSessions.deleteById(session.id);

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      status: "verified",
      accessToken,
    };
  }
}
