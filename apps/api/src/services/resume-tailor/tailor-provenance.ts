import type { ConfirmedTailorFact, TailorAnswer } from "@cv-maker/shared";

export function filterExperienceIds(ids: string[], experienceIds: ReadonlySet<string>): string[] {
  return [...new Set(ids)].filter((id) => experienceIds.has(id));
}

export function sanitizeAnswerProvenance(
  answers: TailorAnswer[],
  experienceIds: ReadonlySet<string>,
): TailorAnswer[] {
  return answers.map((answer) => ({
    ...answer,
    relatedExperienceIds: filterExperienceIds(answer.relatedExperienceIds, experienceIds),
  }));
}

export function sanitizeConfirmedFacts(
  facts: ConfirmedTailorFact[],
  experienceIds: ReadonlySet<string>,
): ConfirmedTailorFact[] {
  return facts.map((fact) => ({
    ...fact,
    relatedExperienceIds: filterExperienceIds(fact.relatedExperienceIds, experienceIds),
    primaryTarget: fact.primaryTarget?.section === "workExperience" && !experienceIds.has(fact.primaryTarget.experienceId)
      ? null
      : fact.primaryTarget,
  }));
}
