import {
  AuthAccount,
  PrismaClient,
  User,
} from "../../generated/prisma/client.js";

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

  findByProviderAccountId(
    provider: string,
    providerAccountId: string,
  ): Promise<(AuthAccount & { user: User }) | null> {
    return this.prisma.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });
  }

  upsertGoogleAccount(input: CreateAuthAccountInput): Promise<AuthAccount> {
    return this.prisma.authAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: input.providerAccountId,
        },
      },
      create: {
        userId: input.userId,
        provider: "google",
        providerAccountId: input.providerAccountId,
      },
      update: {
        userId: input.userId,
      },
    });
  }
}
