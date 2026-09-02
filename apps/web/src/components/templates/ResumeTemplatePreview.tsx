"use client";

import { useEffect, useRef, useState } from "react";
import { getResumeTemplateComponent } from "@/components/templates/components";
import { TemplateKey } from "@/components/templates/previews";
import { resumeMock } from "@/lib/mocks/resume";
import avatarMock from "@/components/templates/avatar_mock.svg";

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

  const scale = previewWidth > 0 ? previewWidth / 794 : 0.25;

  return (
    <div
      ref={previewRef}
      className="aspect-794/1123 min-h-0 w-full cursor-pointer overflow-hidden"
    >
      <div
        className="origin-top-left text-left"
        style={{
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
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
