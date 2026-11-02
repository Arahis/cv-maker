export type TailorChoiceOption = { value: string };

export function normalizeTailorChoiceAnswer(text: string, options: TailorChoiceOption[]): string | null {
  const normalized = text.trim().toLocaleLowerCase();
  if (!/^(all|all of them|everything|both|both of them)$/i.test(normalized) || options.length === 0) return null;
  return options.map((option) => option.value).join("; ");
}
