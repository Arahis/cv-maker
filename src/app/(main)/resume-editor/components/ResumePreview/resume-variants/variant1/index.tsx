import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";

const ResumeVariant1 = ({
  ref,
  data,
  photo,
}: {
  ref: React.Ref<HTMLDivElement>;
  data: ResumeForm;
  photo: string | null;
}) => {
  return (
    <Paginate ref={ref}>
      <HeaderSection data={data} photo={photo} />
      <Summary data={data} />

      <Paginate.Columns className="columns flex w-full" datatype="main-cv-info">
        <LeftSection data={data} />
        <RightSection data={data} />
      </Paginate.Columns>
    </Paginate>
  );
};

export default ResumeVariant1;
