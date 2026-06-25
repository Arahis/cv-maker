import { PrismaClient, RefreshSession } from "../../generated/prisma/client.js";

type CreateRefreshSessionInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
};

type RefreshSessionPrismaClient = Pick<PrismaClient, "refreshSession">;

export class RefreshSessionRepository {
  constructor(private readonly prisma: RefreshSessionPrismaClient) {}

  create(input: CreateRefreshSessionInput): Promise<RefreshSession> {
    return this.prisma.refreshSession.create({
      data: input,
    });
  }

  findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    return this.prisma.refreshSession.findUnique({
      where: { tokenHash },
    });
  }

  deleteByTokenHash(tokenHash: string): Promise<RefreshSession> {
    return this.prisma.refreshSession.delete({
      where: { tokenHash },
    });
  }

  deleteManyByUserId(userId: string) {
    return this.prisma.refreshSession.deleteMany({
      where: { userId },
    });
  }
}
