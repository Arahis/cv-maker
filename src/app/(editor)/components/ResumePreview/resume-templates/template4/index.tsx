import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeTemplateProps } from "@/lib/types/resume/template.types";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

export const ResumeTemplate4 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <Paginate ref={ref} className="px-4">
        <HeaderSection data={data} photo={photo} />

        <Paginate.Columns
          className="columns flex w-full pt-12"
          datatype="main-cv-info"
        >
          <LeftSection data={data} />
          <RightSection data={data} />
        </Paginate.Columns>
      </Paginate>
    );
  },
);

ResumeTemplate4.displayName = "ResumeTemplate4";
