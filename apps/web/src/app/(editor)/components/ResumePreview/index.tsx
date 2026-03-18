"use client";

import React, { useRef } from "react";
import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import { useFormContext, useWatch } from "react-hook-form";
import usePaginateDom from "./hooks/usePaginateDom";
import useAvatar from "../../store/hooks/useAvatar";

type ResumeWrapperProps = {
  children: React.ReactNode;
  scale?: number;
  width?: number;
  height?: number;
};

const ResumeWrapperPages = ({
  children,
  scale = 1,
  width = 794,
  height = 1123,
}: ResumeWrapperProps) => {
  return (
    <div
      data-page-style
      className="relative overflow-hidden rounded-md bg-white text-[14px] shadow-xl"
      style={{ width, height }}
    >
      <div
        data-page-scale
        className="relative p-6"
        style={{
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
        <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
          resume created with <strong>cvoop.com</strong>
        </p>
      </div>
    </div>
  );
};

const ResumeWrapperDOM = ({
  children,
  width,
  scale,
}: Omit<ResumeWrapperProps, "height">) => {
  return (
    <div
      className="mb-4 h-fit w-full overflow-hidden rounded-md bg-pink-200 text-[14px] shadow-xl"
      style={{ width }}
    >
      <div
        className="p-6"
        style={{
          width: 794,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const ResumePreview = ({
  resumeId,
  resumeComponent,
  ref: contentRefForPrint,
}: {
  resumeId: string;
  resumeComponent: React.ElementType;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });
  const { cropped } = useAvatar(resumeId);

  const ref = useRef<HTMLDivElement>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    ref.current = node;
    contentRefForPrint.current = node;
  };

  const pages = usePaginateDom({ ref, data: formData, photo: cropped });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const scaleControls = useStageScale(containerRef);

  const Variant = resumeComponent;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50 p-4"
    >
      <div
        id="printableArea"
        className="pointer-events-none absolute z-40 mb-4 cursor-none opacity-0"
      >
        <ResumeWrapperDOM>
          <Variant ref={setRefs} data={formData} photo={cropped} />
        </ResumeWrapperDOM>
      </div>
      <div className="flex flex-col gap-4">
        {pages.map((page, idx) => (
          <ResumeWrapperPages
            scale={scaleControls.scale}
            width={scaleControls.width}
            height={scaleControls.height}
            key={idx}
            // onClick={scaleControls.handleZoomInAndOut}
          >
            {page}
          </ResumeWrapperPages>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
