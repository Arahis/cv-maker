import { forwardRef } from "react";
import { ResumeTemplateProps } from "../../types.js";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import HeaderSection from "./HeaderSection.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import LeftSection from "./LeftSection.js";
import RightSection from "./RightSection.js";

export const ResumeTemplate5 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument
        ref={ref}
        id="template5"
        pagePaddingX={36}
        revision={JSON.stringify(data)}
        className="text-sm"
      >
        <HeaderSection data={data} photo={photo} />
        <ColumnsRegion
          className="template5-columns"
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate5.displayName = "ResumeTemplate5";
