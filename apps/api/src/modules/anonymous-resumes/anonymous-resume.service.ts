import crypto from "crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import {
  getAnonymousResumeToken,
  setAnonymousResumeCookie,
} from "../../lib/anonymous-resume-cookie.js";
import { createSecureToken, hashToken } from "../../lib/tokens.js";
import { env } from "../../config/env.js";
import type {
  CheckAnonymousResumeQuotaBody,
  ClaimAnonymousResumeBody,
} from "./anonymous-resume.schema.js";
import { AnonymousResumeRepository } from "./anonymous-resume.repository.js";

function hashFingerprint(fingerprint: string): string {
  return crypto
    .createHmac("sha256", env.anonymousResumeFingerprintSecret)
    .update(fingerprint)
    .digest("hex");
}

export class AnonymousResumeService {
  private readonly anonymousResumes;

  constructor(app: FastifyInstance) {
    this.anonymousResumes = new AnonymousResumeRepository(app.prisma);
  }

  async check(
    input: CheckAnonymousResumeQuotaBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { tokenHash } = this.getOrCreateToken(request, reply);

    const existingTokenQuota =
      await this.anonymousResumes.findByTokenHash(tokenHash);

    if (existingTokenQuota) {
      return this.quotaExhausted(reply);
    }

    if (input.fingerprint) {
      const existingFingerprintQuota =
        await this.anonymousResumes.findByFingerprintHmac(
          hashFingerprint(input.fingerprint),
        );

      if (existingFingerprintQuota) {
        return this.quotaExhausted(reply);
      }
    }

    return { status: "available" };
  }

  async claim(
    input: ClaimAnonymousResumeBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { tokenHash } = this.getOrCreateToken(request, reply);

    const existingLocalResume = await this.anonymousResumes.findByLocalResumeId(
      input.localResumeId,
    );

    if (existingLocalResume) {
      return { status: "claimed" };
    }

    const existingTokenQuota =
      await this.anonymousResumes.findByTokenHash(tokenHash);

    if (existingTokenQuota) {
      return this.quotaExhausted(reply);
    }

    const fingerprintHmac = input.fingerprint
      ? hashFingerprint(input.fingerprint)
      : null;

    if (fingerprintHmac) {
      const existingFingerprintQuota =
        await this.anonymousResumes.findByFingerprintHmac(fingerprintHmac);

      if (existingFingerprintQuota) {
        return this.quotaExhausted(reply);
      }
    }

    try {
      await this.anonymousResumes.create({
        tokenHash,
        fingerprintHmac,
        localResumeId: input.localResumeId,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return this.quotaExhausted(reply);
      }

      throw error;
    }

    reply.code(201);
    return { status: "claimed" };
  }

  private quotaExhausted(reply: FastifyReply) {
    reply.code(409);
    return { error: "Anonymous resume quota exhausted" };
  }

  private getOrCreateToken(request: FastifyRequest, reply: FastifyReply) {
    const existingToken = getAnonymousResumeToken(request);

    if (existingToken) {
      return { tokenHash: hashToken(existingToken) };
    }

    const { token, tokenHash } = createSecureToken();
    setAnonymousResumeCookie(reply, token);

    return { tokenHash };
  }
}
