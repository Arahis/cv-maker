import type {
  AnonymousResumeQuota,
  PrismaClient,
} from "../../generated/prisma/client.js";

export class AnonymousResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByTokenHash(tokenHash: string): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findUnique({
      where: { tokenHash },
    });
  }

  findByFingerprintHmac(
    fingerprintHmac: string,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findUnique({
      where: { fingerprintHmac },
    });
  }

  findByLocalResumeId(
    localResumeId: string,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findUnique({
      where: { localResumeId },
    });
  }

  create(input: {
    tokenHash: string;
    fingerprintHmac: string | null;
    localResumeId: string;
  }): Promise<AnonymousResumeQuota> {
    return this.prisma.anonymousResumeQuota.create({ data: input });
  }
}
