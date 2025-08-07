"use client";

import { ResumeForm } from "@/lib/validation";
import React, { RefObject, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Stage, Layer, Rect } from "react-konva";

type StageSize = {
  scale: number;
  width: number;
  height: number;
};

const useStageScale = (
  container: RefObject<HTMLDivElement | null>,
  maxScale = 1.2,
  minScale = 0.5,
  targetWidth = 794,
  targetHeight = 1123,
) => {
  const [stageSize, setStageSize] = useState<StageSize>({
    scale: maxScale,
    width: targetWidth,
    height: targetHeight,
  });

  const [zoomIn, setZoomIn] = useState(false);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);

  const handleZoomInAndOut = () => {
    setZoomIn((prev) => !prev);
  };

  useEffect(() => {
    if (!container.current) return;

    const observer = new ResizeObserver((items) => {
      const item = items[0];
      const { width, height } = item.contentRect;

      const scaleByWidth = width / targetWidth;
      const scaleByHeight = height / targetHeight;

      const clampedScaleByWidth = Math.min(scaleByWidth, maxScale);
      const clampedScaleByHeight = Math.max(scaleByHeight, minScale);

      const scale = zoomIn
        ? Math.min(scaleByHeight, scaleByWidth)
        : scaleByWidth;

      setIsZoomDisabled(clampedScaleByHeight >= clampedScaleByWidth);

      setStageSize({
        scale,
        width: targetWidth * scale,
        height: targetHeight * scale,
      });
    });

    observer.observe(container.current);

    return () => {
      observer.disconnect();
    };
  }, [container, maxScale, minScale, targetWidth, targetHeight, zoomIn]);

  return { handleZoomInAndOut, zoomIn, isZoomDisabled, ...stageSize };
};

const ResumePreview = () => {
  const { control } = useFormContext();
  const formData = useWatch<ResumeForm>({ control });

  console.log({ formData });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scale, width, height, handleZoomInAndOut, zoomIn, isZoomDisabled } =
    useStageScale(containerRef);

  return (
    <div
      ref={containerRef}
      className="flex w-full items-start justify-center overflow-y-auto bg-gray-50 p-6"
    >
      <button
        disabled={isZoomDisabled}
        onClick={handleZoomInAndOut}
        className={
          isZoomDisabled
            ? "pointer-events-none cursor-none"
            : zoomIn
              ? "cursor-zoom-in"
              : "cursor-zoom-out"
        }
      >
        <Stage
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          className="h-fit w-fit overflow-hidden rounded-md bg-white shadow-xl"
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={794 * 0.3}
              height={1123}
              fill="red"
              listening={false}
            />
          </Layer>
        </Stage>
      </button>
    </div>
  );
};

export default ResumePreview;
