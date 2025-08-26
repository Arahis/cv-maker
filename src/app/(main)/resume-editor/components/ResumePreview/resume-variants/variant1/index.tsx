import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const ResumeVariant1 = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  return (
    <>
      <div ref={ref}>
        <HeaderSection />
        <Summary />
        <div className="flex w-full">
          <LeftSection />
          <RightSection />
        </div>
      </div>
    </>
  );
};

export default ResumeVariant1;
