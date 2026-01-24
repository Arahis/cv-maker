import { createElement, ReactNode } from "react";
import { convertDomAttributesToProps } from "./dom-attributes-to-react-props";
import { divideTextNode } from "./manageText";

export type VNode = {
  type: string;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
};

export type LeafMeta = {
  nodeTop: number;
  nodeBottom: number;
  startPage: number;
  endPage: number;
  isText: boolean;
};

type PageRange = { from: number; to: number }; // inclusive
type SpacingRules = {
  top: PageRange[];
  bottom: PageRange[];
};

const VOID_TAGS = new Set(["br", "img", "hr", "input", "meta", "link"]);

function isLeaf(domNode: Node): boolean {
  return domNode.nodeType === Node.TEXT_NODE
    ? true
    : (domNode as HTMLElement).childNodes.length === 0;
}

function isColumnsContainerVNode(vNode: VNode): boolean {
  return vNode.props?.["data-paginate"] === "columns";
}

function elementToVNode(domNode: Node): VNode {
  if (domNode.nodeType === Node.TEXT_NODE) {
    return {
      type: "text",
      props: {},
      children: [],
      text: domNode.textContent || "",
    };
  }

  const props: Record<string, string> = {};
  for (const { name, value } of (domNode as HTMLElement).attributes) {
    props[name] = value;
  }

  return {
    type: (domNode as HTMLElement).tagName.toLowerCase(),
    props,
    children: [],
  };
}

/* =========================================================
   VNodeBuilder
========================================================= */

export class VNodeBuilder {
  public readonly vNodeToDom = new WeakMap<VNode, Node>();
  public readonly leafMeta = new Map<Node, LeafMeta>();

  public readonly textChunks = new Map<
    Text,
    { startPage: number; endPage: number; chunksByPage: string[] }
  >();

  // ✅ NEW: правила “убрать spacing” на DOM-элементах по страницам
  public readonly spacingRules = new Map<Node, SpacingRules>();

  private readonly eps = 0.1;

  constructor(
    private readonly rootContainer: HTMLElement, // ✅ нужно, чтобы знать до куда подниматься
    private readonly workingPageHeight: number,
    private readonly getBottom: (n: Node) => number,
    private readonly getTop: (n: Node) => number,
  ) {}

  public buildVNodeTree(rootDom: Node): VNode {
    const rootVNode: VNode = elementToVNode(rootDom);
    this.vNodeToDom.set(rootVNode, rootDom);

    for (const childDomNode of Array.from(rootDom.childNodes)) {
      const childVNode = this.buildVNode(childDomNode);
      if (childVNode) rootVNode.children.push(childVNode);
    }

    return rootVNode;
  }

  private computeLeafMeta(domNode: Node, isText: boolean): LeafMeta {
    const nodeTop = this.getTop(domNode);
    const nodeBottom = this.getBottom(domNode);

    const startPage = Math.floor((nodeTop + this.eps) / this.workingPageHeight);
    const endPage = Math.floor(
      (nodeBottom - this.eps) / this.workingPageHeight,
    );

    return { nodeTop, nodeBottom, startPage, endPage, isText };
  }

  private ensureSpacingRules(domNode: Node): SpacingRules {
    const existing = this.spacingRules.get(domNode);
    if (existing) return existing;

    const created: SpacingRules = { top: [], bottom: [] };
    this.spacingRules.set(domNode, created);
    return created;
  }

  private addSpacingRange(
    domNode: Node,
    type: "top" | "bottom",
    from: number,
    to: number,
  ) {
    if (to < from) return; // пустой диапазон
    const rules = this.ensureSpacingRules(domNode);
    rules[type].push({ from, to });
  }

  /**
   * ✅ Убираем spacing на всех предках от textNode.parentElement до rootContainer
   * - bottom: только на startPage (и до endPage-1)
   * - top:    со startPage+1 до endPage
   */
  private markSpacingForTextSplit(textNode: Text, meta: LeafMeta) {
    const start = meta.startPage;
    const end = meta.endPage;

    // bottom должно исчезнуть на странице, где происходит разрыв “вниз”
    const bottomFrom = start;
    const bottomTo = end - 1;

    // top должно исчезнуть на страницах, где продолжается текст “сверху”
    const topFrom = start + 1;
    const topTo = end;

    // поднимаемся вверх по DOM
    let cur: Node | null = textNode.parentNode;

    while (cur) {
      // только элементы имеют смысл как “обёртки”
      if (cur.nodeType === Node.ELEMENT_NODE) {
        this.addSpacingRange(cur, "bottom", bottomFrom, bottomTo);
        this.addSpacingRange(cur, "top", topFrom, topTo);
      }

      if (cur === this.rootContainer) break;
      cur = cur.parentNode;
    }
  }

