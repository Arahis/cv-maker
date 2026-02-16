import { createTextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";

const hasFilledFields = (items: any) =>
  items.some((value: any) => {
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
  const { description, id, ...fieldsToCheck } = item;

  const hasDescription = createTextReader(description || "").text.trim();

  return hasDescription || hasFilledFields(Object.values(fieldsToCheck));
}
