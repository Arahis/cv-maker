import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Paginate } from "../../Paginate";

const ResumeVariant1 = ({
  ref,
  data,
  photo,
}: {
  ref: React.Ref<HTMLDivElement>;
  data: any;
  photo: string | null;
}) => {
  return (
    <>
      <Paginate ref={ref}>
        <HeaderSection data={data} photo={photo} />
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
