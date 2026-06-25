import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../users/user.repository.js";
import { PasswordResetCodeRepository } from "./password-reset.repository.js";
import z from "zod";
import {
  emailSchema,
  forgotPasswordResetPasswordBodySchema,
  forgotPasswordVerifyBodySchema,
  signupPasswordSchema,
} from "@cv-maker/shared";
import {
  generateVerificationCode,
  getVerificationCodeExpiresAt,
  hashVerificationCode,
} from "../../lib/verification-code.js";
import { sendPasswordResetEmailCode } from "../../lib/email/reset-pass-email.js";
import { PasswordResetSessionRepository } from "./password-reset-session.repository.js";
import {
  clearPasswordResetSessionCookie,
  getPasswordResetSessionExpiresAt,
  getPasswordResetSessionTokenFromRequest,
  setPasswordResetSessionCookie,
} from "../../lib/reset-pass-cookie.js";
import { generateToken, hashToken } from "../../lib/tokens.js";
import { hashPassword } from "../../lib/hash.js";
import { RefreshSessionRepository } from "../refresh-sessions/refresh-session.repository.js";

export const requestPasswordResetCodeBodySchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
  password: signupPasswordSchema,
});

export class PasswordResetService {
  private readonly users;
  private readonly passwordResetCodes;

  constructor(private readonly app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.passwordResetCodes = new PasswordResetCodeRepository(app.prisma);
  }

  async sendCode(request: FastifyRequest, reply: FastifyReply) {
    const parsedBody = requestPasswordResetCodeBodySchema.safeParse(
      request.body,
    );

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    const { email } = parsedBody.data;

    const user = await this.users.findByEmail(email);

    // status: "ok" is returned even if the user does not exist to prevent user enumeration attacks.
    if (!user) {
      return { status: "ok" };
    }

    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(user.id, code);
    const expiresAt = getVerificationCodeExpiresAt();

    await this.app.prisma.$transaction(async (tx) => {
      const passwordResetCodesTX = new PasswordResetCodeRepository(tx);
      const passwordResetSessionsTX = new PasswordResetSessionRepository(tx);

      // Delete any existing password reset sessions for the user to ensure only one active session at a time.
      await passwordResetSessionsTX.deleteByUserId(user.id);

      await passwordResetCodesTX.upsert({
        userId: user.id,
        codeHash,
        expiresAt,
      });
    });

    await sendPasswordResetEmailCode({
      to: user.email,
      code,
    });

    return { status: "ok" };
  }

  async verifyCode(request: FastifyRequest, reply: FastifyReply) {
    const parsedBody = forgotPasswordVerifyBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    const { email, code } = parsedBody.data;

    const user = await this.users.findByEmail(email);

    if (!user) {
      reply.code(400);
      return {
        error: "Invalid or expired reset code",
      };
    }

    const passwordResetCode = await this.passwordResetCodes.findByUserId(
      user.id,
    );

    if (!passwordResetCode) {
      reply.code(400);
      return {
        error: "Invalid or expired reset code",
      };
    }

    if (passwordResetCode.expiresAt < new Date()) {
      await this.passwordResetCodes.deleteById(passwordResetCode.id);

      reply.code(400);
      return {
        error: "Invalid or expired reset code",
      };
    }

    if (passwordResetCode.attempts >= 5) {
      await this.passwordResetCodes.deleteById(passwordResetCode.id);

      reply.code(400);
      return {
        error: "Invalid or expired reset code",
      };
    }

    const codeHash = hashVerificationCode(user.id, code);

    if (passwordResetCode.codeHash !== codeHash) {
      const updatedCode = await this.passwordResetCodes.incrementAttempts(
        passwordResetCode.id,
      );

      if (updatedCode.attempts >= 5) {
        await this.passwordResetCodes.deleteById(updatedCode.id);
      }

      reply.code(400);
      return {
        error: "Invalid or expired reset code",
      };
    }

    const rawSessionToken = generateToken();
    const sessionHash = hashToken(rawSessionToken);
    const sessionExpiresAt = getPasswordResetSessionExpiresAt();

    await this.app.prisma.$transaction(async (tx) => {
      const passwordResetCodesTX = new PasswordResetCodeRepository(tx);
      const passwordResetSessionsTX = new PasswordResetSessionRepository(tx);

      await passwordResetCodesTX.deleteById(passwordResetCode.id);

      await passwordResetSessionsTX.upsert({
        userId: user.id,
        sessionHash,
        expiresAt: sessionExpiresAt,
      });
    });

    setPasswordResetSessionCookie(reply, rawSessionToken, sessionExpiresAt);

    return {
      status: "code_verified",
    };
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const parsedBody = forgotPasswordResetPasswordBodySchema.safeParse(
      request.body,
    );

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    const rawSessionToken = getPasswordResetSessionTokenFromRequest(request);

    if (!rawSessionToken) {
      reply.code(401);
      return {
        error: "Invalid or expired reset session",
      };
    }

    const sessionHash = hashToken(rawSessionToken);

    const passwordResetSession =
      await this.app.prisma.passwordResetSession.findUnique({
        where: {
          sessionHash,
        },
      });

    if (!passwordResetSession) {
      clearPasswordResetSessionCookie(reply);

      reply.code(401);
      return {
        error: "Invalid or expired reset session",
      };
    }

    if (passwordResetSession.expiresAt < new Date()) {
      await this.app.prisma.passwordResetSession.delete({
        where: {
          id: passwordResetSession.id,
        },
      });

      clearPasswordResetSessionCookie(reply);

      reply.code(401);
      return {
        error: "Invalid or expired reset session",
      };
    }

    const { password } = parsedBody.data;

    const passwordHash = await hashPassword(password);

    await this.app.prisma.$transaction(async (tx) => {
      const usersTX = new UserRepository(tx);
      const passwordResetSessionsTX = new PasswordResetSessionRepository(tx);
      const refreshSessionsTX = new RefreshSessionRepository(tx);

      await usersTX.update(passwordResetSession.userId, passwordHash);

      await passwordResetSessionsTX.deleteById(passwordResetSession.id);

      await refreshSessionsTX.deleteManyByUserId(passwordResetSession.userId);
    });

    clearPasswordResetSessionCookie(reply);

    return {
      status: "password_reset_success",
    };
  }
}
