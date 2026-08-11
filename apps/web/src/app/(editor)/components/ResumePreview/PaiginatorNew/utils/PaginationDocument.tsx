import "./pagination.css";

import {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ColumnsRegion,
  EPSILON,
  FOOTER_HEIGHT,
  FlowBreak,
  HEADER_HEIGHT,
  PAGE_BREAK_HEIGHT,
  PAGE_CONTENT_HEIGHT,
  PAGE_GAP,
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_WIDTH,
  PaginationContext,
  VisualPagination,
  getPageContentBottom,
} from "./Pagination";

/* =========================================================
   MAIN
   ========================================================= */

export default function PaginationDocument({
  children,
  revision,
}: {
  children: ReactNode;
  revision?: unknown;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const documentFlowRef = useRef<HTMLDivElement>(null);
  const previousRevisionRef = useRef(revision);

  const [breaks, setBreaks] = useState<FlowBreak[]>([]);
  const pageCount =
    breaks.length === 0
      ? 1
      : Math.max(...breaks.map((pageBreak) => pageBreak.pageNumber)) + 1;
  const editorHeight = PAGE_HEIGHT * pageCount + PAGE_GAP * (pageCount - 1);

  type FlowGeometry = {
    element: HTMLElement;
    id: string;
    top: number;
    bottom: number;
  };

  function getDeepestFlows(flows: FlowGeometry[]) {
    return flows.filter((flow) => {
      return !flows.some(
        (other) => other !== flow && flow.element.contains(other.element),
      );
    });
  }

  const findFlowsForBoundary = useCallback((boundaryY: number) => {
    const editor = editorRef.current;
    const documentFlow = documentFlowRef.current;

    if (!editor || !documentFlow) {
      return [];
    }

    const editorRect = editor.getBoundingClientRect();

    const elements = Array.from(
      documentFlow.querySelectorAll<HTMLElement>("[data-pagination-flow]"),
    );

    const flows: FlowGeometry[] = elements.map((element) => {
      const rect = element.getBoundingClientRect();

      return {
        element,
        id: element.dataset.paginationFlow!,
        top: rect.top - editorRect.top,
        bottom: rect.bottom - editorRect.top,
      };
    });

    const intersecting = flows.filter(
      (flow) =>
        boundaryY >= flow.top - EPSILON && boundaryY <= flow.bottom + EPSILON,
    );

    return getDeepestFlows(intersecting);
  }, []);

  /* -------------------------------------------------------
       ONE PAGINATION PASS
       ------------------------------------------------------- */

  const reconcilePagination = useCallback(() => {
    const editor = editorRef.current;

    const documentFlow = documentFlowRef.current;

    if (!editor || !documentFlow) {
      return;
    }

    const editorRect = editor.getBoundingClientRect();

    const documentRect = documentFlow.getBoundingClientRect();

    /*
     * По-прежнему измеряем только
     * ВЕСЬ document layout.
     */
    const layoutBottom = documentRect.bottom - editorRect.top;

    const currentPageBottom = getPageContentBottom(pageCount);

    if (layoutBottom <= currentPageBottom + EPSILON) {
      return;
    }

    const boundaryY = currentPageBottom;

    const activeFlows = findFlowsForBoundary(boundaryY);

    if (!activeFlows.length) {
      return;
    }

    setBreaks((current) => {
      const next = [...current];

      for (const flow of activeFlows) {
        const alreadyExists = next.some(
          (pageBreak) =>
            pageBreak.flowId === flow.id && pageBreak.pageNumber === pageCount,
        );

        if (alreadyExists) {
          continue;
        }

        const flowBreaks = next.filter(
          (pageBreak) => pageBreak.flowId === flow.id,
        );

        const marginTop =
          flowBreaks.length === 0
            ? Math.max(0, boundaryY - flow.top)
            : PAGE_CONTENT_HEIGHT;

        next.push({
          pageNumber: pageCount,
          flowId: flow.id,
          marginTop,
        });
      }

      return next;
    });
  }, [pageCount, findFlowsForBoundary]);

  /*
   * Каждый новый breaker меняет browser layout.
   *
   * Поэтому:
   *
   * render
   * → layout
   * → measure
   * → add break
   * → render
   * → layout
   * → measure
   * ...
   */
  useLayoutEffect(() => {
    if (previousRevisionRef.current !== revision) {
      previousRevisionRef.current = revision;

      if (breaks.length > 0) {
        setBreaks([]);
        return;
      }
    }

    reconcilePagination();
  }, [revision, breaks.length, reconcilePagination]);

  /*
   * Пока для prototype при любом
   * изменении content строим pagination
   * заново.
   *
   * input всплывает сюда из любого
   * contentEditable внутри шаблона.
   */
  const handleInput = useCallback(() => {
    setBreaks([]);
  }, []);

  return (
    <PaginationContext.Provider value={{ breaks }}>
      <div className="__editor-wrapper">
        <div
          ref={editorRef}
          className="editor"
          style={
            {
              "--page-width": `${PAGE_WIDTH}px`,

              "--page-height": `${PAGE_HEIGHT}px`,

              "--page-padding-x": `${PAGE_PADDING_X}px`,

              "--header-height": `${HEADER_HEIGHT}px`,

              "--footer-height": `${FOOTER_HEIGHT}px`,

              "--page-gap": `${PAGE_GAP}px`,

              "--page-break-height": `${PAGE_BREAK_HEIGHT}px`,

              "--editor-height": `${editorHeight}px`,
            } as CSSProperties
          }
        >
          <VisualPagination pageCount={pageCount} />

          <div
            ref={documentFlowRef}
            className="document-flow"
            onInput={handleInput}
          >
            {children}
          </div>
        </div>
      </div>
    </PaginationContext.Provider>
  );
}
