import type { ConfirmedTailorFact, TailorGenerationResult } from "@cv-maker/shared";

type Skill = { id: string; name: string };
type GeneratedSkill = { id: string | null; name: string };

export function curateTailorSkills(
  skills: GeneratedSkill[],
  existing: Skill[],
  resumeText: string,
  confirmedSkills: string[],
): GeneratedSkill[] {
  const existingById = new Map(existing.map((skill) => [skill.id, skill]));
  const normalizedResume = normalizeSkillText(resumeText);
  const confirmed = new Set(confirmedSkills.map(normalizeSkillName));
  const names = new Set<string>();
  const result: GeneratedSkill[] = [];

  for (const skill of skills) {
    const existingSkill = skill.id === null ? undefined : existingById.get(skill.id);
    // A non-null ID is only valid when it belongs to the source resume. Do not
    // let an arbitrary model-generated ID become evidence for a skill.
    if (skill.id !== null && !existingSkill) continue;
    const name = existingSkill?.name ?? skill.name;
    const normalized = normalizeSkillName(name);
    const supported = Boolean(existingSkill) || confirmed.has(normalized) || containsSkillEvidence(normalizedResume, name);
    if (!normalized || !supported || names.has(normalized)) continue;
    names.add(normalized);
    result.push({ id: existingSkill?.id ?? skill.id, name });
  }

  return result;
}

export function validateTailorClarificationCoverage(
  result: TailorGenerationResult,
  facts: ConfirmedTailorFact[],
): void {
  const expected = new Set(facts.map((fact) => fact.id));
  const seen = new Set<string>();
  for (const item of result.clarificationCoverage) {
    if (!expected.has(item.factId) || seen.has(item.factId)) {
      throw new Error("Tailor clarification coverage contains an unknown or duplicate fact");
    }
    seen.add(item.factId);
  }
  if (seen.size !== expected.size) {
    throw new Error("Tailor clarification coverage is incomplete");
  }
}

function normalizeSkillName(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/gu, " ");
}

function normalizeSkillText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase();
}

/**
 * Match a skill as a phrase, rather than as an arbitrary substring. Keeping
 * punctuation in the expression is important for names such as C++, C# and
 * .NET, while Unicode letter/number boundaries prevent matches such as `Go`
 * inside `Google`.
 */
export function containsSkillEvidence(text: string, skillName: string): boolean {
  const skill = normalizeSkillText(skillName).replace(/\s+/gu, " ").trim();
  if (!skill) return false;

  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const startsWithWord = /^[\p{L}\p{N}]/u.test(skill);
  const endsWithWord = /[\p{L}\p{N}]$/u.test(skill);
  const leftBoundary = startsWithWord ? "(?<![\\p{L}\\p{N}])" : "";
  const rightBoundary = endsWithWord ? "(?![\\p{L}\\p{N}])" : "";

  return new RegExp(`${leftBoundary}${escaped}${rightBoundary}`, "iu").test(text);
}
