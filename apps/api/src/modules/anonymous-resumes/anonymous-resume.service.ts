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
  ReleaseAnonymousResumeBody,
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

    const existingTokenQuota = await this.anonymousResumes.findAnyByTokenHash(
      tokenHash,
    );
    let hasEverUploaded = Boolean(existingTokenQuota?.hasEverUploaded);

    if (input.fingerprint) {
      const existingFingerprintQuota =
        await this.anonymousResumes.findAnyByFingerprintHmac(
          hashFingerprint(input.fingerprint),
        );
      hasEverUploaded ||= Boolean(existingFingerprintQuota?.hasEverUploaded);
    }

    return { hasEverUploaded };
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

    const existingTokenQuota = await this.anonymousResumes.findAnyByTokenHash(
      tokenHash,
    );

    if (existingTokenQuota) {
      return this.quotaExhausted(reply);
    }

    const fingerprintHmac = input.fingerprint
      ? hashFingerprint(input.fingerprint)
      : null;

    if (fingerprintHmac) {
      const existingFingerprintQuota =
        await this.anonymousResumes.findAnyByFingerprintHmac(fingerprintHmac);

      if (existingFingerprintQuota) {
        return this.quotaExhausted(reply);
      }
    }

    try {
      await this.anonymousResumes.create({
        tokenHash,
        fingerprintHmac,
        localResumeId: input.localResumeId,
        hasEverUploaded: true,
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

  async release(
    input: ReleaseAnonymousResumeBody,
    request: FastifyRequest,
    _reply: FastifyReply,
  ) {
    const existingToken = getAnonymousResumeToken(request);

    if (!existingToken) {
      return { status: "ignored" };
    }

    const tokenHash = hashToken(existingToken);
    const quota = (await this.anonymousResumes.findByLocalResumeId(
      input.localResumeId,
    )) as
      | ({
          id: string;
          tokenHash: string;
          hasEverUploaded: boolean;
        } | null);

    if (!quota || quota.tokenHash !== tokenHash) {
      return { status: "ignored" };
    }

    if (!quota.hasEverUploaded) {
      await this.anonymousResumes.deleteById(quota.id);
    } else {
      await this.anonymousResumes.markInactive(quota.id);
    }

    return { status: "released" };
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
