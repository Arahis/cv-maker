import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hashPassword, verifyPassword } from "../../lib/hash.js";
import { signAccessToken, verifyAccessToken } from "../../lib/jwt.js";
import {
  clearRefreshTokenCookie,
  getRefreshTokenExpiresAt,
  getRefreshTokenFromRequest,
  setRefreshTokenCookie,
} from "../../lib/refresh-token.js";
import type { LoginBody, SignupBody } from "./auth.schema.js";
import { UserRepository } from "../users/user.repository.js";
import { AuthAccountRepository } from "./auth.repository.js";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";
import { getClientIp } from "../../lib/get-client-IP.js";
import {
  addHours,
  addMinutes,
  generateToken,
  hashToken,
} from "../../lib/tokens.js";
import { sendEmailVerificationEmail } from "../../lib/auth-emails.js";
import { EmailVerificationTokenRepository } from "../email-verification/email-verification-token.repository.js";
import { EmailVerificationSessionRepository } from "../email-verification/email-verification-session.repository.js";
import { setEmailVerificationSessionCookie } from "../../lib/cookies.js";

export class AuthService {
  private readonly users;
  private readonly authAccounts;
  private readonly refreshSessions;
  private readonly emailVerificationTokens;
  private readonly emailVerificationSessions;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.authAccounts = new AuthAccountRepository(app.prisma);
    this.refreshSessions = new RefreshSessionRepository(app.prisma);
    this.emailVerificationTokens = new EmailVerificationTokenRepository(
      app.prisma,
    );
    this.emailVerificationSessions = new EmailVerificationSessionRepository(
      app.prisma,
    );
  }

  async signup(
    input: SignupBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const existingUser = await this.users.findByEmail(input.email);

    if (existingUser) {
      reply.code(409);
      return {
        error: "Email is already in use",
      };
    }

    const passwordHash = await hashPassword(input.password);

    // Gen token for email verification
    const rawEmailVerificationToken = generateToken();
    const emailVerificationTokenHash = hashToken(rawEmailVerificationToken);
    const emailVerificationTokenExpiresAt = addHours(24);

    // Gen token to update email verification session
    const rawEmailVerificationSessionToken = generateToken();
    const emailVerificationSessionHash = hashToken(
      rawEmailVerificationSessionToken,
    );
    const emailVerificationSessionExpiresAt = addMinutes(10);

    const user = await this.users.create(input.email, passwordHash);

    await this.authAccounts.create({
      userId: user.id,
      provider: "credentials",
      providerAccountId: user.email,
    });

    await this.emailVerificationTokens.create({
      userId: user.id,
      tokenHash: emailVerificationTokenHash,
      expiresAt: emailVerificationTokenExpiresAt,
    });

    await this.emailVerificationSessions.create({
      userId: user.id,
      sessionHash: emailVerificationSessionHash,
      expiresAt: emailVerificationSessionExpiresAt,
      ...(request.headers["user-agent"]
        ? { userAgent: request.headers["user-agent"] }
        : {}),
      ipAddress: getClientIp(request) ?? "unknown", // Fallback to "unknown" if IP cannot be determined
    });

    setEmailVerificationSessionCookie(
      reply,
      rawEmailVerificationSessionToken,
      emailVerificationSessionExpiresAt,
    );

    await sendEmailVerificationEmail({
      to: user.email,
      token: rawEmailVerificationToken,
    });

    reply.code(201);

    return {
      message:
        "Account created. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(input: LoginBody, request: FastifyRequest, reply: FastifyReply) {
    const user = await this.users.findByEmail(input.email);

    if (!user) {
      reply.code(401);
      return {
        error: "Invalid email or password",
      };
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      reply.code(401);
      return {
        error: "Invalid email or password",
      };
    }

    //TODO: From this part the code almost repeats in both login and signup, we should extract it to a separate method
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

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const rawRefreshToken = getRefreshTokenFromRequest(request);

    if (!rawRefreshToken) {
      reply.code(401);
      return { error: "Missing refresh token" };
    }

    const refreshTokenHash = hashToken(rawRefreshToken);

    const session =
      await this.refreshSessions.findByTokenHash(refreshTokenHash);

    if (!session) {
      clearRefreshTokenCookie(reply);
      reply.code(401);
      return { error: "Invalid or expired refresh token" };
    }

    if (session.expiresAt < new Date()) {
      clearRefreshTokenCookie(reply);
      await this.refreshSessions.deleteByTokenHash(session.tokenHash);
      reply.code(401);
      return { error: "Invalid or expired refresh token" };
    }

    const user = await this.users.findById(session.userId);

    if (!user) {
      clearRefreshTokenCookie(reply);
      await this.refreshSessions.deleteByTokenHash(session.tokenHash);
      reply.code(401);
      return { error: "User not found" };
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const rawRefreshToken = getRefreshTokenFromRequest(request);

    if (rawRefreshToken) {
      const refreshTokenHash = hashToken(rawRefreshToken);

      try {
        await this.refreshSessions.deleteByTokenHash(refreshTokenHash);
      } catch (error) {
        request.log.error(error);
      }
    }

    clearRefreshTokenCookie(reply);

    return {
      success: true,
    };
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      reply.code(401);
      return { error: "Missing or invalid authorization header" };
    }

    const token = authHeader.slice("Bearer ".length);

    try {
      const payload = verifyAccessToken(token);
      const user = await this.users.findById(payload.sub);

      if (!user) {
        reply.code(401);
        return { error: "User not found" };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch {
      reply.code(401);
      return { error: "Invalid or expired access token" };
    }
  }
}
