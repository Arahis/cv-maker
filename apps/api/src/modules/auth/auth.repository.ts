import { AuthAccount, PrismaClient } from "../../generated/prisma/client.js";

type CreateAuthAccountInput = {
  userId: string;
  providerAccountId: string;
};

export class AuthAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  upsertCredentialsAccount(
    input: CreateAuthAccountInput,
  ): Promise<AuthAccount> {
    return this.prisma.authAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: "credentials",
          providerAccountId: input.providerAccountId,
        },
      },
      create: {
        userId: input.userId,
        provider: "credentials",
        providerAccountId: input.providerAccountId,
      },
      update: {},
    });
  }
}
