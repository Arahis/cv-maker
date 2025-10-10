import { useSearchParams } from "next/navigation";
import { ReactNode, RefObject, useEffect, useState } from "react";

type ResumeSections = {
  title: string;
  slug: string;
  item: ReactNode;
}[];

// Use in case we need to remember the number of step from URL params
export const useWithParamsNavigation = (resumeSections: ResumeSections) => {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || resumeSections[0].slug;
  const setStep = (slug: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", slug);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };
  return { currentStep, setStep };
};

type StageSize = {
  scale: number;
  width: number;
  height: number;
};

export const useStageScale = (
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
