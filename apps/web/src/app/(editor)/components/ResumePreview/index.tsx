"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import { useFormContext, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";
import useAvatar from "../../store/hooks/useAvatar";
import {
  getResumeTemplateComponent,
  ResumeTemplateKey,
} from "@/components/templates/components";
import SentryErrorBoundary from "./SentryErrorBoundary";

const ResumePreview = ({
  template,
  ref: contentRefForPrint,
}: {
  template: ResumeTemplateKey | undefined;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { control } = useFormContext<ResumeForm>();
  const formData = useWatch({ control }) as ResumeForm;
  const { croppedPreviewUrl } = useAvatar();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scale, width, height: initialHeight } = useStageScale(containerRef);
  const [contentHeight, setContentHeight] = useState(initialHeight);
  const isScaled = scale > 0 && width > 0;

  useEffect(() => {
    const content = contentRef.current?.firstElementChild;

    if (!(content instanceof HTMLElement)) return;

    const updateHeight = () => {
      setContentHeight(content.offsetHeight * scale);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);

    return () => observer.disconnect();
  }, [scale, formData, template]);

  const Template = getResumeTemplateComponent(template);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 w-full overflow-y-auto bg-gray-50 p-4"
    >
      {!isScaled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      )}
      <div
        className="mx-auto"
        style={{
          width,
          height: contentHeight,
          visibility: isScaled ? "visible" : "hidden",
        }}
      >
        <div
          ref={contentRef}
          style={{
            width: 794,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <SentryErrorBoundary template={template}>
            <Template
              data={formData}
              photo={croppedPreviewUrl}
              ref={contentRefForPrint}
            />
          </SentryErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
