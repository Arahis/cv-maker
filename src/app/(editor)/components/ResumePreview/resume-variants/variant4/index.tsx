import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeVariantProps } from "@/lib/types/resume/variants.types";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

export const ResumeVariant4 = forwardRef<HTMLDivElement, ResumeVariantProps>(
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

ResumeVariant4.displayName = "ResumeVariant4";
