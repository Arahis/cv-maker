import "@cv-maker/resume-renderer/renderer.css";

import { ResumeTemplateComponent } from "@/lib/types/resume/template.types";
import { ResumeTemplate } from "@cv-maker/shared";
import {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  ResumeTemplate4,
  ResumeTemplate5,
} from "@cv-maker/resume-renderer";

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
