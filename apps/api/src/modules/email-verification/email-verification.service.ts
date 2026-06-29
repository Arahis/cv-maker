import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { z } from "zod";
import {
  generateVerificationCode,
  getVerificationCodeExpiresAt,
  hashVerificationCode,
} from "../../lib/verification-code.js";
import { EmailVerificationCodeRepository } from "./email-verification.repository.js";
import { sendVerificationCodeEmail } from "../../lib/email/auth-email.js";
import { emailSchema } from "@cv-maker/shared";
import { UserRepository } from "../users/user.repository.js";
import { AuthAccountRepository } from "../auth/auth.repository.js";
import { AuthSessionService } from "../auth/auth-session.service.js";

export const verifyEmailCodeBodySchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export class EmailVerificationService {
  private readonly users;
  private readonly emailVerificationCode;
  private readonly authAccounts;
  private readonly authSessionService;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.emailVerificationCode = new EmailVerificationCodeRepository(
      app.prisma,
    );
    this.authAccounts = new AuthAccountRepository(app.prisma);
    this.authSessionService = new AuthSessionService(app);
  }

  async sendEmailVerificationCode(input: { userId: string; email: string }) {
    const code = generateVerificationCode();

    const codeHash = hashVerificationCode(input.userId, code);

    const expiresAt = getVerificationCodeExpiresAt();

    await this.emailVerificationCode.upsert({
      userId: input.userId,
      codeHash,
      expiresAt,
    });

    await sendVerificationCodeEmail({
      to: input.email,
      code,
    });
  }

  async verifyEmailCode(request: FastifyRequest, reply: FastifyReply) {
    const parsedBody = verifyEmailCodeBodySchema.safeParse(request.body);

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
        status: "invalid_code",
      };
    }

    if (user.emailVerifiedAt) {
      reply.code(400);
      return {
        status: "already_verified",
      };
    }

    const verificationCode = await this.emailVerificationCode.findByUserId(
      user.id,
    );

    if (!verificationCode) {
      reply.code(400);
      return {
        status: "invalid_code",
      };
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.emailVerificationCode.deleteById(verificationCode.id);

      reply.code(400);
      return {
        status: "expired_code",
      };
    }

    if (verificationCode.attempts >= 5) {
      await this.emailVerificationCode.deleteById(verificationCode.id);

      reply.code(400);
      return {
        status: "too_many_attempts",
      };
    }

    const codeHash = hashVerificationCode(user.id, code);

    if (codeHash !== verificationCode.codeHash) {
      await this.emailVerificationCode.incrementAttempts(verificationCode.id);

      reply.code(400);
      return {
        status: "invalid_code",
      };
    }

    await this.users.markEmailAsVerified(user.id);

    await this.authAccounts.upsertCredentialsAccount({
      userId: user.id,
      providerAccountId: user.email,
    });

    await this.emailVerificationCode.deleteById(verificationCode.id);

    // authSessionService.createSession also sets the refresh token cookie in the response, so we don't need to do it here
    const { accessToken } = await this.authSessionService.createSession({
      userId: user.id,
      email: user.email,
      request,
      reply,
    });

    return {
      status: "verified",
      accessToken,
    };
  }
}
