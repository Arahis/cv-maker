import { forwardRef } from "react";
import { ResumeTemplateProps } from "../../types.js";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import HeaderSection from "./HeaderSection.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import LeftSection from "./LeftSection.js";
import RightSection from "./RightSection.js";

export const ResumeTemplate4 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument
        ref={ref}
        className="text-sm"
        pagePaddingX={36}
        id="template4"
        revision={JSON.stringify(data)}
      >
        <HeaderSection data={data} photo={photo} />

        <ColumnsRegion
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate4.displayName = "ResumeTemplate4";
