"use client";

import React, { useRef } from "react";
import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import { useFormContext, useWatch } from "react-hook-form";
import usePaginateDom from "./hooks/usePaginateDom";
import useAvatar from "../../store/hooks/useAvatar";

// type ResumeWrapperProps = {
//   children: React.ReactNode;
//   scale: number;
//   width: number;
//   height: number;
// };

// const ResumeWrapperPages = ({
//   children,
//   scale,
//   width,
//   height,
// }: ResumeWrapperProps) => {
//   return (
//     <div
//       className="relative h-fit w-full overflow-hidden rounded-md bg-white shadow-xl"
//       style={{ width, height }}
//     >
//       <div
//         className="relative p-[24px]"
//         style={{ zoom: scale, width: 794, height: 1123 }}
//       >
//         {children}
//         <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
//           resume created with <strong>cvoop.com</strong>
//         </p>
//       </div>
//     </div>
//   );
// };

const ResumeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      data-page-style
      className="relative mb-4 h-fit w-full overflow-hidden rounded-md bg-white text-[14px] shadow-xl"
      style={{ width: 794, height: 1123 }}
    >
      <div className="relative p-[24px]" style={{ width: 794, height: 1123 }}>
        {children}
        <p className="absolute bottom-4 left-4 origin-bottom-left -rotate-90 transform text-center text-xs text-gray-300">
          resume created with <strong>cvoop.com</strong>
        </p>
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

  const pages = usePaginateDom({ ref, data: formData, photo: cropped });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const scaleControls = useStageScale(containerRef);

  console.log({ scaleControls });

  const Variant = resumeComponent;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gray-50 p-4"
    >
      <div
        id="printableArea"
        className="pointer-events-none absolute mb-4 cursor-none text-left text-[14px] opacity-0"
      >
        <ResumeWrapper>
          <Variant ref={ref} data={formData} photo={cropped} />
        </ResumeWrapper>
      </div>
      <div
        ref={contentRefForPrint}
        className="print-content scrollable-div flex flex-col"
      >
        {pages.map((page, idx) => (
          <ResumeWrapper
            key={idx}
            // onClick={scaleControls.handleZoomInAndOut}
          >
            {page}
          </ResumeWrapper>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
