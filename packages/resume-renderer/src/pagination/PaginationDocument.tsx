import {
  forwardRef,
  JSX,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  EPSILON,
  FlowBreak,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PaginationContext,
  VisualPagination,
} from "./Pagination.js";
import {
  DEFAULT_PAGINATION_GEOMETRY,
  type PaginationGeometry,
  getPageBreakHeight,
  getPageContentBottom as getGeometryPageContentBottom,
  getPageContentHeight,
} from "./geometry.js";

/* =========================================================
   MAIN
   ========================================================= */
const PaginationDocument = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    revision?: unknown;
    pagePaddingX?: number;
    headerFooterHeight?: number;
    pageGap?: number;
    className?: string;
  } & Omit<JSX.IntrinsicElements["div"], "children">
>(
  (
    {
      children,
      revision,
      pagePaddingX,
      headerFooterHeight,
      pageGap,
      className,
      id,
    },
    contentRefForPrint,
  ) => {
    const geometry = useMemo<PaginationGeometry>(
      () => ({
        ...DEFAULT_PAGINATION_GEOMETRY,
        ...(pagePaddingX === undefined ? {} : { pagePaddingX }),
        ...(headerFooterHeight === undefined
          ? {}
          : {
              headerHeight: headerFooterHeight,
              footerHeight: headerFooterHeight,
            }),
        ...(pageGap === undefined ? {} : { pageGap }),
      }),
      [pagePaddingX, headerFooterHeight, pageGap],
    );
    const editorRef = useRef<HTMLDivElement>(null);
    const documentFlowRef = useRef<HTMLDivElement>(null);
    const previousRevisionRef = useRef(revision);
    const [breaks, setBreaks] = useState<FlowBreak[]>([]);

    const setEditorRef = useCallback(
      (node: HTMLDivElement | null) => {
        editorRef.current = node;

        if (typeof contentRefForPrint === "function") {
          contentRefForPrint(node);
        } else if (contentRefForPrint) {
          contentRefForPrint.current = node;
        }
      },
      [contentRefForPrint],
    );

    const pageCount =
      breaks.length === 0
        ? 1
        : Math.max(...breaks.map((pageBreak) => pageBreak.pageNumber)) + 1;
    const editorHeight =
      PAGE_HEIGHT * pageCount + geometry.pageGap * (pageCount - 1);

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
       * Measure the whole doc layout
       */
      const layoutBottom = documentRect.bottom - editorRect.top;

      const currentPageBottom = getGeometryPageContentBottom(
        pageCount,
        geometry,
      );

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
              pageBreak.flowId === flow.id &&
              pageBreak.pageNumber === pageCount,
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
              : getPageContentHeight(geometry);

          next.push({
            pageNumber: pageCount,
            flowId: flow.id,
            marginTop,
          });
        }

        return next;
      });
    }, [pageCount, findFlowsForBoundary, geometry]);

    /*
     * Every new breaker changes browser layout.
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

    // handleInput when block is editable in preview
    const handleInput = useCallback(() => {
      setBreaks([]);
    }, []);

    return (
      <PaginationContext.Provider value={{ breaks, geometry }}>
        <div className={className} id={id}>
          <div
            ref={setEditorRef}
            className="editor"
            style={
              {
                "--page-width": `${PAGE_WIDTH}px`,

                "--page-height": `${PAGE_HEIGHT}px`,

                "--page-padding-x": `${geometry.pagePaddingX}px`,

                "--header-height": `${geometry.headerHeight}px`,

                "--footer-height": `${geometry.footerHeight}px`,

                "--page-gap": `${geometry.pageGap}px`,

                "--page-break-height": `${getPageBreakHeight(geometry)}px`,

                "--editor-height": `${editorHeight}px`,
              } as CSSProperties
            }
          >
            <VisualPagination pageCount={pageCount} geometry={geometry} />

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
  },
);

export default PaginationDocument;
