import { z } from "zod";
import {
  resumeMediaSchema,
  resumeSchema,
  resumeTemplateSchema,
  tailorAnswerSchema,
  confirmedTailorFactSchema,
  tailorRefinementTargetSchema,
} from "@cv-maker/shared";

export const createResumeBodySchema = z.object({
  data: resumeSchema,
  template: resumeTemplateSchema.default("template1"),
  media: resumeMediaSchema,
});

export const saveLocalResumeToAccountBodySchema = createResumeBodySchema.extend(
  {
    localResumeId: z.string().min(1, "Local resume id is required"),
  },
);

export const updateResumeBodySchema = z
  .object({
    data: resumeSchema.partial().optional(),
  })
  .refine((body) => body.data, {
    message: "At least one field must be provided",
  });

export const updateResumeTemplateBodySchema = z.object({
  template: resumeTemplateSchema,
});

export const updateResumeMediaBodySchema = z.object({
  media: resumeMediaSchema,
});

const tailorJobInputSchema = {
  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .trim()
    .min(1, "Job description is required"),
  jobDescriptionUrl: z.url().optional(),
};

export const tailorResumeBodySchema = z.discriminatedUnion("mode", [
  z.object({
    ...tailorJobInputSchema,
    mode: z.literal("generate"),
    answers: z.array(tailorAnswerSchema).default([]),
    confirmedFacts: z.array(confirmedTailorFactSchema).default([]),
    confirmedSkills: z.array(z.string().min(1).max(80)).default([]),
    sessionId: z.string().min(1).optional(),
  }),
  z.object({
    ...tailorJobInputSchema,
    mode: z.literal("refine"),
    target: tailorRefinementTargetSchema,
    userInstruction: z.string().trim().min(1),
    currentValue: z.string(),
    originalValue: z.string().default(""),
    answers: z.array(tailorAnswerSchema).default([]),
    confirmedSkills: z.array(z.string().min(1).max(80)).default([]),
  }),
]);
export const createTailorConversationBodySchema = z.object({
  jobTitle: z.string().trim().min(1),
  jobDescription: z.string().trim().min(1),
});
export const tailorConversationParamsSchema = z.object({ id: z.string().min(1), sessionId: z.string().min(1) });
export const sendTailorConversationMessageBodySchema = z.object({
  messageId: z.string().min(1),
  text: z.string().trim().min(1).max(4000),
});

export const resumeParamsSchema = z.object({
  id: z.string().min(1),
});

export type CreateResumeBody = z.infer<typeof createResumeBodySchema>;
export type UpdateResumeBody = z.infer<typeof updateResumeBodySchema>;
export type UpdateResumeTemplateBody = z.infer<
  typeof updateResumeTemplateBodySchema
>;
export type UpdateResumeMediaBody = z.infer<typeof updateResumeMediaBodySchema>;
export type TailorResumeBody = z.infer<typeof tailorResumeBodySchema>;
export type CreateTailorConversationBody = z.infer<typeof createTailorConversationBodySchema>;
export type SendTailorConversationMessageBody = z.infer<typeof sendTailorConversationMessageBodySchema>;
export type SaveLocalResumeToAccountBody = z.infer<
  typeof saveLocalResumeToAccountBodySchema
>;
