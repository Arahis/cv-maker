import React, { forwardRef } from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Paginate } from "../../Paginate";
import { ResumeVariantProps } from "@/lib/types/resume/variants.types";

export const ResumeVariant1 = forwardRef<HTMLDivElement, ResumeVariantProps>(
  ({ data, photo }, ref) => {
    return (
      <Paginate ref={ref}>
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

ResumeVariant1.displayName = "ResumeVariant1";
