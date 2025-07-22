"use client";

import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";
import React, {
  HTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormContext, useWatch } from "react-hook-form";

const useSheetZoom = (container: RefObject<HTMLDivElement | null>) => {
  const [zoom, setZoom] = useState<number>(0);

  useEffect(() => {
    if (!container.current) return;

    const targetWidth = 794;

    const observer = new ResizeObserver((items) => {
      const item = items[0];
      const { width } = item.contentRect;

      const zoomX = (1 / targetWidth) * width;

      setZoom(zoomX);
    });

    observer.observe(container.current);

    return () => {
      observer.disconnect();
    };
  }, [container]);

  return zoom;
};

const ResumePreview = ({
  className,
}: {
  className?: HTMLAttributes<HTMLDivElement>;
}) => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });

  console.log({ formData });

  const containerRef = useRef<HTMLDivElement>(null);
  const zoom = useSheetZoom(containerRef);

  return (
    <div className="bg-secondary flex w-full justify-center overflow-y-auto p-4">
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-[210/297] h-fit w-full max-w-2xl bg-white text-black shadow-md",
          className,
        )}
      >
        <div
          className={cn("space-y-6 p-6", !zoom && "invisible")}
          style={{ zoom }}
        >
          {formData.firstName}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