  private buildVNode(domNode: Node): VNode | null {
    const isTextNode = domNode.nodeType === Node.TEXT_NODE;
    const isElementNode = domNode.nodeType === Node.ELEMENT_NODE;

    if (!isTextNode && !isElementNode) return null;

    const vNode = elementToVNode(domNode);
    this.vNodeToDom.set(vNode, domNode);

    const leaf = isLeaf(domNode);

    if (leaf) {
      const meta = this.computeLeafMeta(domNode, isTextNode);
      this.leafMeta.set(domNode, meta);

      // ✅ split text once + mark spacing rules
      if (isTextNode && meta.startPage !== meta.endPage) {
        const textDomNode = domNode as Text;

        const firstPageBottom = this.workingPageHeight * (meta.startPage + 1);
        const blockHeightForFirstChunk = firstPageBottom - meta.nodeTop;
        const safeBlockHeight =
          blockHeightForFirstChunk > 0
            ? blockHeightForFirstChunk
            : this.workingPageHeight;

        const chunks = divideTextNode(
          textDomNode,
          safeBlockHeight,
          this.workingPageHeight,
        );

        const expectedCount = meta.endPage - meta.startPage + 1;
        const normalized: string[] = [];
        for (let i = 0; i < expectedCount; i++)
          normalized.push(chunks[i] ?? "");

        this.textChunks.set(textDomNode, {
          startPage: meta.startPage,
          endPage: meta.endPage,
          chunksByPage: normalized,
        });

        // ✅ NEW: spacing removal rules up to rootContainer
        this.markSpacingForTextSplit(textDomNode, meta);
      }
    }

    if (isElementNode) {
      for (const child of Array.from(domNode.childNodes)) {
        const childVNode = this.buildVNode(child);
        if (childVNode) vNode.children.push(childVNode);
      }
    }

    return vNode;
  }
}

/* =========================================================
   PageRenderer
   - рендерит одну страницу pageIndex
   - uses leafMeta visibility
   - uses precomputed textChunks
   - columns: one-pass, preserves wrappers
========================================================= */

export class PageRenderer {
  private keyCounter = 0;

  constructor(
    private readonly leafMeta: Map<Node, LeafMeta>,
    private readonly vNodeToDom: WeakMap<VNode, Node>,
    private readonly textChunks: Map<
      Text,
      { startPage: number; endPage: number; chunksByPage: string[] }
    >,
    private readonly spacingRules: Map<
      Node,
      {
        top: { from: number; to: number }[];
        bottom: { from: number; to: number }[];
      }
    >,
  ) {}

  public renderPage(rootVNode: VNode, pageIndex: number): ReactNode[] {
    this.keyCounter = 0;

    const renderedRootChildren: ReactNode[] = [];
    for (const childVNode of rootVNode.children) {
      const renderedChild = this.renderNode(childVNode, pageIndex);
      if (renderedChild !== null) renderedRootChildren.push(renderedChild);
    }
    return renderedRootChildren;
  }

  private isPageInRanges(
    pageIndex: number,
    ranges: { from: number; to: number }[],
  ): boolean {
    for (const r of ranges) {
      if (pageIndex >= r.from && pageIndex <= r.to) return true;
    }
    return false;
  }

  private getSpacingPropsForDomNode(
    domNode: Node | undefined,
    pageIndex: number,
  ): Record<string, string> {
    if (!domNode) return {};

    const rules = this.spacingRules.get(domNode);
    if (!rules) return {};

    const shouldRemoveTop = this.isPageInRanges(pageIndex, rules.top);
    const shouldRemoveBottom = this.isPageInRanges(pageIndex, rules.bottom);

    const extra: Record<string, string> = {};
    if (shouldRemoveTop) extra["data-remove-spacing-top"] = "true";
    if (shouldRemoveBottom) extra["data-remove-spacing-bottom"] = "true";
    return extra;
  }

