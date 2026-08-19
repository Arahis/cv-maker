import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PaginationContext } from "../../pagination/Pagination.js";

function measureRenderedContentWidth(element: HTMLElement): number {
  const elementRect = element.getBoundingClientRect();

  let maxRight = elementRect.left;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  let node = walker.nextNode();

  while (node) {
    const range = document.createRange();

    range.selectNodeContents(node);

    for (const rect of range.getClientRects()) {
      if (rect.width === 0 || rect.height === 0) {
        continue;
      }

      maxRight = Math.max(maxRight, rect.right);
    }

    node = walker.nextNode();
  }

  return Math.ceil(maxRight - elementRect.left);
}

export function useFitContentWidth<T extends HTMLElement>() {
  const invalidate = useContext(PaginationContext)?.invalidate;
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number | null>(null);

  const remeasure = useCallback(() => {
    setWidth(null);
  }, []);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element || width !== null) {
      return;
    }

    const nextWidth = measureRenderedContentWidth(element);

    if (nextWidth <= 0) {
      return;
    }

    setWidth(nextWidth);
  }, [width]);

  useLayoutEffect(() => {
    if (width !== null) {
      invalidate?.();
    }
  }, [invalidate, width]);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new MutationObserver(() => {
      setWidth(null);
    });

    observer.observe(element, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref,
    width,
    remeasure,
  };
}
