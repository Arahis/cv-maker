import { PrismaClient, RefreshSession } from "../../generated/prisma/client.js";

type CreateRefreshSessionInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
};

export class RefreshSessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
}
