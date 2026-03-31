import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeTemplateProps } from "@/lib/types/resume/template.types";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

export const ResumeTemplate5 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <Paginate ref={ref} className="px-4">
        <HeaderSection data={data} photo={photo} />
        <Paginate.Columns className="flex w-full" datatype="main-cv-info">
          <LeftSection data={data} />
          <RightSection data={data} />
        </Paginate.Columns>
      </Paginate>
    );
  },
);

ResumeTemplate5.displayName = "ResumeTemplate5";
