import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection, { JobSection, sections } from "./RightSection";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";

const ResumeVariant1 = ({
  ref,
  data,
}: {
  ref: React.Ref<HTMLDivElement>;
  data: any;
}) => {
  return (
    <>
      <Paginate ref={ref}>
        <HeaderSection data={data} />
        <Summary data={data} />

        <Paginate.Columns className="flex w-full" datatype="main-cv-info">
          <LeftSection data={data} />
          <RightSection data={data} />
        </Paginate.Columns>
      </Paginate>
    </>
  );
};

export default ResumeVariant1;
