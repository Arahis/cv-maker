import { forwardRef } from "react";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import { ResumeTemplateProps } from "../../types.js";
import HeaderSection from "./HeaderSection.js";
import Summary from "./Summary.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import LeftSection from "./LeftSection.js";
import RightSection from "./RightSection.js";

export const ResumeTemplate3 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument
        className="text-sm"
        pagePaddingX={40}
        revision={JSON.stringify(data)}
        ref={ref}
        id="template3"
      >
        <HeaderSection data={data} photo={photo} />
        <Summary data={data} />

        <ColumnsRegion
          gridTemplateColumns="minmax(0, 7fr) minmax(0, 3fr)"
          leftColumn={<LeftSection data={data} />}
          rightColumn={<RightSection data={data} />}
        />
      </PaginationDocument>
    );
  },
);

ResumeTemplate3.displayName = "ResumeTemplate3";
