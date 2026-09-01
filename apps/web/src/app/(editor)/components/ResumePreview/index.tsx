"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStageScale } from "@/lib/hooks/useStageScale";
import { ResumeForm } from "@/lib/validation";
import { useFormContext, useWatch } from "react-hook-form";
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
      <div className="mx-auto" style={{ width, height: contentHeight }}>
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
