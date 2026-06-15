import {
  EmailVerificationToken,
  PrismaClient,
} from "../../generated/prisma/client.js";

type CreateEmailVerificationTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export class EmailVerificationTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(
    input: CreateEmailVerificationTokenInput,
  ): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.create({
      data: input,
    });
  }

  findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }

  deleteById(id: string): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.delete({
      where: { id },
    });
  }
}
