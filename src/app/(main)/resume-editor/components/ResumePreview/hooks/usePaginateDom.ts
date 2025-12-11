import React, { useLayoutEffect } from "react";
import { convertDomAttributesToProps } from "./dom-attributes-to-react-props";

type Page = React.ReactNode[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
  photo?: string | null;
};

type VNode = {
  type: string;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
};

const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 24;
const CONTAINER_MARGIN_BOTTOM = 16;

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

/* ---------------------------------------------------------
   VNODE CREATION
----------------------------------------------------------*/

function elementToVNode(el: HTMLElement | Text): VNode {
  if (el.nodeType === Node.TEXT_NODE) {
    return {
      type: "text",
      props: {},
      children: [],
      text: el.textContent || "",
    };
  }

  const props: Record<string, string> = {};
  for (const { name, value } of (el as HTMLElement).attributes) {
    props[name] = value;
  }

  return {
    type: (el as HTMLElement).tagName.toLowerCase(),
    props,
    children: [],
  };
}

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

    const isColumnContainer =
      (parent as HTMLElement).getAttribute("data-paginate") === "columns";
    if (isColumnContainer) {
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

function binarySearchSplitIndex(textNode: Text, maxHeight: number): number {
  const originalText = textNode.textContent || "";
  if (!originalText.length) return 0;

  function measure(idx: number): DOMRect {
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, idx);
    return range.getBoundingClientRect();
  }

  // Measure the text height instead of bottom to avoid issues with line-height
  let left = 0;
  let right = originalText.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const rect = measure(mid);

    if (rect.height <= maxHeight) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  let split = Math.max(0, left - 1);

  // handle word break: move split back to last whitespace
  while (split > 0 && !/[\s\u00A0]/.test(originalText[split - 1])) {
    split--;
  }

  return split;
}

function divideTextNode(node: Text, maxHeight: number): Node[] {
  const splitIndex = binarySearchSplitIndex(node, maxHeight);

  const firstText = node.textContent?.slice(0, splitIndex) || "";
  const secondText = node.textContent?.slice(splitIndex) || "";

  const firstVNode: VNode = {
    type: "text",
    props: {},
    children: [],
    text: firstText,
  };

  const secondVNode: VNode = {
    type: "text",
    props: {},
    children: [],
    text: secondText,
  };

  return [vNodeToTextNode(firstVNode), vNodeToTextNode(secondVNode)];
}

function getProcessNode(
  pageIndex: { value: number },
  pageBottom: { value: number },
  chunks: VNode[][],
  root: { value: VNode | null },
  getBottom: (node: Node) => number,
) {
  let rootMap = new WeakMap<Node, VNode>();

  function closePage() {
    if (root.value) {
      chunks[pageIndex.value] ??= [];
      chunks[pageIndex.value].push(root.value);
    }
    pageIndex.value++;
    const nextPageIndex = pageIndex.value + 1;
    pageBottom.value =
      PAGE_HEIGHT * nextPageIndex - nextPageIndex * (PAGE_PADDING * 2);

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
    if (isLeaf && bottom > pageBottom.value) {
      closePage();
    }
    clonePathToVNode(rootMap, root, path, node);
  }

  const processNode = (node: Node, path: Node[] = []) => {
    const isLeaf = (node as HTMLElement).childNodes.length === 0;

    if (node.nodeType === Node.TEXT_NODE) {
      const bottom = getBottom(node);

      if (bottom > pageBottom.value) {
        const rect = processRect(node);
        const textHeight = rect.height;
        const localBottom = bottom;
        const localTop = localBottom - textHeight;
        const maxHeightForNode = pageBottom.value - localTop;

        const [left, right] = divideTextNode(node as Text, maxHeightForNode);

        /**
         * IMPORTANT: We do NOT call processNode(left/right) after splitting a text node.
         *
         * Reason:
         *   - When a text node overflows the page, we split it into two NEW text nodes:
         *         left  → fits on the current page
         *         right → should start the next page
         *
         *   - These new nodes DO NOT exist in the real DOM.
         *     They are synthetic nodes created only for pagination.
         *
         *   - processNode() relies on DOM geometry (getBoundingClientRect) to detect overflow.
         *     But synthetic nodes cannot be measured: their rect == 0 or == the rect of the
         *     original text node. This causes the algorithm to think they still overflow.
         *     - This leads to infinite splitting and broken pagination.
         *
         *   - We use clonePathToVNode() instead of processNode():
         *       clonePathToVNode builds the virtual VNode tree WITHOUT checking geometry.
         *       It simply inserts the split parts into the output pages.
         **/
        markMarginRemove(path, "bottom", rootMap);
        clonePathToVNode(rootMap, root, path, left);
        closePage();
        clonePathToVNode(rootMap, root, path, right);
        markMarginRemove(path, "top", rootMap);
        return;
      }

      handle(node, path, true);
      return;
    }

    for (const child of Array.from((node as HTMLElement).childNodes)) {
      processNode(child, [...path, node]);
    }

    handle(node, path, isLeaf);
  };

  return processNode;
}

const usePaginateDom = ({
  ref,
  data,
  photo,
}: PaginatedDomProps & { data: any }) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const chunks: VNode[][] = [[]];
    const pageIndex = { value: 0 };
    const pageBottom = {
      value: PAGE_HEIGHT - (PAGE_PADDING + CONTAINER_MARGIN_BOTTOM),
    };
    const root = { value: null as VNode | null };

    console.log({ pageIndex });

    const containerTop = ref.current.getBoundingClientRect().top;
    const getBottom = calculateBottom(containerTop);

    const processNode = getProcessNode(
      pageIndex,
      pageBottom,
      chunks,
      root,
      getBottom,
    );

    for (const child of Array.from(ref.current.childNodes)) {
      processNode(child);

      if (root.value) {
        chunks[pageIndex.value] ??= [];
        chunks[pageIndex.value].push(root.value);
        root.value = null;
      }
    }

    const renderVNode = getRenderVNode();

    setPages(chunks.map((chunk) => chunk.map(renderVNode)));
  }, [ref, data, photo]);

  return pages;
};

function vNodeToTextNode(vNode: VNode): Node {
  return document.createTextNode(vNode.text || "");
}

function getRenderVNode() {
  let keyCounter = 0;

  return function renderVNode(vNode: VNode): React.ReactNode {
    if (!vNode) return null;

    keyCounter++;

    if (vNode.type === "text") return vNode.text;

    const reactProps = convertDomAttributesToProps({
      attributes: Object.entries(vNode.props).map(([name, value]) => ({
        name,
        value,
      })),
    } as any);

    return React.createElement(
      vNode.type,
      { ...reactProps, key: keyCounter },
      vNode.children.map(renderVNode),
    );
  };
}

export default usePaginateDom;
