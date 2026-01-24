import React, { ReactNode, useLayoutEffect } from "react";
import { LeafMeta, PageRenderer, VNodeBuilder } from "./paginator";

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
  photo?: string | null;
};

const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 24;

function processRect(node: Node): DOMRect {
  if (node.nodeType === Node.TEXT_NODE) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  return (node as HTMLElement).getBoundingClientRect();
}

// Returns real bottom value, computed from container top and node bottom, in viewport coordinates
function calculateBottom(containerTop: number) {
  return (input: Node) => {
    const rect = processRect(input);
    return rect.bottom - containerTop;
  };
}

function calculateTop(containerTop: number) {
  return (input: Node) => {
    const rect = processRect(input);
    return rect.top - containerTop;
  };
}

const calculatePages = (leafMeta: Map<Node, LeafMeta>) => {
  let maxPageIndex = 0;

  leafMeta.forEach((meta) => {
    if (meta.endPage > maxPageIndex) {
      maxPageIndex = meta.endPage;
    }
  });

  return maxPageIndex;
};

const usePaginateDom = ({
  ref,
  data,
  photo,
}: PaginatedDomProps & { data: any }) => {
  const [pages, setPages] = React.useState<ReactNode[]>([]);
  const rafId = React.useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (rafId.current != null) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!ref.current) return;

      const workingPageHeight = PAGE_HEIGHT - PAGE_PADDING * 2;
      const containerTop = ref.current.getBoundingClientRect().top;

      // Functions to get real bottom and top values of nodes
      const getBottom = calculateBottom(containerTop);
      const getTop = calculateTop(containerTop);

      const rootBuilder = new VNodeBuilder(
        ref.current,
        workingPageHeight,
        getBottom,
        getTop,
      );
      const vNodeTree = rootBuilder.buildVNodeTree(ref.current);
      const renderer = new PageRenderer(
        rootBuilder.leafMeta,
        rootBuilder.vNodeToDom,
        rootBuilder.textChunks,
        rootBuilder.spacingRules,
      );

      const totalPages = calculatePages(rootBuilder.leafMeta);

      const pagesArray: ReactNode[] = [];
      for (let pageIndex = 0; pageIndex <= totalPages; pageIndex++) {
        const page = renderer.renderPage(vNodeTree, pageIndex);
        pagesArray.push(page);
      }
      setPages(pagesArray);

      return () => {
        if (rafId.current != null) cancelAnimationFrame(rafId.current);
      };
    });
  }, [ref, data, photo]);

  return pages;
};

export default usePaginateDom;
