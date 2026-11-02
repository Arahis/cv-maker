import {
  tailorGenerationResultSchema,
  tailorRefinementResultSchema,
  type TailorAnswer,
  type TailorGenerationResult,
  type TailorRefinementTarget,
  type TailorRefinementResult,
  type ConfirmedTailorFact,
} from "@cv-maker/shared";
import { env } from "../../config/env.js";
import { parseTailorResponse } from "./openai-structured.js";
import {
  TAILOR_GENERATION_INSTRUCTIONS,
  TAILOR_REFINEMENT_INSTRUCTIONS,
} from "./tailor.instructions.js";
import { debugTailorInput, type PreparedTailorInput } from "./prepare-tailor-input.js";
import { sanitizeAnswerProvenance, sanitizeConfirmedFacts } from "./tailor-provenance.js";
import { curateTailorSkills, validateTailorClarificationCoverage } from "./tailor-generation-policy.js";

export class ResumeTailorService {
  async generate({
    resume,
    jobTitle,
    jobDescription,
    answers,
    confirmedFacts = [],
    confirmedSkills,
  }: {
    resume: PreparedTailorInput;
    jobTitle: string;
    jobDescription: string;
    answers: TailorAnswer[];
    confirmedFacts?: ConfirmedTailorFact[];
    confirmedSkills: string[];
  }): Promise<TailorGenerationResult> {
    debugTailorInput(resume);
    const experienceIds = new Set(resume.workExperience.map((experience) => experience.id));
    const safeAnswers = sanitizeAnswerProvenance(answers, experienceIds);
    const safeFacts = sanitizeConfirmedFacts(confirmedFacts, experienceIds);
    const result = await parseTailorResponse(
      tailorGenerationResultSchema,
      "tailor_generation",
      TAILOR_GENERATION_INSTRUCTIONS,
      { resume, job: { title: jobTitle, description: jobDescription }, answers: safeAnswers, confirmedFacts: safeFacts, confirmedSkills },
      env.openAiTailorGenerationModel,
    );

    validateTailorClarificationCoverage(result, safeFacts);
    validateTailorResult(result, resume, confirmedSkills);
    return result;
  }

  async refine({
    resume,
    jobTitle,
    jobDescription,
    target,
    userInstruction,
    currentValue,
    originalValue,
    answers,
    confirmedSkills,
  }: {
    resume: PreparedTailorInput;
    jobTitle: string;
    jobDescription: string;
    target: TailorRefinementTarget;
    userInstruction: string;
    currentValue: string;
    originalValue: string;
    answers: TailorAnswer[];
    confirmedSkills: string[];
  }): Promise<TailorRefinementResult> {
    const experienceIds = new Set(resume.workExperience.map((experience) => experience.id));
    if (target.section === "workExperience" || target.section === "workExperienceEntry") {
      const experience = resume.workExperience.find(({ id }) => id === target.experienceId);
      if (!experience) throw new Error("Tailor refinement targets an unknown work experience");
      if (target.section === "workExperienceEntry" && !experience.bullets.some(({ id }) => id === target.entryId)) {
        throw new Error("Tailor refinement targets an unknown work-experience entry");
      }
    }
    const result = await parseTailorResponse(
      tailorRefinementResultSchema,
      "tailor_refinement",
      TAILOR_REFINEMENT_INSTRUCTIONS,
      { resume, job: { title: jobTitle, description: jobDescription }, target, currentValue, originalValue, userInstruction, answers: sanitizeAnswerProvenance(answers, experienceIds), confirmedSkills },
      env.openAiTailorGenerationModel,
    );
    return result;
  }
}

function validateTailorResult(
  result: TailorGenerationResult,
  resume: PreparedTailorInput,
  confirmedSkills: string[],
): void {
  const technicalSkills = new Map(resume.skills.technical.map((skill) => [skill.id, skill.name]));
  const personalSkills = new Map(resume.skills.personal.map((skill) => [skill.id, skill.name]));

  normalizeRecommendedResume(result.recommendedResume, resume, confirmedSkills);
  validateSkills(result.recommendedResume.skills.technical, technicalSkills);
  validateSkills(result.recommendedResume.skills.personal, personalSkills);
}

function normalizeRecommendedResume(
  tailoredResume: TailorGenerationResult["recommendedResume"],
  resume: PreparedTailorInput,
  confirmedSkills: string[],
) {
  const sourceDuration = extractExplicitDuration(resume.summary ?? "");
  if (sourceDuration && containsDifferentDuration(tailoredResume.summary, sourceDuration)) {
    tailoredResume.summary = resume.summary ?? "";
  }

  const returnedExperiences = new Map(tailoredResume.workExperience.map((experience) => [experience.experienceId, experience]));
  tailoredResume.workExperience = resume.workExperience.map((source) => {
    const returned = returnedExperiences.get(source.id);
    const sourceEntries = new Map(source.bullets.map((bullet) => [bullet.id, bullet]));
    const seenSourceEntryIds = new Set<string>();
    const entries = (returned?.entries ?? []).map((entry) => {
      if (entry.type === "add") return entry;
      const sourceEntry = sourceEntries.get(entry.sourceEntryId);
      if (!sourceEntry || seenSourceEntryIds.has(entry.sourceEntryId)) {
        throw new Error("Tailor recommendation references an invalid or duplicate work-experience entry");
      }
      seenSourceEntryIds.add(entry.sourceEntryId);
      return entry.type === "rewrite"
        ? { type: "rewrite" as const, sourceEntryId: sourceEntry.id, text: entry.text }
        : { type: "preserve" as const, sourceEntryId: sourceEntry.id };
    });

    // Existing source entries are never silently dropped. If the model omits one,
    // preserve it at the end of the requested operation order.
    for (const sourceEntry of source.bullets) {
      if (!seenSourceEntryIds.has(sourceEntry.id)) {
        entries.push({ type: "preserve", sourceEntryId: sourceEntry.id });
      }
    }
    return {
      experienceId: source.id,
      entries,
    };
  });

  const sourceText = JSON.stringify(resume);
  tailoredResume.skills.technical = curateTailorSkills(tailoredResume.skills.technical, resume.skills.technical, sourceText, confirmedSkills);
  tailoredResume.skills.personal = curateTailorSkills(tailoredResume.skills.personal, resume.skills.personal, sourceText, confirmedSkills);
}

function extractExplicitDuration(value: string) {
  return value.match(/\b\d+(?:\.\d+)?\s+years?\b/i)?.[0] ?? null;
}

function containsDifferentDuration(value: string, sourceDuration: string) {
  const generatedDuration = /\b(?:\d+(?:\.\d+)?\s*(?:-|–|to)\s*\d+\s*years?|\d+(?:\.\d+)?\s+years?|over\s+\d+\s+years?|more than\s+\d+\s+years?|several\s+years?)\b/i.exec(value)?.[0];
  return Boolean(generatedDuration && !normalizeSkillText(value).includes(normalizeSkillText(sourceDuration)));
}

function normalizeSkillText(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/gu, " ");
}

function validateSkills(
  skills: Array<{ id: string | null; name: string }>,
  existing: Map<string, string>,
) {
  const names = new Set<string>();
  for (const skill of skills) {
    const normalized = normalizeSkillText(skill.name);
    if (!normalized || names.has(normalized)) throw new Error("Tailor recommendation contains duplicate skills");
    names.add(normalized);
    if (skill.id !== null && existing.get(skill.id) !== skill.name) {
      throw new Error("Tailor recommendation changed an existing skill identity");
    }
  }
}
