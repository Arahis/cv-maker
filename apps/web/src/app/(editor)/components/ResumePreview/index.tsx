"use client";

import React, { useRef } from "react";
import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import { useFormContext, useWatch } from "react-hook-form";
import usePaginateDom from "./hooks/usePaginateDom";
import useAvatar from "../../store/hooks/useAvatar";
import {
  getResumeTemplateComponent,
  ResumeTemplateKey,
} from "@/components/templates/components";

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
        {/* <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
          resume created with <strong>cvoop.com</strong>
        </p> */}
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
  template,
  ref: contentRefForPrint,
}: {
  resumeId: string;
  template: ResumeTemplateKey | undefined;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { control } = useFormContext<ResumeForm>();
  const formData = useWatch({ control }) as ResumeForm;
  const { croppedPreviewUrl } = useAvatar();

  // const ref = useRef<HTMLDivElement>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    // ref.current = node;
    // TODO: Uncomment this line when migrating to the new PDF generation API
    // contentRefForPrint.current = node;
  };

  // const containerRef = React.useRef<HTMLDivElement | null>(null);
  // const scaleControls = useStageScale(containerRef);
  //   scale={scaleControls.scale}
  // width={scaleControls.width}
  // height={scaleControls.height}

  const Template = getResumeTemplateComponent(template);

  return (
    <div
    // ref={containerRef}
    // className="relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50 p-4"
    >
      <Template
        data={formData}
        photo={croppedPreviewUrl}
        ref={contentRefForPrint}
      />
    </div>
  );
};

export default ResumePreview;
