import React from "react";

import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";
import HeaderSection from "./HeaderSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const ResumeVariant2 = ({
  ref,
  data,
}: {
  ref: React.Ref<HTMLDivElement>;
  data: ResumeForm;
}) => {
  return (
    <Paginate ref={ref}>
      <HeaderSection data={data} />

      <Paginate.Columns
        className="columns flex w-full gap-2"
        datatype="main-cv-info"
      >
        <div className="w-[60%]">
          <LeftSection data={data} />
        </div>
        <div className="w-[40%]">
          <RightSection data={data} />
        </div>
      </Paginate.Columns>
    </Paginate>
  );
};

export default ResumeVariant2;