  private renderNode(vNode: VNode, pageIndex: number): ReactNode | null {
    const domNode = this.vNodeToDom.get(vNode);

    // TEXT
    if (vNode.type === "text") {
      if (!domNode || domNode.nodeType !== Node.TEXT_NODE)
        return vNode.text ?? null;

      const meta = this.leafMeta.get(domNode);
      if (!meta) return vNode.text ?? null;

      if (pageIndex < meta.startPage || pageIndex > meta.endPage) return null;

      if (meta.startPage !== meta.endPage) {
        const cached = this.textChunks.get(domNode as Text);
        if (cached) {
          const localIndex = pageIndex - cached.startPage;
          const chunk = cached.chunksByPage[localIndex];
          return chunk ? chunk : null;
        }
      }

      return vNode.text ?? null;
    }

    // ✅ COLUMNS CONTAINER (ONE PASS)
    if (isColumnsContainerVNode(vNode)) {
      return this.renderColumnsContainer(vNode, pageIndex);
    }

    // NORMAL ELEMENT
    const renderedChildren: ReactNode[] = [];
    for (const childVNode of vNode.children) {
      const renderedChild = this.renderNode(childVNode, pageIndex);
      if (renderedChild !== null) renderedChildren.push(renderedChild);
    }

    // leaf element visibility
    if (vNode.children.length === 0) {
      if (domNode) {
        const meta = this.leafMeta.get(domNode);
        if (meta && (pageIndex < meta.startPage || pageIndex > meta.endPage))
          return null;
      }
    } else {
      if (renderedChildren.length === 0) return null;
    }

    const extraSpacingProps = this.getSpacingPropsForDomNode(
      domNode,
      pageIndex,
    );
    return this.createElementFromVNode(
      vNode,
      renderedChildren,
      extraSpacingProps,
    );
  }

  private renderColumnsContainer(
    columnsContainerVNode: VNode,
    pageIndex: number,
  ): ReactNode | null {
    const renderedColumnWrappers: ReactNode[] = [];
    let hasAnyVisibleContent = false;

    for (const columnWrapperVNode of columnsContainerVNode.children) {
      const renderedColumnChildren: ReactNode[] = [];

      for (const columnChildVNode of columnWrapperVNode.children) {
        const renderedColumnChild = this.renderNode(
          columnChildVNode,
          pageIndex,
        );
        if (renderedColumnChild !== null)
          renderedColumnChildren.push(renderedColumnChild);
      }

      if (renderedColumnChildren.length > 0) hasAnyVisibleContent = true;

      const columnDomNode = this.vNodeToDom.get(columnWrapperVNode);
      const extraSpacingProps = this.getSpacingPropsForDomNode(
        columnDomNode,
        pageIndex,
      );

      const renderedWrapper = this.createElementFromVNode(
        columnWrapperVNode,
        renderedColumnChildren,
        extraSpacingProps,
      );

      renderedColumnWrappers.push(renderedWrapper);
    }

    if (!hasAnyVisibleContent) return null;

    const containerDomNode = this.vNodeToDom.get(columnsContainerVNode);
    const extraSpacingProps = this.getSpacingPropsForDomNode(
      containerDomNode,
      pageIndex,
    );

    return this.createElementFromVNode(
      columnsContainerVNode,
      renderedColumnWrappers,
      extraSpacingProps,
    );
  }

  private createElementFromVNode(
    vNode: VNode,
    children: ReactNode[],
    extraProps: Record<string, string>,
  ): ReactNode {
    this.keyCounter += 1;

    // исходные атрибуты
    const reactProps = convertDomAttributesToProps({
      attributes: Object.entries(vNode.props ?? {}).map(([name, value]) => ({
        name,
        value,
      })),
    } as any);

    // ✅ добавляем page-specific data-remove-spacing-*
    const mergedProps = { ...reactProps, ...extraProps, key: this.keyCounter };

    if (VOID_TAGS.has(vNode.type)) {
      return createElement(vNode.type, mergedProps);
    }

    return createElement(vNode.type, mergedProps, children);
  }
}
