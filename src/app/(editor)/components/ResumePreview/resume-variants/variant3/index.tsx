import { forwardRef } from "react";

import { Paginate } from "../../Paginate";

import { ResumeVariantProps } from "@/lib/types/resume/variants.types";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import RightSection from "./RightSection";
import LeftSection from "./LeftSection";

export const ResumeVariant3 = forwardRef<HTMLDivElement, ResumeVariantProps>(
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

ResumeVariant3.displayName = "ResumeVariant3";
