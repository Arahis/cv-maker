"use client";

import { useStageScale } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";
import React, { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ResumeVariant1 from "./resume-variants/variant1";
import usePaginateDom from "./hooks/usePaginateDom";

type ResumeWrapperProps = {
  children: React.ReactNode;
  scale: number;
  width: number;
  height: number;
};

const ResumeWrapper = ({
  children,
  scale,
  width,
  height,
}: ResumeWrapperProps) => {
  return (
    <div
      className="h-fit w-full overflow-hidden rounded-md bg-white shadow-xl"
      style={{ width, height }}
    >
      <div className="p-8" style={{ zoom: scale }}>
        {children}
      </div>
    </div>
  );
};

const ResumePreview = () => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });

  const ref = useRef<HTMLDivElement>(null);
  const pages = usePaginateDom({ ref });

  console.log({ formData });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scale, width, height, handleZoomInAndOut, zoomIn, isZoomDisabled } =
    useStageScale(containerRef);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute opacity-0">
        <ResumeWrapper scale={scale} width={width} height={height}>
          <ResumeVariant1 ref={ref} />
        </ResumeWrapper>
      </div>
      <div
        ref={containerRef}
        className="flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50"
      >
        {pages.map((page, idx) => (
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
              "mb-4 text-left text-[14px]",
            )}
          >
            <ResumeWrapper scale={scale} width={width} height={height}>
              {page.map((el, j) => (
                <div
                  key={j}
                  dangerouslySetInnerHTML={{ __html: el.outerHTML }}
                />
              ))}
            </ResumeWrapper>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
