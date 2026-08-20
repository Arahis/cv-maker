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
    const invalidate = useCallback(() => {
      setBreaks([]);
    }, []);

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
          (other) =>
            other !== flow &&
            flow.element.contains(other.element) &&
            !flow.element.hasAttribute("data-pagination-keep-together"),
        ) && !flows.some(
          (other) =>
            other !== flow &&
            other.element.hasAttribute("data-pagination-keep-together") &&
            other.element.contains(flow.element),
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

      const flowTops = new Map(
        Array.from(
          documentFlow.querySelectorAll<HTMLElement>(
            "[data-pagination-flow]",
          ),
        ).map((flow) => [
          flow.dataset.paginationFlow!,
          flow.getBoundingClientRect().top - editorRect.top,
        ]),
      );

      const hasStaleBreak = breaks.some((pageBreak) => {
        const currentTop = flowTops.get(pageBreak.flowId);
        return (
          currentTop === undefined ||
          Math.abs(currentTop - pageBreak.flowTop) > EPSILON
        );
      });

      if (hasStaleBreak) {
        setBreaks([]);
        return;
      }

      const textWalker = document.createTreeWalker(
        documentFlow,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            node.parentElement?.closest(".pagination-widget")
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT,
        },
      );
      let layoutBottom = 0;
      let textNode = textWalker.nextNode();

      while (textNode) {
        const range = document.createRange();
        range.selectNodeContents(textNode);
        for (const rect of range.getClientRects()) {
          layoutBottom = Math.max(
            layoutBottom,
            rect.bottom - editorRect.top,
          );
        }
        textNode = textWalker.nextNode();
      }

      const currentPageBottom = getGeometryPageContentBottom(
        pageCount,
        geometry,
      );

      if (layoutBottom <= currentPageBottom + EPSILON) {
        return;
      }

      const boundaryY = currentPageBottom;
      const breakZoneBottom =
        boundaryY + getPageBreakHeight(geometry);

      const activeFlows = findFlowsForBoundary(boundaryY);

      const nestedBreakFlows: FlowGeometry[] = [];
      const nestedChildParentIds = new Map<string, string>();
      const nestedChildInBreakZone = new Map<string, boolean>();

      for (const nestedRegion of documentFlow.querySelectorAll<HTMLElement>(
        ".nested-columns-region",
      )) {
        const nestedRect = nestedRegion.getBoundingClientRect();
        const nestedTop = nestedRect.top - editorRect.top;
        const nestedBottom = nestedRect.bottom - editorRect.top;
        const childFlows = Array.from(
          nestedRegion.querySelectorAll<HTMLElement>(
            "[data-pagination-flow]",
          ),
        );
        const parentFlow = nestedRegion.parentElement?.closest<HTMLElement>(
          "[data-pagination-flow]",
        );
        const crossesBoundary =
          nestedTop < breakZoneBottom - EPSILON &&
          nestedBottom > boundaryY + EPSILON;
        if (parentFlow) {
          const parentFlowId = parentFlow.dataset.paginationFlow!;

          for (const element of childFlows) {
            const childFlowId = element.dataset.paginationFlow!;

            nestedChildParentIds.set(childFlowId, parentFlowId);
            nestedChildInBreakZone.set(childFlowId, crossesBoundary);
          }
        }

        if (!crossesBoundary) {
          continue;
        }

        const isInsideKeepTogether =
          nestedRegion.closest("[data-pagination-keep-together]") !== null;

        if (parentFlow && !isInsideKeepTogether) {
          for (const element of childFlows) {
            const rect = element.getBoundingClientRect();
            const childFlowId = element.dataset.paginationFlow!;

            nestedBreakFlows.push({
              element,
              id: childFlowId,
              top: rect.top - editorRect.top,
              bottom: rect.bottom - editorRect.top,
            });
          }
        }
      }

      const targetFlows = [
        ...activeFlows,
        ...nestedBreakFlows,
      ].filter(
        (flow, index, flows) =>
          flows.findIndex((candidate) => candidate.id === flow.id) === index,
      );

      if (!targetFlows.length) {
        return;
      }

      setBreaks((current) => {
        const next = [...current];
        let changed = false;

        for (const flow of targetFlows) {
          const alreadyExists = next.some(
            (pageBreak) =>
              pageBreak.flowId === flow.id &&
              pageBreak.pageNumber === pageCount,
          );

          if (alreadyExists) continue;

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
            flowTop: flow.top,
          });
          changed = true;
        }

        const cleaned = next.filter((pageBreak) => {
          const parentFlowId = nestedChildParentIds.get(pageBreak.flowId);

          if (!parentFlowId) {
            return true;
          }

          const parentBreakExists = next.some(
            (parentBreak) =>
              parentBreak.flowId === parentFlowId &&
              parentBreak.pageNumber === pageBreak.pageNumber,
          );

          // A nested region can temporarily straddle the parent's break
          // zone. In that state the child break is still required: removing
          // it makes the grid reflow above the parent breaker. Clean it only
          // after the nested region has moved completely below the zone.
          const nestedRegionIsInBreakZone = nestedChildInBreakZone.get(
            pageBreak.flowId,
          );

          return !parentBreakExists || nestedRegionIsInBreakZone === true;
        });

        if (cleaned.length !== next.length) {
          changed = true;
          next.splice(0, next.length, ...cleaned);
        }

        return changed ? next : current;
      });
    }, [pageCount, findFlowsForBoundary, geometry]);

    /*
     * Every new breaker changes browser layout.
     */
    useLayoutEffect(() => {
      let frameId: number | undefined;

      if (previousRevisionRef.current !== revision) {
        previousRevisionRef.current = revision;

        if (breaks.length > 0) {
          setBreaks([]);
        } else {
          reconcilePagination();
        }
      } else {
        reconcilePagination();
      }

      frameId = window.requestAnimationFrame(() => {
        reconcilePagination();
      });

      return () => {
        if (frameId !== undefined) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }, [revision, breaks, reconcilePagination]);

    // handleInput when block is editable in preview
    const handleInput = useCallback(() => {
      setBreaks([]);
    }, []);

    return (
      <PaginationContext.Provider value={{ breaks, geometry, invalidate }}>
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
