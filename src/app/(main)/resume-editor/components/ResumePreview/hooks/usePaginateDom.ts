import React, { useLayoutEffect } from "react";

type Page = HTMLElement[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
};

type VNode = {
  type: string; // тег (div, p, span) или "text"
  props: Record<string, string>; // атрибуты (class, id, data-*, ...)
  children: VNode[]; // дочерние VNode
  text?: string; // содержимое для текстовых узлов
  bottom?: number; // нижняя граница элемента (для измерения)
};

const PAGE_HEIGHT = 1123;

// e.g. { 0: [SectionWrapperColumn1, SectionWrapperColumn2],
// 1: [SectionWrapperColumn1, SectionWrapperColumn2] }
// 2: NodeObject || {}

function getTextNodeBottom(textNode: Text): number {
  const range = document.createRange();
  range.selectNodeContents(textNode);
  const rect = range.getBoundingClientRect();
  return rect.bottom;
}

function elementToVNode(el: HTMLElement | Text): VNode {
  if (el.nodeType === Node.TEXT_NODE) {
    return {
      type: "text",
      props: {},
      children: [],
      text: el.textContent || "",
      bottom: getTextNodeBottom(el as Text),
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
    bottom: (el as HTMLElement).getBoundingClientRect().bottom,
  };
}

function clonePathToVNode(
  rootMap: Map<VNode, VNode>,
  root: { value: VNode | null },
  path: VNode[],
  newChild: VNode,
) {
  let current: VNode | undefined;

  for (const parent of path) {
    // Если уже создавали клон этого уровня — используем его
    const parentClone = rootMap.get(parent);

    if (parentClone) {
      current = parentClone;
      continue;
    }

    const newParent: VNode = {
      type: parent.type,
      props: { ...parent.props },
      children: [],
    };

    if (current) {
      current.children.push(newParent);
    }

    rootMap.set(parent, newParent);
    current = newParent;
    root.value ??= newParent;
  }

  // Child part check
  const childClone = rootMap.get(newChild);
  if (!childClone) {
    rootMap.set(newChild, newChild);
    if (current) {
      current.children.push(newChild);
    }
  }
}

function getProcessNode(
  pageIndex: { value: number },
  pageBottom: { value: number },
  chunks: VNode[][],
  root: { value: VNode | null },
) {
  let rootMap = new Map<VNode, VNode>();

  function handle(vNode: VNode, path: VNode[], isLastChild: boolean) {
    // Проверка на высоты должна проходить только для самого глубокого элемента, ради этого и применяем технику обхода в глубину DFS
    if (isLastChild) {
      // Если не помещается на текущую страницу — начинаем новый чанк. Обнуляем всё
      if (vNode.bottom !== undefined && vNode.bottom > pageBottom.value) {
        if (!chunks[pageIndex.value]) chunks[pageIndex.value] = [];
        chunks[pageIndex.value].push(root.value!);
        pageIndex.value += 1;
        pageBottom.value += PAGE_HEIGHT;
        root.value = null;
        rootMap = new Map();
      }
    }

    clonePathToVNode(rootMap, root, path, vNode);
  }

  const processNode = (node: Node, path: VNode[] = []) => {
    const vNode = elementToVNode(node as HTMLElement);

    const isLastChild = (node as HTMLElement).childNodes.length === 0;

    // Смысл в том чтобы начинать обработку с детей, а потом уже с родителя
    for (const child of (node as HTMLElement).childNodes) {
      processNode(child, [...path, vNode]);
    }

    handle(vNode, path, isLastChild);
  };
  return processNode;
}

const usePaginateDom = ({ ref }: PaginatedDomProps) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const chunks: VNode[][] = [[]];
    const currentChunk: VNode[] = [];
    const currentIndex = { value: 0 };
    const pageBottom = { value: PAGE_HEIGHT };
    const root: { value: VNode | null } = { value: null };

    const processNode = getProcessNode(currentIndex, pageBottom, chunks, root);

    for (const child of ref.current.childNodes) {
      processNode(child);

      if (root.value) {
        if (!chunks[currentIndex.value]) chunks[currentIndex.value] = [];

        chunks[currentIndex.value].push(root.value);
        root.value = null;
      }
    }

    console.log({ chunks });
  }, [ref]);

  console.log({ pages });
  return pages;
};

export default usePaginateDom;
