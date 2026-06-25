import { PrismaClient } from "../../generated/prisma/client.js";

type PasswordResetSessionPrismaClient = Pick<
  PrismaClient,
  "passwordResetSession"
>;

export class PasswordResetSessionRepository {
  constructor(private readonly prisma: PasswordResetSessionPrismaClient) {}

  upsert(input: { userId: string; sessionHash: string; expiresAt: Date }) {
    return this.prisma.passwordResetSession.upsert({
      where: {
        userId: input.userId,
      },
      update: {
        sessionHash: input.sessionHash,
        expiresAt: input.expiresAt,
      },
      create: {
        userId: input.userId,
        sessionHash: input.sessionHash,
        expiresAt: input.expiresAt,
      },
    });
  }

  findBySessionHash(sessionHash: string) {
    return this.prisma.passwordResetSession.findUnique({
      where: {
        sessionHash,
      },
    });
  }

  deleteById(id: string) {
    return this.prisma.passwordResetSession.delete({
      where: {
        id,
      },
    });
  }

  deleteByUserId(userId: string) {
    return this.prisma.passwordResetSession.deleteMany({
      where: {
        userId,
      },
    });
  }
}
