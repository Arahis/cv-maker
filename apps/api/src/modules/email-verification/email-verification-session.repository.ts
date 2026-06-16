import {
  EmailVerificationSession,
  PrismaClient,
} from "../../generated/prisma/client.js";

type CreateEmailVerificationSessionInput = {
  userId: string;
  sessionHash: string;
  expiresAt: Date;
  ipAddress?: string;
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

  findBySessionHash(
    sessionHash: string,
  ): Promise<EmailVerificationSession | null> {
    return this.prisma.emailVerificationSession.findUnique({
      where: { sessionHash },
    });
  }

  deleteById(id: string): Promise<EmailVerificationSession> {
    return this.prisma.emailVerificationSession.delete({
      where: { id },
    });
  }
}
