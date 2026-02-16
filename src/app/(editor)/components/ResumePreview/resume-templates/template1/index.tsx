import React, { forwardRef } from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Paginate } from "../../Paginate";
import { ResumeTemplateProps } from "@/lib/types/resume/template.types";

export const ResumeTemplate1 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <Paginate ref={ref}>
        <HeaderSection data={data} photo={photo} />
        <Summary data={data.summary} />

        <Paginate.Columns
          className="columns flex w-full"
          datatype="main-cv-info"
        >
          <LeftSection data={data} />
          <RightSection data={data} />
        </Paginate.Columns>
      </Paginate>
    );
  },
);

ResumeTemplate1.displayName = "ResumeTemplate1";
