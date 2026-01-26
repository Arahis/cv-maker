import { ResumeVariant1 } from "@/app/(main)/resume-editor/components/ResumePreview/resume-variants/variant1";
import { ResumeVariant2 } from "@/app/(main)/resume-editor/components/ResumePreview/resume-variants/variant2";
import { ResumeVariantComponent } from "@/lib/types/resume/variants.types";

export const resumeVariants = {
  variant1: ResumeVariant1,
  variant2: ResumeVariant2,
} satisfies Record<string, ResumeVariantComponent>;

export type ResumeVariantKey = keyof typeof resumeVariants;
