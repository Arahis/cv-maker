import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { z } from "zod";
import { hashToken } from "../../lib/tokens.js";
import { UserRepository } from "../users/user.repository.js";
import { EmailVerificationTokenRepository } from "./email-verification-token.repository.js";

const verifyEmailBodySchema = z.object({
  token: z.string().min(1),
});

export class EmailVerificationService {
  private readonly users;
  private readonly emailVerification;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.emailVerification = new EmailVerificationTokenRepository(app.prisma);
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

  async getStatus(request: FastifyRequest, reply: FastifyReply) {}
}
