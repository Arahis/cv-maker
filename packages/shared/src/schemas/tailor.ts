import { z } from "zod";

export const tailorRequirementImportanceSchema = z.enum(["required", "preferred"]);

export const tailorResumeSectionSchema = z.enum([
  "summary",
  "workExperience",
  "skills",
]);

export const tailorSuggestionFieldSchema = z.enum([
  "summary",
  "position",
  "description",
  "technical",
  "personal",
]);

export const tailorJobRequirementSchema = z.object({
  requirement: z.string(),
  importance: tailorRequirementImportanceSchema,
});

export const tailorStrongMatchSchema = z.object({
  requirement: z.string(),
  evidence: z.string(),
});

export const tailorMissingRequirementSchema = z.object({
  requirement: z.string(),
  importance: tailorRequirementImportanceSchema,
  explanation: z.string(),
});

export const tailorSuggestionSchema = z.object({
  section: tailorResumeSectionSchema,
  targetId: z.string(),
  field: tailorSuggestionFieldSchema,
  original: z.string(),
  suggested: z.string(),
  reason: z.string(),
});

export const tailorAnalysisSchema = z.object({
  jobRequirements: z.array(tailorJobRequirementSchema),
  strongMatches: z.array(tailorStrongMatchSchema),
  missingRequirements: z.array(tailorMissingRequirementSchema),
  suggestions: z.array(tailorSuggestionSchema),
});

export type TailorAnalysis = z.infer<typeof tailorAnalysisSchema>;
export type TailorResumeSection = z.infer<typeof tailorResumeSectionSchema>;
