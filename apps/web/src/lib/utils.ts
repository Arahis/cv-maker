import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDesktopLike() {
  if (typeof window === "undefined") return true;
  const mq = (q: string) => window.matchMedia(q).matches;

  const hasCoarsePointer = mq("(pointer: coarse)");
  const noHover = mq("(hover: none)");

  return !(hasCoarsePointer || noHover);
}
