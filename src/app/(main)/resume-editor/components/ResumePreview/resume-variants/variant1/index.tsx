import React from "react";
import { Group, Layer, Stage } from "react-konva";
import HeaderSection from "./HeaderSection";
import { commonValues } from "../../utils/commonValues";

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
    <Stage
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      className="h-fit w-fit overflow-hidden rounded-md bg-white shadow-xl"
    >
      <Layer>
        <Group
          name="shared-container"
          x={commonValues.padding}
          y={commonValues.padding}
        >
          <HeaderSection />
          <Group name="left-section" listening={false}></Group>
        </Group>
      </Layer>
    </Stage>
  );
};

export default ResumeVariant1;
