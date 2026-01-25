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
import ResumeVariant2 from "./resume-variants/variant2";

type ResumeWrapperProps = {
  children: React.ReactNode;
  scale: number;
  width: number;
  height: number;
};

const resumeVariants = {
  variant1: ResumeVariant1,
  variant2: ResumeVariant2,
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
    <div
      className="relative h-fit w-full bg-white"
      style={{ width: 794, height: 1123 }}
    >
      <div className="p-[24px]">{children}</div>
      <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
        resume created with <strong>cvoop.com</strong>
      </p>
    </div>
  );
};

const ResumePreview = ({
  resumeId,
  resumeVar,
  ref: contentRef,
}: {
  resumeId: string;
  resumeVar: number;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });
  const { cropped } = useAvatar(resumeId);

  const ref = useRef<HTMLDivElement>(null);

  const pages = usePaginateDom({ ref, data: formData, photo: cropped });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scale, width, height, handleZoomInAndOut } =
    useStageScale(containerRef);

  return (
    <div
      ref={containerRef}
      className="scrollable-div relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50"
    >
      <div
        id="printableArea"
        className="pointer-events-none absolute mb-4 cursor-none text-left text-[14px] opacity-0"
      >
        <div className="w-[794px] bg-pink-100 p-6">
          <ResumeVariant2 ref={ref} data={formData} photo={cropped} />
        </div>
      </div>
      <div ref={contentRef}>
        {pages.map((page, idx) => (
          <div
            key={idx}
            onClick={handleZoomInAndOut}
            className="mb-4 text-left text-[14px]"
          >
            <ResumeWrapper scale={scale} width={width} height={height}>
              {page}
            </ResumeWrapper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
