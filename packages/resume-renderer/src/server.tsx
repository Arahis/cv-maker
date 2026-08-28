import { renderToStaticMarkup } from "react-dom/server";
import { resumeSchema, type ResumeForm } from "@cv-maker/shared";
import { ResumeTemplate1 } from "./resume-templates/template1/index.js";
import { ResumeTemplate2 } from "./resume-templates/template2/index.js";
import { ResumeTemplate3 } from "./resume-templates/template3/index.js";
import { ResumeTemplate4 } from "./resume-templates/template4/index.js";
import { ResumeTemplate5 } from "./resume-templates/template5/index.js";
import { ResumeTemplate6 } from "./resume-templates/template6/index.js";

const resumeTemplates = {
  template1: ResumeTemplate1,
  template2: ResumeTemplate2,
  template3: ResumeTemplate3,
  template4: ResumeTemplate4,
  template5: ResumeTemplate5,
  template6: ResumeTemplate6,
} as const;

export function renderResumeTemplate({
  template,
  data,
  photo,
}: {
  template: string;
  data: ResumeForm;
  photo?: string | null;
}) {
  const Template = resumeTemplates[template as keyof typeof resumeTemplates];

  if (!Template) {
    throw new Error(`Unsupported resume template: ${template}`);
  }

  return renderToStaticMarkup(
    <Template data={resumeSchema.parse(data)} photo={photo} />,
  );
}
