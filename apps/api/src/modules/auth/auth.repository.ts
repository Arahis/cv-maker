import { AuthAccount, PrismaClient } from "../../generated/prisma/client.js";

type CreateAuthAccountInput = {
  userId: string;
  provider: string;
  providerAccountId: string;
};

export class AuthAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(input: CreateAuthAccountInput): Promise<AuthAccount> {
    return this.prisma.authAccount.create({
      data: input,
    });
  }
}
