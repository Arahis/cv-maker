import "@cv-maker/resume-renderer/pagination.css";
import { ResumeTemplate2 } from "@/app/(editor)/components/ResumePreview/resume-templates/template2";
import { ResumeTemplate3 } from "@/app/(editor)/components/ResumePreview/resume-templates/template3";
import { ResumeTemplate4 } from "@/app/(editor)/components/ResumePreview/resume-templates/template4";
import { ResumeTemplate5 } from "@/app/(editor)/components/ResumePreview/resume-templates/template5";
import { ResumeTemplateComponent } from "@/lib/types/resume/template.types";
import { ResumeTemplate } from "@cv-maker/shared";
import { ResumeTemplate1 } from "@cv-maker/resume-renderer";

export const DEFAULT_RESUME_TEMPLATE: ResumeTemplateKey = "template1";
export const DEFAULT_RESUME_TEMPLATE_COMPONENT = ResumeTemplate1;

export const resumeTemplates = {
  template1: ResumeTemplate1,
  template2: ResumeTemplate2,
  template3: ResumeTemplate3,
  template4: ResumeTemplate4,
  template5: ResumeTemplate5,
} satisfies Partial<Record<ResumeTemplate, ResumeTemplateComponent>>;

export function getResumeTemplateComponent(
  template?: ResumeTemplateKey | null,
): ResumeTemplateComponent {
  if (template && template in resumeTemplates) {
    return resumeTemplates[template as ResumeTemplateKey];
  }

  return DEFAULT_RESUME_TEMPLATE_COMPONENT;
}

export type ResumeTemplateKey = keyof typeof resumeTemplates;
