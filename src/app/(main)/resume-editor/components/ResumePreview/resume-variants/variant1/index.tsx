import React from "react";
import HeaderSection from "./HeaderSection";

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
      </div>
    </div>
  );
};

export default ResumeVariant1;
