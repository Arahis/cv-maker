import React, { forwardRef } from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Paginate } from "../../Paginate";
import { ResumeTemplateProps } from "@/lib/types/resume/template.types";
import PaginationDocument from "../../PaiginatorNew/utils/PaginationDocument";
import {
  ColumnsRegion,
  FullWidthRegion,
} from "../../PaiginatorNew/utils/Pagination";

export const ResumeTemplate1 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument revision={data} ref={ref}>
        <HeaderSection data={data} photo={photo} />
        <FullWidthRegion>
          <Summary data={data.summary} />
        </FullWidthRegion>

        <ColumnsRegion
          // className="columns flex w-full"
          // datatype="main-cv-info"
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate1.displayName = "ResumeTemplate1";
