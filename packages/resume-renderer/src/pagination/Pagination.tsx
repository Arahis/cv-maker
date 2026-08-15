import { createContext, useContext, useId, type ReactNode } from "react";
import {
  EPSILON,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_WIDTH,
  DEFAULT_PAGINATION_GEOMETRY,
  PaginationGeometry,
  getPageBreakHeight,
  getPageContentBottom as getGeometryPageContentBottom,
  getPageContentHeight,
  getPageStride,
} from "./geometry.js";
import { cn } from "../lib/cn.js";

export {
  EPSILON,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_WIDTH,
} from "./geometry.js";

export const PAGE_GAP = 16;
export const PAGE_CONTENT_HEIGHT = getPageContentHeight();
const DEFAULT_PREVIEW_GEOMETRY = {
  ...DEFAULT_PAGINATION_GEOMETRY,
  pageGap: PAGE_GAP,
};
export const PAGE_BREAK_HEIGHT = getPageBreakHeight(DEFAULT_PREVIEW_GEOMETRY);
export const PAGE_STRIDE = getPageStride(DEFAULT_PREVIEW_GEOMETRY);

export type FlowBreak = {
  pageNumber: number;
  flowId: string;
  marginTop: number;
};

/* =========================================================
   PAGINATION CONTEXT
   ========================================================= */

type PaginationContextValue = {
  breaks: FlowBreak[];
  geometry: PaginationGeometry;
};

export const PaginationContext = createContext<PaginationContextValue | null>(
  null,
);

function useFlowBreaks(flowId: string) {
  const context = useContext(PaginationContext);

  if (!context) {
    throw new Error("Pagination flows must be used inside PaginationDocument");
  }

  return context.breaks.filter((pageBreak) => pageBreak.flowId === flowId);
}

/* =========================================================
   PAGE GEOMETRY
   ========================================================= */

export function getPageContentBottom(pageNumber: number) {
  return getGeometryPageContentBottom(pageNumber, DEFAULT_PREVIEW_GEOMETRY);
}

/* =========================================================
   FLOAT BREAKS
   ========================================================= */

function FlowBreaks({ breaks }: { breaks: FlowBreak[] }) {
  return (
    <>
      {breaks.map((pageBreak, idx) => (
        <div
          key={`${pageBreak.flowId}-${pageBreak.pageNumber}`}
          className="pagination-widget"
          contentEditable={false}
        >
          <div className="page-break">
            <div
              className="page-anchor"
              style={{
                marginTop: pageBreak.marginTop,
              }}
            />

            <div className="flow-breaker" />
          </div>
        </div>
      ))}
    </>
  );
}

/* =========================================================
    MAIN PAGINATION FLOW
   ========================================================= */

function PaginationFlow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const flowId = useId();

  const breaks = useFlowBreaks(flowId);

  return (
    <div
      className={`pagination-flow ${className ?? ""}`}
      data-pagination-flow={flowId}
    >
      <FlowBreaks breaks={breaks} />

      {children}
    </div>
  );
}

/* =========================================================
   FULL WIDTH REGION
   ========================================================= */

export function FullWidthRegion({ children }: { children: ReactNode }) {
  return (
    <PaginationFlow className="full-width-region">
      <div className="region-content">{children}</div>
    </PaginationFlow>
  );
}

/* =========================================================
   COLUMNS REGION
   ========================================================= */

export function ColumnsRegion({
  leftColumn,
  rightColumn,
  className,
  rightColumnClassName,
  leftColumnClassName,
  gap = 24,
  columnRatio = { left: 35, right: 100 },
}: {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  className?: string;
  rightColumnClassName?: string;
  leftColumnClassName?: string;
  gap?: number;
  columnRatio?: { left: number; right: number };
}) {
  return (
    <div
      className={cn("columns-region", className)}
      style={{
        columnGap: `${gap}px`,
        gridTemplateColumns: `minmax(0, ${columnRatio.left}fr)
    minmax(0, ${columnRatio.right}fr)`,
      }}
    >
      <PaginationFlow className="column">
        <div className={cn("column-content", leftColumnClassName)}>
          {leftColumn}
        </div>
      </PaginationFlow>

      <PaginationFlow className="column h-full">
        <div className={cn("column-content", rightColumnClassName)}>
          {rightColumn}
        </div>
      </PaginationFlow>
    </div>
  );
}

/* =========================================================
   VISUAL PAGINATION
   ========================================================= */

export function VisualPagination({
  pageCount,
  geometry = DEFAULT_PAGINATION_GEOMETRY,
}: {
  pageCount: number;
  geometry?: PaginationGeometry;
}) {
  return (
    <div className="visual-pagination" aria-hidden="true">
      {Array.from({ length: pageCount }, (_, pageIndex) => {
        const pageNumber = pageIndex + 1;

        const pageTop = pageIndex * getPageStride(geometry);

        return (
          <div key={pageNumber}>
            <div
              className="visual-header"
              style={{
                top: pageTop,
              }}
            >
              {/* Uncomment for Testing: */}
              {/* Header page {pageNumber} */}
            </div>

            <div
              className="visual-footer"
              style={{
                top: pageTop + PAGE_HEIGHT - geometry.footerHeight,
              }}
            >
              {/* Uncomment for Testing: */}
              {/* Footer page {pageNumber} */}
            </div>

            {pageNumber < pageCount && (
              <div
                className="visual-gap"
                style={{
                  top: pageTop + PAGE_HEIGHT,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
