import { forwardRef } from "react";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import type { ResumeTemplateProps } from "../../types.js";
import RightSection from "./RightSection.js";
import LeftSection from "./LeftSection.js";

export const ResumeTemplate6 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data }, ref) => {
    return (
      <PaginationDocument
        pagePaddingX={32}
        revision={JSON.stringify(data)}
        ref={ref}
        id="template6"
        className="text-sm"
        editorClassName="template6-bg"
      >
        <ColumnsRegion
          gap={52}
          gridTemplateColumns="minmax(0, 6fr) minmax(0, 4fr)"
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate6.displayName = "ResumeTemplate6";
