import { z } from "zod";
import {
  resumeMediaSchema,
  resumeSchema,
  resumeTemplateSchema,
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

export const tailorResumeBodySchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .trim()
    .min(1, "Job description is required"),
  jobDescriptionUrl: z.url().optional(),
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
export type SaveLocalResumeToAccountBody = z.infer<
  typeof saveLocalResumeToAccountBodySchema
>;
