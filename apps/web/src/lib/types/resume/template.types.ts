import { ResumeForm } from "@/lib/validation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type ResumeTemplateProps = {
  data: ResumeForm;
  photo?: string | null;
};

export type ResumeTemplateComponent = ForwardRefExoticComponent<
  ResumeTemplateProps & RefAttributes<HTMLDivElement>
>;
