import type {
  AnonymousResumeQuota,
  PrismaClient,
} from "../../generated/prisma/client.js";

export class AnonymousResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByTokenHash(
    tokenHash: string,
    hasEverUploaded: boolean,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findUnique({
      where: {
        tokenHash_hasEverUploaded: { tokenHash, hasEverUploaded },
      } as never,
    });
  }

  findAnyByTokenHash(tokenHash: string): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findFirst({
      where: { tokenHash },
    });
  }

  findActiveByTokenHash(tokenHash: string): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findFirst({
      where: { tokenHash, active: true } as never,
    });
  }

  findByFingerprintHmac(
    fingerprintHmac: string,
    hasEverUploaded: boolean,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findUnique({
      where: {
        fingerprintHmac_hasEverUploaded: {
          fingerprintHmac,
          hasEverUploaded,
        },
      } as never,
    });
  }

  findAnyByFingerprintHmac(
    fingerprintHmac: string,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findFirst({
      where: { fingerprintHmac },
    });
  }

  findActiveByFingerprintHmac(
    fingerprintHmac: string,
  ): Promise<AnonymousResumeQuota | null> {
    return this.prisma.anonymousResumeQuota.findFirst({
      where: { fingerprintHmac, active: true } as never,
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
    hasEverUploaded: boolean;
  }): Promise<AnonymousResumeQuota> {
    return this.prisma.anonymousResumeQuota.create({ data: input });
  }

  deleteById(id: string): Promise<AnonymousResumeQuota> {
    return this.prisma.anonymousResumeQuota.delete({ where: { id } });
  }

  markInactive(id: string): Promise<AnonymousResumeQuota> {
    return this.prisma.anonymousResumeQuota.update({
      where: { id },
      data: { active: false } as never,
    });
  }
}
