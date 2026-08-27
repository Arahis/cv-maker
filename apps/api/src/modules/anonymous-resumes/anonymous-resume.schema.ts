import { z } from "zod";

export const claimAnonymousResumeBodySchema = z.object({
  localResumeId: z.uuid(),
  fingerprint: z.string().trim().min(1).max(512).nullable(),
});

export const checkAnonymousResumeQuotaBodySchema =
  claimAnonymousResumeBodySchema.pick({ fingerprint: true });

export const releaseAnonymousResumeBodySchema = z.object({
  localResumeId: z.uuid(),
});

export type ClaimAnonymousResumeBody = z.infer<
  typeof claimAnonymousResumeBodySchema
>;

export type ReleaseAnonymousResumeBody = z.infer<
  typeof releaseAnonymousResumeBodySchema
>;

export type CheckAnonymousResumeQuotaBody = z.infer<
  typeof checkAnonymousResumeQuotaBodySchema
>;
