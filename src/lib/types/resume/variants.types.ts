import { ResumeForm } from "@/lib/validation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type ResumeVariantProps = {
  data: ResumeForm;
  photo?: string;
};

export type ResumeVariantComponent = ForwardRefExoticComponent<
  ResumeVariantProps & RefAttributes<HTMLDivElement>
>;
