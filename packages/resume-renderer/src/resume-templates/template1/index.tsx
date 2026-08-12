import React, { forwardRef } from "react";
import HeaderSection from "./HeaderSection.js";
import Summary from "./Summary.js";
import LeftSection from "./LeftSection/index.js";
import RightSection from "./RightSection.js";
import type { ResumeTemplateProps } from "../../types.js";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import {
  ColumnsRegion,
  FullWidthRegion,
} from "../../pagination/Pagination.js";

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
