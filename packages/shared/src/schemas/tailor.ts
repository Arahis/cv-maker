import { z } from "zod";

export const tailorTargetSectionSchema = z.enum(["summary", "workExperience", "skills"]);
export const tailorAnswerValueSchema = z.union([z.string(), z.array(z.string()), z.boolean()]);

const tailoredSkillSchema = z.object({
  id: z.string().min(1).nullable(),
  name: z.string().min(1).max(80),
});
export const tailoredExperienceEntrySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("preserve"), sourceEntryId: z.string().min(1) }),
  z.object({ type: z.literal("rewrite"), sourceEntryId: z.string().min(1), text: z.string().min(1) }),
  z.object({ type: z.literal("add"), text: z.string().min(1) }),
]);
const tailoredResumeSchema = z.object({
  summary: z.string(),
  workExperience: z.array(z.object({
    experienceId: z.string().min(1),
    entries: z.array(tailoredExperienceEntrySchema),
  })),
  skills: z.object({
    technical: z.array(tailoredSkillSchema),
    personal: z.array(tailoredSkillSchema),
  }),
});

export const tailorQuestionTargetSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("summary") }),
  z.object({ section: z.literal("skills") }),
  z.object({ section: z.literal("workExperience"), experienceId: z.string().min(1) }),
]);
export const tailorGenerationResultSchema = z.object({
  recommendedResume: tailoredResumeSchema,
  clarificationCoverage: z.array(z.object({
    factId: z.string().min(1),
    status: z.enum(["used", "redundant", "not_relevant"]),
    rationale: z.string().min(1),
  })),
});
export const tailorAnswerSchema = z.object({
  questionId: z.string().min(1),
  value: tailorAnswerValueSchema,
  relatedExperienceIds: z.array(z.string().min(1)),
});
export const confirmedTailorFactSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  status: z.enum(["confirmed", "partial", "rejected"]),
  statement: z.string().nullable(),
  primaryTarget: tailorQuestionTargetSchema.nullable(),
  relatedExperienceIds: z.array(z.string().min(1)),
  involvement: z.string().nullable(),
  sourceMessageIds: z.array(z.string().min(1)),
});
const tailorConversationOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});
const tailorConversationQuestionSchema = z.object({
  id: z.string().min(1),
  message: z.string().min(1),
  placeholder: z.string().min(1).nullable(),
  examples: z.array(tailorConversationOptionSchema).min(1).max(5),
});
export const tailorConversationTurnSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("questions"),
    message: z.string().min(1),
    questions: z.array(tailorConversationQuestionSchema).min(1).max(5),
  }),
  z.object({
    type: z.literal("choice"),
    message: z.string().min(1),
    options: z.array(tailorConversationOptionSchema).min(1).max(6),
    allowFreeText: z.boolean(),
  }),
  z.object({
    type: z.literal("text"),
    message: z.string().min(1),
    placeholder: z.string().min(1).nullable(),
  }),
  z.object({ type: z.literal("complete"), message: z.string().min(1) }),
]);
const tailorRecommendedChangeSchema = z.object({
  id: z.string().min(1),
  section: tailorTargetSectionSchema,
  description: z.string().min(1),
  evidence: z.array(z.string().min(1)),
});
const tailorGapSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  reason: z.string().min(1),
  impact: z.string().min(1),
  target: tailorQuestionTargetSchema.nullable(),
});
export const tailorInitialAnalysisSchema = z.object({
  overview: z.string().min(1),
  strengths: z.array(z.string().min(1)),
  recommendedChanges: z.array(tailorRecommendedChangeSchema),
  unresolvedImportantGaps: z.array(tailorGapSchema),
  needsClarification: z.boolean(),
});
export const tailorConversationResponseSchema = z.object({
  initialAnalysis: tailorInitialAnalysisSchema.nullable(),
  turn: tailorConversationTurnSchema,
  confirmedFacts: z.array(confirmedTailorFactSchema).max(20),
});
export const tailorConversationMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["assistant", "user"]),
  text: z.string(),
  createdAt: z.string(),
});
export const tailorConversationSessionSchema = z.object({
  id: z.string().min(1),
  resumeId: z.string().min(1),
  jobTitle: z.string(),
  jobDescription: z.string(),
  initialAnalysis: tailorInitialAnalysisSchema.nullable(),
  status: z.enum(["clarifying", "readyToGenerate", "generated"]),
  messages: z.array(tailorConversationMessageSchema),
  turn: tailorConversationTurnSchema,
  confirmedFacts: z.array(confirmedTailorFactSchema),
});
export const tailorRefinementTargetSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("summary") }),
  z.object({ section: z.literal("skills") }),
  z.object({ section: z.literal("workExperience"), experienceId: z.string().min(1) }),
  z.object({ section: z.literal("workExperienceEntry"), experienceId: z.string().min(1), entryId: z.string().min(1) }),
]);
export const tailorRefinementResultSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("summary"), value: z.string() }),
  z.object({ section: z.literal("skills"), technical: z.array(tailoredSkillSchema), personal: z.array(tailoredSkillSchema) }),
  z.object({ section: z.literal("workExperience"), experienceId: z.string().min(1), entries: z.array(tailoredExperienceEntrySchema) }),
  z.object({ section: z.literal("workExperienceEntry"), experienceId: z.string().min(1), entryId: z.string().min(1), value: z.string().min(1) }),
]);

export type TailorGenerationResult = z.infer<typeof tailorGenerationResultSchema>;
export type TailorAnswer = z.infer<typeof tailorAnswerSchema>;
export type TailorRecommendedResume = z.infer<typeof tailoredResumeSchema>;
export type TailorQuestionTarget = z.infer<typeof tailorQuestionTargetSchema>;
export type TailoredExperienceEntry = z.infer<typeof tailoredExperienceEntrySchema>;
export type TailorRefinementTarget = z.infer<typeof tailorRefinementTargetSchema>;
export type TailorRefinementResult = z.infer<typeof tailorRefinementResultSchema>;
export type ConfirmedTailorFact = z.infer<typeof confirmedTailorFactSchema>;
export type TailorConversationTurn = z.infer<typeof tailorConversationTurnSchema>;
export type TailorConversationQuestion = z.infer<typeof tailorConversationQuestionSchema>;
export type TailorConversationResponse = z.infer<typeof tailorConversationResponseSchema>;
export type TailorInitialAnalysis = z.infer<typeof tailorInitialAnalysisSchema>;
export type TailorConversationSession = z.infer<typeof tailorConversationSessionSchema>;
export type TailorConversationMessage = z.infer<typeof tailorConversationMessageSchema>;
