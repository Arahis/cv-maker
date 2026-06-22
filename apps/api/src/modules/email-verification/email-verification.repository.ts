import { PrismaClient } from "../../generated/prisma/client.js";

export class EmailVerificationCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  upsert(input: { userId: string; codeHash: string; expiresAt: Date }) {
    return this.prisma.emailVerificationCode.upsert({
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

  findByUserId(userId: string) {
    return this.prisma.emailVerificationCode.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  incrementAttempts(id: string) {
    return this.prisma.emailVerificationCode.update({
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
    return this.prisma.emailVerificationCode.delete({
      where: {
        id,
      },
    });
  }

  deleteByUserId(userId: string) {
    return this.prisma.emailVerificationCode.deleteMany({
      where: {
        userId,
      },
    });
  }
}
