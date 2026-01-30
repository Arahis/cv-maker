import React, { forwardRef } from "react";

import { Paginate } from "../../Paginate";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { ResumeVariantProps } from "@/lib/types/resume/variants.types";

export const ResumeVariant2 = forwardRef<HTMLDivElement, ResumeVariantProps>(
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

ResumeVariant2.displayName = "ResumeVariant2";
