import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hashPassword, verifyPassword } from "../../lib/hash.js";
import { signAccessToken, verifyAccessToken } from "../../lib/jwt.js";
import {
  clearRefreshTokenCookie,
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  getRefreshTokenFromRequest,
  hashRefreshToken,
  setRefreshTokenCookie,
} from "../../lib/refresh-token.js";
import type { LoginBody, SignupBody } from "./auth.schema.js";
import { UserRepository } from "../users/user.repository.js";
import { AuthAccountRepository } from "./auth.repository.js";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";
import { getClientIp } from "../../lib/get-client-IP.js";

export class AuthService {
  private readonly users;
  private readonly authAccounts;
  private readonly refreshSessions;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.authAccounts = new AuthAccountRepository(app.prisma);
    this.refreshSessions = new RefreshSessionRepository(app.prisma);
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

    const user = await this.users.create(input.email, passwordHash);

    await this.authAccounts.create({
      userId: user.id,
      provider: "credentials",
      providerAccountId: user.email,
    });

    const rawRefreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
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

    reply.code(201);

    return {
      accessToken,
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
    const rawRefreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
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

    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
    console.log({ refreshTokenHash });
    const session =
      await this.refreshSessions.findByTokenHash(refreshTokenHash);

    console.log("Session found for refresh token:", !!session);

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
      const refreshTokenHash = hashRefreshToken(rawRefreshToken);

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
