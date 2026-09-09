import { createTextReader } from "../text-reader.js";
import type { ResumeForm } from "@cv-maker/shared";

export const hasFilledFields = (items: Array<string | boolean>) =>
  items.some((value) => {
    if (typeof value === "string") {
      return value.trim() !== "";
    }
  });

export function isEducationFilled(
  item: NonNullable<ResumeForm["educations"]>[number],
) {
  const { id, ...fieldsToCheck } = item;

  return hasFilledFields(Object.values(fieldsToCheck));
}

export function isWorkExperienceFilled(
  item: NonNullable<ResumeForm["workExperiences"]>[number],
) {
  const { descriptionBullets, id, ...fieldsToCheck } = item;

  const hasDescription = descriptionBullets?.some(
    (bullet) => createTextReader(bullet.text).text.trim() !== "",
  );

  return Boolean(hasDescription) || hasFilledFields(Object.values(fieldsToCheck));
}

export function isSocialFilled(
  item: NonNullable<ResumeForm["socialLinks"]>[number],
) {
  const { id, ...itemsToCheck } = item;
  return hasFilledFields(Object.values(itemsToCheck));
}

export function isLanguageFilled(
  item: NonNullable<ResumeForm["languages"]>[number],
) {
  const { id, ...itemsToCheck } = item;
  return hasFilledFields(Object.values(itemsToCheck));
}
