import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { resumeSchema, type ResumeForm } from "@cv-maker/shared";
import { ResumeTemplate1 } from "./resume-templates/template1/index.js";

const resumeTemplates = {
  template1: ResumeTemplate1,
  // template2: ResumeTemplate2,
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
