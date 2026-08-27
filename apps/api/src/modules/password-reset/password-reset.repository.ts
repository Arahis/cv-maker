import { PrismaClient } from "../../generated/prisma/client.js";

type PasswordResetCodePrismaClient = Pick<PrismaClient, "passwordResetCode">;

export class PasswordResetCodeRepository {
  constructor(private readonly prisma: PasswordResetCodePrismaClient) {}

  upsert(input: { userId: string; codeHash: string; expiresAt: Date }) {
    return this.prisma.passwordResetCode.upsert({
      where: {
        userId: input.userId,
      },
      create: {
        userId: input.userId,
        codeHash: input.codeHash,
        expiresAt: input.expiresAt,
        attempts: 0,
      },
      update: {
        codeHash: input.codeHash,
        expiresAt: input.expiresAt,
        attempts: 0,
      },
    });
  }

  incrementAttempts(id: string) {
    return this.prisma.passwordResetCode.update({
      where: {
        id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  deleteById(id: string) {
    return this.prisma.passwordResetCode.delete({
      where: {
        id,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.passwordResetCode.findUnique({
      where: {
        userId,
      },
    });
  }
}
