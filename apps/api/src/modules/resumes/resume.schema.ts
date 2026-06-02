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

export const updateResumeBodySchema = z
  .object({
    data: resumeSchema.partial().optional(),
    template: resumeTemplateSchema.optional(),
    media: resumeMediaSchema.optional(),
  })
  .refine((body) => body.data || body.template || body.media, {
    message: "At least one field must be provided",
  });

export const resumeParamsSchema = z.object({
  id: z.string().min(1),
});

export type CreateResumeBody = z.infer<typeof createResumeBodySchema>;
export type UpdateResumeBody = z.infer<typeof updateResumeBodySchema>;
