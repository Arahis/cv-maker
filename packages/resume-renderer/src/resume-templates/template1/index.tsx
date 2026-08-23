import React, { forwardRef } from "react";
import HeaderSection from "./HeaderSection.js";
import Summary from "./Summary.js";
import LeftSection from "./LeftSection/index.js";
import RightSection from "./RightSection.js";
import type { ResumeTemplateProps } from "../../types.js";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import { ColumnsRegion, FullWidthRegion } from "../../pagination/Pagination.js";

export const ResumeTemplate1 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument
        className="gap-y-8"
        pagePaddingX={40}
        revision={JSON.stringify(data)}
        ref={ref}
        id="template1"
      >
        <HeaderSection data={data} photo={photo} />
        <FullWidthRegion>
          <Summary data={data.summary} />
        </FullWidthRegion>

        <ColumnsRegion
          gridTemplateColumns="minmax(0, 35fr) minmax(0, 65fr)"
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate1.displayName = "ResumeTemplate1";
