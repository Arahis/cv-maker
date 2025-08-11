"use client";

import { useStageScale } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Stage, Layer, Rect, Group } from "react-konva";
import { konvaTextContainers } from "./utils/textHelpers";

const textStyle = {
  fontSize: 16,
  lineHeight: 1.2,
  fontFamily: "Arial",
  width: 200,
};

const pages = [...Array(2).keys()];

const initialWidth = 794; // A4 width in pixels
const initialHeight = 1123; // A4 height in pixels
const padding = 20;
const leftSectionWidth = initialWidth * 0.3; // 30% of the width
const leftSectionWidthWithPadding = leftSectionWidth - padding * 2; // 30% of the width
const leftSectionHeightWithPadding = initialHeight - padding * 2; // 30% of the width

const ResumePreview = () => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });

  console.log({ formData });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scale, width, height, handleZoomInAndOut, zoomIn, isZoomDisabled } =
    useStageScale(containerRef);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col items-center justify-start overflow-y-auto bg-gray-50 p-6"
    >
      {pages.map((_, idx) => (
        <button
          key={idx}
          disabled={isZoomDisabled}
          onClick={handleZoomInAndOut}
          className={cn(
            isZoomDisabled
              ? "pointer-events-none cursor-none"
              : zoomIn
                ? "cursor-zoom-in"
                : "cursor-zoom-out",
            "mb-4",
          )}
        >
          <Stage
            width={width}
            height={height}
            scaleX={scale}
            scaleY={scale}
            className="h-fit w-fit overflow-hidden rounded-md bg-white shadow-xl"
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={leftSectionWidth}
                height={1123}
                fill="red"
                listening={false}
              />
              <Group
                x={padding}
                y={padding}
                width={leftSectionWidthWithPadding}
                height={leftSectionHeightWithPadding}
                listening={false}
              >
                {konvaTextContainers(
                  ["Привет!", "Пока", "Не скажу никогда что на сердце у меня"],
                  textStyle,
                )}
              </Group>
            </Layer>
          </Stage>
        </button>
      ))}
    </div>
  );
};

export default ResumePreview;
