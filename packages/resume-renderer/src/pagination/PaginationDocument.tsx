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
import { cn } from "../lib/cn.js";

function getRenderedScale(renderedSize: number, layoutSize: number) {
  return layoutSize > 0 ? renderedSize / layoutSize : 1;
}

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
    editorClassName?: string;
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
      editorClassName,
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
    const pendingMeasurementsRef = useRef(0);
    const initialMeasurementsCompleteRef = useRef(false);
    const [measurementsReady, setMeasurementsReady] = useState(true);
    const invalidate = useCallback(() => {
      setBreaks([]);
    }, []);

    const beginMeasurement = useCallback(() => {
      const isInitialMeasurement = !initialMeasurementsCompleteRef.current;
      pendingMeasurementsRef.current += 1;

      if (isInitialMeasurement) {
        setMeasurementsReady(false);
      }

      let completed = false;
      return () => {
        if (completed) return;
        completed = true;
        pendingMeasurementsRef.current -= 1;
        if (pendingMeasurementsRef.current === 0) {
          if (!initialMeasurementsCompleteRef.current) {
            initialMeasurementsCompleteRef.current = true;
            setMeasurementsReady(true);
          } else {
            invalidate();
          }
        }
      };
    }, [invalidate]);

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
        return (
          !flows.some(
            (other) =>
              other !== flow &&
              flow.element.contains(other.element) &&
              !flow.element.hasAttribute("data-pagination-keep-together"),
          ) &&
          !flows.some(
            (other) =>
              other !== flow &&
              other.element.hasAttribute("data-pagination-keep-together") &&
              other.element.contains(flow.element),
          )
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
      const scaleY = getRenderedScale(editorRect.height, editor.offsetHeight);

      const elements = Array.from(
        documentFlow.querySelectorAll<HTMLElement>("[data-pagination-flow]"),
      );

      const flows: FlowGeometry[] = elements.map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          element,
          id: element.dataset.paginationFlow!,
          top: (rect.top - editorRect.top) / scaleY,
          bottom: (rect.bottom - editorRect.top) / scaleY,
        };
      });

      const intersecting = flows.filter(
        (flow) =>
          boundaryY >= flow.top - EPSILON && boundaryY <= flow.bottom + EPSILON,
      );

      if (intersecting.length > 0) {
        return getDeepestFlows(intersecting);
      }

      /*
       * A page boundary can fall into the margin/gap between two flows. In
       * that case no flow intersects the boundary, even though the following
       flow still contains content that must be moved to the next page.
       * Attach the break to the first flow after the boundary instead of
       * silently skipping the page break.
       */
      const followingFlows = flows.filter(
        (flow) => flow.top > boundaryY + EPSILON,
      );

      if (followingFlows.length === 0) {
        return [];
      }

      const nextFlowTop = Math.min(
        ...followingFlows.map((flow) => flow.top),
      );
      const nextFlows = followingFlows.filter(
        (flow) => Math.abs(flow.top - nextFlowTop) <= EPSILON,
      );

      return getDeepestFlows(nextFlows);
    }, []);

    /* -------------------------------------------------------
       ONE PAGINATION PASS
       ------------------------------------------------------- */

    const reconcilePagination = useCallback(() => {
      if (!measurementsReady || pendingMeasurementsRef.current > 0) return;

      const editor = editorRef.current;

      const documentFlow = documentFlowRef.current;

      if (!editor || !documentFlow) {
        return;
      }

      const editorRect = editor.getBoundingClientRect();
      const scaleY = getRenderedScale(editorRect.height, editor.offsetHeight);

      const flowTops = new Map(
        Array.from(
          documentFlow.querySelectorAll<HTMLElement>("[data-pagination-flow]"),
        ).map((flow) => [
          flow.dataset.paginationFlow!,
          (flow.getBoundingClientRect().top - editorRect.top) / scaleY,
        ]),
      );

      // A break changes the position of following flows by design. Comparing
      // their current top with the top captured before inserting the break
      // makes pagination oscillate between clearing and re-adding breaks.
      // Content changes already invalidate breaks through `revision` and
      // editable input; here we only discard breaks whose flow disappeared.
      const hasStaleBreak = breaks.some(
        (pageBreak) => !flowTops.has(pageBreak.flowId),
      );

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
            (rect.bottom - editorRect.top) / scaleY,
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
      const activeFlows = findFlowsForBoundary(boundaryY);
      if (!activeFlows.length) {
        return;
      }

      setBreaks((current) => {
        const next = [...current];
        let changed = false;

        for (const flow of activeFlows) {
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

        return changed ? next : current;
      });
    }, [pageCount, findFlowsForBoundary, geometry, measurementsReady]);

    /*
     * Every new breaker changes browser layout.
     */
    useLayoutEffect(() => {
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

      // Reconciliation is intentionally synchronous here so the preview does
      // not paint an unpaginated state before the calculated breaks appear.
      // A second requestAnimationFrame pass caused duplicate state updates.
    }, [revision, breaks, reconcilePagination]);

    // handleInput when block is editable in preview
    const handleInput = useCallback(() => {
      setBreaks([]);
    }, []);

    return (
      <PaginationContext.Provider
        value={{ breaks, geometry, invalidate, beginMeasurement }}
      >
        <div id={id}>
          <div
            ref={setEditorRef}
            className={`editor ${editorClassName ?? ""}`}
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
              className={`document-flow ${className ?? ""}`}
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
