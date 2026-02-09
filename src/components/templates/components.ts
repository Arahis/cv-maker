import { ResumeTemplate1 } from "@/app/(editor)/components/ResumePreview/resume-templates/template1";
import { ResumeTemplate2 } from "@/app/(editor)/components/ResumePreview/resume-templates/template2";
import { ResumeTemplate3 } from "@/app/(editor)/components/ResumePreview/resume-templates/template3";
import { ResumeTemplate4 } from "@/app/(editor)/components/ResumePreview/resume-templates/template4";
import { ResumeTemplate5 } from "@/app/(editor)/components/ResumePreview/resume-templates/template5";
import { ResumeTemplateComponent } from "@/lib/types/resume/template.types";

export const resumeTemplates = {
  template1: ResumeTemplate1,
  template2: ResumeTemplate2,
  template3: ResumeTemplate3,
  template4: ResumeTemplate4,
  template5: ResumeTemplate5,
} satisfies Record<string, ResumeTemplateComponent>;

export type ResumeTemplateKey = keyof typeof resumeTemplates;
