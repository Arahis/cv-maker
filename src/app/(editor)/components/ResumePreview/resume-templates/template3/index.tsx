import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeTemplateProps } from "@/lib/types/resume/template.types";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import RightSection from "./RightSection";
import LeftSection from "./LeftSection";

export const ResumeTemplate3 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <Paginate ref={ref} className="px-4">
        <HeaderSection data={data} photo={photo} />
        <Summary data={data} />

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

ResumeTemplate3.displayName = "ResumeTemplate3";
