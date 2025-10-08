type VNode = {
  type: string;
  props: Record<string, string>;
  children: VNode[];
  text?: string;
  el?: HTMLElement; // ссылка на оригинальный элемент (для измерения)
};

type Page = VNode[];

/**
 * Клонирует путь родителей и добавляет новый дочерний элемент
 */
function clonePathToVNode(path: VNode[], newChild: VNode): VNode {
  let current: VNode | null = null;
  let root: VNode | null = null;

  for (const parent of path) {
    const newParent: VNode = {
      type: parent.type,
      props: { ...parent.props },
      children: [],
    };
    if (!root) root = newParent;
    if (current) current.children.push(newParent);
    current = newParent;
  }

  if (current) current.children.push(newChild);
  return root!;
}

/**
 * Делит DOM (в виде VNode) на страницы по заданной высоте
 */
function splitDOMIntoPages(root: VNode, pageHeight: number): Page[] {
  const pages: Page[] = [];
  let currentPage: Page = [];
  let currentBottom = 0;

  // текущий путь родителей при обходе
  const path: VNode[] = [];

  function processNode(node: VNode) {
    const el = node.el;
    if (!el) return;

    // Получаем нижнюю границу элемента
    const rect = el.getBoundingClientRect();
    const bottom = rect.bottom;

    // если не помещается на текущую страницу
    if (bottom > pageHeight) {
      // создаем новую страницу
      pages.push(currentPage);
      currentPage = [];
      currentBottom = 0;
    }

    // если у узла есть дети — обрабатываем их
    if (node.children.length > 0) {
      path.push(node);
      for (const child of node.children) {
        processNode(child);
      }
      path.pop();
    } else {
      // это лист — добавляем на страницу, клонируя путь
      const cloned = clonePathToVNode(path, node);
      currentPage.push(cloned);
    }

    currentBottom = bottom;
  }

  processNode(root);

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
