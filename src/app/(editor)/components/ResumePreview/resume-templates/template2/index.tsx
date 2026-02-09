import React, { forwardRef } from "react";

import { Paginate } from "../../Paginate";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { ResumeTemplateProps } from "@/lib/types/resume/template.types";

export const ResumeTemplate2 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data }, ref) => {
    return (
      <Paginate ref={ref}>
        <HeaderSection data={data} />

        <Paginate.Columns
          className="columns flex w-full gap-8"
          datatype="main-cv-info"
        >
          <div className="w-[60%]">
            <LeftSection data={data} />
          </div>
          <div className="w-[40%]">
            <RightSection data={data} />
          </div>
        </Paginate.Columns>
      </Paginate>
    );
  },
);

ResumeTemplate2.displayName = "ResumeTemplate2";
