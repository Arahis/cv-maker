import React from "react";
import HeaderSection from "./HeaderSection";
import Summary from "./Summary";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

// const leftSectionWidth = initialWidth * 0.3; // 30% of the width
// const leftSectionWidthWithPadding = leftSectionWidth - padding * 2; // 30% of the width
// const leftSectionHeightWithPadding = initialHeight - padding * 2; // 30% of the width

const ResumeVariant1 = ({
  scale,
  width,
  height,
}: {
  scale: number;
  width: number;
  height: number;
}) => {
  return (
    <div
      className="h-fit w-full overflow-hidden rounded-md bg-white shadow-xl"
      style={{ width, height }}
    >
      <div className="p-8" style={{ zoom: scale }}>
        <HeaderSection />
        <Summary />
        <div className="flex w-full">
          <LeftSection />
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default ResumeVariant1;
