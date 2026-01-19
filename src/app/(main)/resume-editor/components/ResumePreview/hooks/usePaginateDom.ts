import React, { useLayoutEffect } from "react";
import { convertDomAttributesToProps } from "./dom-attributes-to-react-props";
import { divideTextNode } from "./manageText";

type Page = React.ReactNode[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
  photo?: string | null;
};

export type VNode = {
  type: string;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
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

function isColumnsContainer(node: Node): node is HTMLElement {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as HTMLElement).getAttribute("data-paginate") === "columns"
  );
}

function isLeaf(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE
    ? true
    : (node as HTMLElement).childNodes.length === 0;
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

const usePaginateDom = ({
  ref,
  data,
  photo,
}: PaginatedDomProps & { data: any }) => {
  const [pages, setPages] = React.useState<Page[]>([]);
  const rafId = React.useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (rafId.current != null) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!ref.current) return;

      const chunks: VNode[][] = [[]];
      const pageIndex = { value: 0 };
      const workingPageHeight = PAGE_HEIGHT - PAGE_PADDING * 2;

      const root = { value: null as VNode | null };

      const containerTop = ref.current.getBoundingClientRect().top;

      // Functions to get real bottom and top values of nodes
      const getBottom = calculateBottom(containerTop);
      const getTop = calculateTop(containerTop);

      const processNode = getProcessNode(
        pageIndex,
        workingPageHeight,
        chunks,
        root,
        getBottom,
        getTop,
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

      return () => {
        if (rafId.current != null) cancelAnimationFrame(rafId.current);
      };
    });
  }, [ref, data, photo]);

  return pages;
};

const VOID_TAGS = new Set(["br", "img", "hr", "input", "meta", "link"]);

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

    if (VOID_TAGS.has(vNode.type)) {
      return React.createElement(vNode.type, {
        ...reactProps,
        key: keyCounter,
      });
    }

    return React.createElement(
      vNode.type,
      { ...reactProps, key: keyCounter },
      vNode.children.map(renderVNode),
    );
  };
}

export default usePaginateDom;
