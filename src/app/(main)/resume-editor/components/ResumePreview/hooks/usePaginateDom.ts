import React, { ReactNode, useLayoutEffect } from "react";
import { convertDomAttributesToProps } from "./dom-attributes-to-react-props";
import { divideTextNode } from "./manageText";
import { LeafMeta, PageRenderer, VNodeBuilder } from "./paginator";

type Page = ReactNode[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
  photo?: string | null;
};

const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 24;

/* ---------------------------------------------------------
   GEOMETRY
----------------------------------------------------------*/

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

function stringToTextNode(text: string): Text {
  return document.createTextNode(text);
}

/* ---------------------------------------------------------
   VNODE CREATION
----------------------------------------------------------*/

// Create tree structure of VNodes from DOM nodes along the given path
function clonePathToVNode(
  rootMap: WeakMap<Node, VNode>,
  root: { value: VNode | null },
  path: Node[],
  newChild: Node,
) {
  let current: VNode | undefined;

  for (const parent of path) {
    const parentClone = rootMap.get(parent);
    if (parentClone) {
      current = parentClone;
      continue;
    }

    const newParent = elementToVNode(parent as HTMLElement);

    if (isColumnsContainer(parent)) {
      for (const col of parent.childNodes) {
        const childClone = elementToVNode(col as HTMLElement);
        newParent.children.push(childClone);
        rootMap.set(col, childClone);
      }
    }

    if (current) current.children.push(newParent);

    rootMap.set(parent, newParent);
    current = newParent;
    root.value ??= newParent;
  }

  const newChildVNode = elementToVNode(newChild as HTMLElement | Text);

  if (!rootMap.get(newChild)) {
    rootMap.set(newChild, newChildVNode);
    current?.children.push(newChildVNode);
  }
}

function getProcessNode(
  pageIndex: { value: number },
  workingPageHeight: number,
  chunks: VNode[][],
  root: { value: VNode | null },
  getBottom: (node: Node) => number,
  getTop: (node: Node) => number,
) {
  let rootMap = new WeakMap<Node, VNode>();
  const pageBottom = () => workingPageHeight * (pageIndex.value + 1);

  function closePage() {
    if (root.value) {
      chunks[pageIndex.value] ??= [];
      // Bug: Если value из двух колонок, и первая колонка переполняется, до парсинга второй колонки дело даже не доходит.
      chunks[pageIndex.value].push(root.value);
    }
    pageIndex.value++;

    root.value = null;
    rootMap = new WeakMap();
  }

  function markMarginRemove(
    path: Node[],
    type: "top" | "bottom",
    rootMap: WeakMap<Node, VNode>,
  ) {
    const key =
      type === "top" ? "data-remove-spacing-top" : "data-remove-spacing-bottom";

    for (const el of path) {
      const parentNode = rootMap.get(el);
      if (!parentNode) continue;
      parentNode.props[key] = "true";
    }
  }

  function handle(node: Node, path: Node[], isLeaf: boolean) {
    const bottom = getBottom(node);
    if (isLeaf && bottom > pageBottom()) {
      closePage();
    }
    clonePathToVNode(rootMap, root, path, node);
  }

  const processNode = (node: Node, path: Node[] = []) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // the real bottom of the text node
      const bottom = getBottom(node);
      const top = getTop(node);

      if (bottom > pageBottom()) {
        const maxHeightForNode = pageBottom() - top;

        // if the text node begins on the division height (potential bug)
        if (maxHeightForNode <= 0) {
          closePage();
          processNode(node, path);
          return;
        }

        const textChunks = divideTextNode(node as Text, maxHeightForNode, 1075);

        for (let i = 0; i < textChunks.length; i++) {
          const chunk = textChunks[i];
          clonePathToVNode(rootMap, root, path, stringToTextNode(chunk));

          if (i === textChunks.length - 1) {
            markMarginRemove(path, "top", rootMap);
            continue;
          }

          if (i === 0) {
            markMarginRemove(path, "bottom", rootMap);
            closePage();

            continue;
          }

          markMarginRemove(path, "bottom", rootMap);
          markMarginRemove(path, "top", rootMap);

          closePage();
        }
        return;
      }

      handle(node, path, true);
      return;
    }

    for (const child of Array.from((node as HTMLElement).childNodes)) {
      processNode(child, [...path, node]);
    }

    handle(node, path, isLeaf(node));
  };

  return processNode;
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
        console.log({ page });
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
