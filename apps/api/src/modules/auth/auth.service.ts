import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hashPassword, verifyPassword } from "../../lib/hash.js";
import { signAccessToken, verifyAccessToken } from "../../lib/jwt.js";
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from "../../lib/refresh-token-cookie.js";
import type { LoginBody, SignupBody } from "./auth.schema.js";
import { UserRepository } from "../users/user.repository.js";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";
import { hashToken } from "../../lib/tokens.js";
import { EmailVerificationService } from "../email-verification/email-verification.service.js";
import { PasswordResetSessionRepository } from "../password-reset/password-reset-session.repository.js";
import { clearPasswordResetSessionCookie } from "../../lib/reset-pass-cookie.js";
import { AuthSessionService } from "./auth-session.service.js";
import { getAuthenticatedUserId } from "../../lib/get-authenticated-user-id.js";
import { AuthAccountRepository } from "./auth.repository.js";
import {
  GoogleTokenService,
  GoogleTokenVerificationError,
} from "./google-token.service.js";
import { randomBytes } from "node:crypto";

export class AuthService {
  private readonly prisma;
  private readonly users;
  private readonly refreshSessions;
  private readonly emailVerification;
  private readonly passwordResetSessions;
  private readonly authSessionService;
  private readonly authAccounts;
  private readonly googleTokenService;

  constructor(app: FastifyInstance) {
    this.prisma = app.prisma;
    this.users = new UserRepository(app.prisma);
    this.refreshSessions = new RefreshSessionRepository(app.prisma);
    this.passwordResetSessions = new PasswordResetSessionRepository(app.prisma);
    this.emailVerification = new EmailVerificationService(app);
    this.authSessionService = new AuthSessionService(app);
    this.authAccounts = new AuthAccountRepository(app.prisma);
    this.googleTokenService = new GoogleTokenService();
  }

  async signup(
    input: SignupBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const existingUser = await this.users.findByEmail(input.email);

    if (existingUser?.emailVerifiedAt) {
      reply.code(409);
      return {
        error: "Email is already in use",
      };
    }

    const passwordHash = await hashPassword(input.password);

    const user = existingUser
      ? await this.users.update(existingUser.id, passwordHash)
      : await this.users.create(input.email, passwordHash);

    await this.emailVerification.sendEmailVerificationCode({
      userId: user.id,
      email: user.email,
    });

    return {
      message:
        "The code has been sent to your email. Please verify your email to complete the signup process.",
      status: "verification_required",
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

    await this.passwordResetSessions.deleteByUserId(user.id);

    clearPasswordResetSessionCookie(reply);

    // authSessionService.createSession also sets the refresh token cookie in the response, so we don't need to do it here
    const { accessToken } = await this.authSessionService.createSession({
      userId: user.id,
      email: user.email,
      request,
      reply,
    });

    return {
      accessToken,
    };
  }

  async googleLogin(
    input: { credential: string },
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    let googleUser;

    try {
      googleUser = await this.googleTokenService.verifyIdToken(
        input.credential,
      );
    } catch (error) {
      if (error instanceof GoogleTokenVerificationError) {
        throw error;
      }

      throw error;
    }

    const linkedAccount = await this.authAccounts.findByProviderAccountId(
      "google",
      googleUser.providerAccountId,
    );

    let user =
      linkedAccount?.user ?? (await this.users.findByEmail(googleUser.email));

    if (!user) {
      const unusablePasswordHash = await hashPassword(
        randomBytes(32).toString("hex"),
      );

      user = await this.users.create(
        googleUser.email,
        unusablePasswordHash,
        new Date(),
      );
    } else if (!user.emailVerifiedAt) {
      user = await this.users.markEmailAsVerified(user.id);
    }

    await this.authAccounts.upsertGoogleAccount({
      userId: user.id,
      providerAccountId: googleUser.providerAccountId,
    });

    const { accessToken } = await this.authSessionService.createSession({
      userId: user.id,
      email: user.email,
      request,
      reply,
    });

    return { accessToken };
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const rawRefreshToken = getRefreshTokenFromRequest(request);

    if (!rawRefreshToken) {
      reply.code(200);
      return { status: "unauthenticated", accessToken: null };
    }

    const refreshTokenHash = hashToken(rawRefreshToken);

    const session =
      await this.refreshSessions.findByTokenHash(refreshTokenHash);

    if (!session) {
      clearRefreshTokenCookie(reply);
      reply.code(200);
      return { status: "unauthenticated", accessToken: null };
    }

    if (session.expiresAt < new Date()) {
      clearRefreshTokenCookie(reply);
      await this.refreshSessions.deleteByTokenHash(session.tokenHash);
      reply.code(200);
      return { status: "unauthenticated", accessToken: null };
    }

    const user = await this.users.findById(session.userId);

    if (!user) {
      clearRefreshTokenCookie(reply);
      await this.refreshSessions.deleteByTokenHash(session.tokenHash);
      reply.code(200);
      return { status: "unauthenticated", accessToken: null };
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

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      reply.code(401);
      return { error: "Unauthorized" };
    }

    // Related records are deleted by the database through ON DELETE CASCADE.
    await this.users.delete(auth.userId);

    clearRefreshTokenCookie(reply);

    return { success: true };
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
