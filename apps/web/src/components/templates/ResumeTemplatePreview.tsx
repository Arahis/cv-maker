"use client";

import { useEffect, useRef, useState } from "react";
import { getResumeTemplateComponent } from "@/components/templates/components";
import { TemplateKey } from "@/components/templates/previews";
import { resumeMock } from "@/lib/mocks/resume";
import avatarMock from "@/components/templates/avatar_mock.svg";
import ResumePreviewSkeleton from "@/components/templates/ResumePreviewSkeleton";

const ResumeTemplatePreview = ({ template }: { template: TemplateKey }) => {
  const Template = getResumeTemplateComponent(template);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(0);

  useEffect(() => {
    if (!previewRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });

    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const isScaled = previewWidth > 0;
  const scale = isScaled ? previewWidth / 794 : 0;

  return (
    <div
      ref={previewRef}
      className="relative aspect-794/1123 min-h-0 w-full cursor-pointer overflow-hidden"
    >
      {!isScaled && <ResumePreviewSkeleton />}
      <div
        className="origin-top-left text-left"
        style={{
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: isScaled ? "visible" : "hidden",
        }}
      >
        <Template
          data={resumeMock}
          photo={typeof avatarMock === "string" ? avatarMock : avatarMock.src}
        />
      </div>
    </div>
  );
};

export default ResumeTemplatePreview;
