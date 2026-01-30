"use client";

import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import React, { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import usePaginateDom from "./hooks/usePaginateDom";
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
      className="relative h-fit w-full overflow-hidden rounded-md bg-white shadow-xl"
      style={{ width, height }}
    >
      <div
        className="p-[24px]"
        style={{ zoom: scale, width: 794, height: 1123 }}
      >
        {children}
      </div>
      <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
        resume created with <strong>cvoop.com</strong>
      </p>
    </div>
  );
};

const ResumePreview = ({
  resumeId,
  resumeComponent,
  ref: contentRef,
}: {
  resumeId: string;
  resumeComponent: React.ElementType;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });
  const { cropped } = useAvatar(resumeId);

  const ref = useRef<HTMLDivElement>(null);

  const pages = usePaginateDom({ ref, data: formData, photo: cropped });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const scaleControls = useStageScale(containerRef);

  console.log({ scaleControls });

  const Variant = resumeComponent;

  return (
    <div
      ref={containerRef}
      className="scrollable-div relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50"
    >
      <div
        id="printableArea"
        className="pointer-events-none absolute mb-4 cursor-none text-left text-[14px] opacity-0"
      >
        <div className="bg-pink-100 p-6" style={{ width: "794" }}>
          <Variant ref={ref} data={formData} photo={cropped} />
        </div>
      </div>
      <div ref={contentRef} className="flex flex-col">
        {pages.map((page, idx) => (
          <div
            key={idx}
            onClick={scaleControls.handleZoomInAndOut}
            className="mb-4 text-left text-[14px]"
          >
            <ResumeWrapperPages
              scale={scaleControls.scale}
              width={scaleControls.width}
              height={scaleControls.height}
            >
              {page}
            </ResumeWrapperPages>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
