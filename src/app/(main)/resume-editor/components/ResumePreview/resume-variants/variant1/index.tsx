import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection, { JobSection, sections } from "./RightSection";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";

const ResumeVariant1 = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  return (
    <>
      <Paginate ref={ref}>
        <HeaderSection />
        <Summary />

        <Paginate.Columns className="flex w-full" datatype="main-cv-info">
          <LeftSection />
          <RightSection />
        </Paginate.Columns>
      </Paginate>
    </>
  );
};

export default ResumeVariant1;
