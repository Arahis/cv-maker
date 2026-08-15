import React, { forwardRef } from "react";

import {
  ColumnsRegion,
  PaginationDocument,
  ResumeTemplateProps,
} from "../../index.js";
import LeftSection from "./LeftSection.js";
import RightSection from "./RightSection.js";
import HeaderSection from "./HeaderSection.js";

export const ResumeTemplate2 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data }, ref) => {
    return (
      <PaginationDocument
        pagePaddingX={40}
        revision={data}
        className="text-sm"
        id="template2"
        ref={ref}
      >
        <HeaderSection data={data} />

        <ColumnsRegion
          columnRatio={{ left: 60, right: 40 }}
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate2.displayName = "ResumeTemplate2";
