"use client";

import { useStageScale } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ResumeVariant1 from "./resume-variants/variant1";

const pages = [...Array(2).keys()];

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
          // disabled={true}
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
          <ResumeVariant1 scale={scale} width={width} height={height} />
        </button>
      ))}
    </div>
  );
};

export default ResumePreview;
