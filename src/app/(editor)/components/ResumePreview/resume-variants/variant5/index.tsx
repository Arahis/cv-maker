import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeVariantProps } from "@/lib/types/resume/variants.types";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

export const ResumeVariant5 = forwardRef<HTMLDivElement, ResumeVariantProps>(
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

ResumeVariant5.displayName = "ResumeVariant5";
