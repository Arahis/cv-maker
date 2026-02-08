import { ResumeVariant1 } from "@/app/(editor)/components/ResumePreview/resume-variants/variant1";
import { ResumeVariant2 } from "@/app/(editor)/components/ResumePreview/resume-variants/variant2";
import { ResumeVariant3 } from "@/app/(editor)/components/ResumePreview/resume-variants/variant3";
import { ResumeVariant4 } from "@/app/(editor)/components/ResumePreview/resume-variants/variant4";
import { ResumeVariant5 } from "@/app/(editor)/components/ResumePreview/resume-variants/variant5";
import { ResumeVariantComponent } from "@/lib/types/resume/variants.types";

export const resumeVariants = {
  variant1: ResumeVariant1,
  variant2: ResumeVariant2,
  variant3: ResumeVariant3,
  variant4: ResumeVariant4,
  variant5: ResumeVariant5,
} satisfies Record<string, ResumeVariantComponent>;

export type ResumeVariantKey = keyof typeof resumeVariants;
