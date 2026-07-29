import { z } from "zod";

export const claimAnonymousResumeBodySchema = z.object({
  localResumeId: z.uuid(),
  fingerprint: z.string().trim().min(1).max(512).nullable(),
});

export type ClaimAnonymousResumeBody = z.infer<
  typeof claimAnonymousResumeBodySchema
>;
