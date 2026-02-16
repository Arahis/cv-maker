import { createTextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";

export function isWorkExperienceFilled(
  item: NonNullable<ResumeForm["workExperiences"]>[number],
) {
  const { description, id, ...fieldsToCheck } = item;

  const hasDescription = createTextReader(description || "").text.trim();

  const hasFilledFields = Object.values(fieldsToCheck).some((value) => {
    if (typeof value === "string") {
      return value.trim() !== "";
    }
  });

  return hasDescription || hasFilledFields;
}
