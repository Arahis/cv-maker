import {
  EmailVerificationSession,
  PrismaClient,
} from "../../generated/prisma/client.js";

type CreateEmailVerificationSessionInput = {
  userId: string;
  sessionHash: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent?: string;
};

export class EmailVerificationSessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(
    input: CreateEmailVerificationSessionInput,
  ): Promise<EmailVerificationSession> {
    return this.prisma.emailVerificationSession.create({
      data: input,
    });
  }
}
