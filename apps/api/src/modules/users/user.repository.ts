import { PrismaClient, User } from "../../generated/prisma/client.js";

type UserPrismaClient = Pick<PrismaClient, "user">;

export class UserRepository {
  constructor(private readonly prisma: UserPrismaClient) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async pdfParse(userId: string, limit: number): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        id: userId,
        pdfParseCount: { lt: limit },
      } as never,
      data: {
        pdfParseCount: { increment: 1 },
      } as never,
    });

    return result.count === 1;
  }

  async canParsePdf(userId: string, limit: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        pdfParseCount: { lt: limit },
      } as never,
      select: { id: true },
    });

    return Boolean(user);
  }

  create(
    email: string,
    passwordHash: string,
    emailVerifiedAt?: Date,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        ...(emailVerifiedAt ? { emailVerifiedAt } : {}),
      },
    });
  }

  update(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  markEmailAsVerified(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  delete(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
