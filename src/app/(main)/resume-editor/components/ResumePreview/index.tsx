"use client";

import { useStageScale } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";
import React, { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ResumeVariant1 from "./resume-variants/variant1";
import usePaginateDom from "./hooks/usePaginateDom";
import { useReactToPrint } from "react-to-print";
import useAvatar from "../../store/hooks/useAvatar";

type ResumeWrapperProps = {
  children: React.ReactNode;
  scale: number;
  width: number;
  height: number;
};

const ResumeWrapperPages = ({
  children,
  scale,
  width,
  height,
}: ResumeWrapperProps) => {
  return (
    <div
      className="h-fit w-full overflow-hidden rounded-md bg-white shadow-xl"
      style={{ width: 794, height: 1123 }}
    >
      <div className="p-[24px]" style={{ zoom: scale }}>
        {children}
      </div>
    </div>
  );
};

const ResumeWrapper = ({ children }: ResumeWrapperProps) => {
  return (
    <div className="h-fit w-full bg-white" style={{ width: 794, height: 1123 }}>
      <div className="p-[24px]">{children}</div>
    </div>
  );
};

const ResumePreview = ({ resumeId }: { resumeId: string }) => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });
  const { cropped } = useAvatar(resumeId);

  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLButtonElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const pages = usePaginateDom({ ref, data: formData, photo: cropped });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scale, width, height, handleZoomInAndOut, zoomIn, isZoomDisabled } =
    useStageScale(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50"
    >
      <button
        ref={contentRef}
        disabled
        id="printableArea"
        className={cn(
          "pointer-events-none absolute mb-4 border-2 border-green-600 text-left text-[14px] opacity-0",
        )}
      >
        <ResumeWrapper scale={scale} width={width} height={height}>
          <ResumeVariant1 ref={ref} data={formData} photo={cropped} />
        </ResumeWrapper>
      </button>
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
            {page}
          </ResumeWrapper>
        </button>
      ))}
    </div>
  );
};

export default ResumePreview;
