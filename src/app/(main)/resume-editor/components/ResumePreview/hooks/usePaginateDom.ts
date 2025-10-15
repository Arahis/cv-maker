import React, { useLayoutEffect } from "react";

type Page = HTMLElement[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
};

// TODO: Maybe try to use different types for block and text nodes
type VNode = {
  type: string; // тег (div, p, span) или "text"
  props: Record<string, string>; // атрибуты (class, id, data-*, ...)
  children: VNode[]; // дочерние VNode
  text?: string; // содержимое для текстовых узлов
};

const PAGE_HEIGHT = 1123;

function getBottom(node: Node): number {
  if (node.nodeType === Node.TEXT_NODE) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    return rect.bottom;
  }
  return (node as HTMLElement).getBoundingClientRect().bottom;
}

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

function clonePathToVNode(
  rootMap: WeakMap<Node, VNode>,
  root: { value: VNode | null },
  path: Node[],
  newChild: Node,
  pageBottom: number,
) {
  let current: VNode | undefined;

  for (const parent of path) {
    const isColumnContainer =
      (parent as HTMLElement).getAttribute("data-paginate") === "columns";

    // Если уже создавали клон этого уровня — используем его
    const parentClone = rootMap.get(parent);

    if (parentClone) {
      current = parentClone;
      continue;
    }

    const newParent: VNode = elementToVNode(parent as HTMLElement);

    if (isColumnContainer) {
      for (const col of parent.childNodes) {
        const childClone = elementToVNode(col as HTMLElement);

        newParent.children.push(childClone);
        rootMap.set(col, childClone);
      }
    }

    if (current) {
      current.children.push(newParent);
    }

    rootMap.set(parent, newParent);
    current = newParent;
    root.value ??= newParent;
  }

  // Child part check
  const newChildVNode = elementToVNode(newChild as HTMLElement | Text);

  const childClone = rootMap.get(newChild);
  if (!childClone) {
    rootMap.set(newChild, newChildVNode);
    if (current) {
      current.children.push(newChildVNode);
    }
  }
}

// Функция для получения реального количества строк текста в элементе
// UPD: не сработало
function mergeRectsToLines(rects: DOMRectList): DOMRect[] {
  const lines: DOMRect[] = [];
  const EPS = 5; // допуск на погрешность в пикселях

  for (const rect of Array.from(rects)) {
    // Берём последний элемент из lines
    const last = lines[lines.length - 1];

    // Если нет послднего элемента или Последний элемент - нынещний rect по модулю больше EPS, добавляем в lines новый элемент
    if (!last || Math.abs(last.bottom - rect.top) > EPS) {
      lines.push(rect);
    } else {
      const line = new DOMRect(
        Math.min(last.left, rect.left),
        Math.min(last.top, rect.top),
        Math.max(last.right, rect.right) - Math.min(last.left, rect.left),
        Math.max(last.bottom, rect.bottom) - Math.min(last.top, rect.top),
      );
      lines[lines.length - 1] = line;
    }
  }

  return lines;
}

function binarySearchSplitIndex(textNode: Text, pageBottom: number): number {
  const text = textNode.textContent || "";
  if (!text.length) return 0;

  let left = 0;
  let right = text.length;
  let mainRect = 0;

  // --- Этап 1: бинарный поиск, где текст перестаёт помещаться ---
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, mid);

    const rngText = range.toString();

    const rect = range.getBoundingClientRect();
    mainRect = rect.bottom;

    if (rect.bottom <= pageBottom) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  const splitOffset = Math.max(0, left - 1);

  // --- Этап 2: доходим до конца визуальной строки ---
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, splitOffset);
  let prevBottom = range.getBoundingClientRect().bottom;

  let idx = splitOffset;
  const EPS = 1;

  while (idx < text.length) {
    range.setEnd(textNode, idx + 1);
    const rngText2 = range.toString();
    const rect = range.getBoundingClientRect();

    // если нижняя граница изменилась — значит началась новая строка
    if (rect.bottom - prevBottom > EPS) break;
    idx++;
    prevBottom = rect.bottom;
  }

  // --- Этап 3: откат до пробела, если не хотим резать слово ---
  while (idx > 0 && !/[\s\u00A0]/.test(text[idx - 1])) idx--;

  return idx > 0 ? idx : splitOffset;
}

function divideTextNode(node: Text, pageBottom: number): Node[] {
  const splitOffset = binarySearchSplitIndex(node, pageBottom);

  const firstPart = node.textContent?.slice(0, splitOffset) || "";
  const secondPart = node.textContent?.slice(splitOffset) || "";

  const firstVNode: VNode = {
    type: "text",
    props: {},
    children: [],
    text: firstPart,
  };

  const secondVNode: VNode = {
    type: "text",
    props: {},
    children: [],
    text: secondPart,
  };

  return [vNodeToTextNode(firstVNode), vNodeToTextNode(secondVNode)];
}

function getProcessNode(
  pageIndex: { value: number },
  pageBottom: { value: number },
  chunks: VNode[][],
  root: { value: VNode | null },
) {
  let rootMap = new Map<Node, VNode>();

  function closeCurrentPage() {
    if (!chunks[pageIndex.value]) chunks[pageIndex.value] = [];
    chunks[pageIndex.value].push(root.value!);
    pageIndex.value += 1;
    pageBottom.value += PAGE_HEIGHT;
    root.value = null;
    rootMap = new Map();
  }

  function handle(node: Node, path: Node[], isLastChild: boolean) {
    const bottom = getBottom(node);
    // Проверка на высоты должна проходить только для самого глубокого элемента, ради этого и применяем технику обхода в глубину DFS
    if (isLastChild) {
      // Если не помещается на текущую страницу — начинаем новый чанк. Обнуляем всё
      if (bottom > pageBottom.value) {
        closeCurrentPage();
      }
    }

    clonePathToVNode(rootMap, root, path, node, pageBottom.value);
  }

  const processNode = (node: Node, path: Node[] = []) => {
    const isLastChild = (node as HTMLElement).childNodes.length === 0;
    if (node.nodeType === Node.TEXT_NODE) {
      const bottom = getBottom(node);

      if (bottom > pageBottom.value) {
        const [firstNode, secondNode] = divideTextNode(
          node as Text,
          pageBottom.value,
        );
        processNode(firstNode, path);

        closeCurrentPage();

        processNode(secondNode, path);
        return;
      }

      handle(node, path, true);
      return;
    }

    // Смысл в том чтобы начинать обработку с детей, а потом уже с родителя
    for (const child of (node as HTMLElement).childNodes) {
      processNode(child, [...path, node]);
    }

    handle(node, path, isLastChild);
  };
  return processNode;
}

const usePaginateDom = ({ ref }: PaginatedDomProps) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const chunks: VNode[][] = [[]];
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

    const newPages: Page[] = chunks.map((chunk) =>
      chunk.map((vNode) => vNodeToElement(vNode) as HTMLElement),
    );

    setPages(newPages);
  }, [ref]);

  return pages;
};

function vNodeToTextNode(vNode: VNode): Node {
  return document.createTextNode(vNode.text || "");
}

const vNodeToElement = (vNode: VNode): Node => {
  if (vNode.type === "text") {
    return vNodeToTextNode(vNode);
  }

  const el = document.createElement(vNode.type);

  for (const [key, value] of Object.entries(vNode.props)) {
    el.setAttribute(key, value);
  }

  for (const child of vNode.children) {
    el.appendChild(vNodeToElement(child));
  }

  return el;
};

export default usePaginateDom;
