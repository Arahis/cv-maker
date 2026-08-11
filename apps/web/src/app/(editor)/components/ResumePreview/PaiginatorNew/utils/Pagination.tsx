import { createContext, useContext, useId, type ReactNode } from "react";

export const PAGE_WIDTH = 793.7;
export const PAGE_HEIGHT = 1122.52;

export const PAGE_PADDING_X = 72;

export const HEADER_HEIGHT = 72;
export const FOOTER_HEIGHT = 72;
export const PAGE_GAP = 16;

export const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

export const PAGE_BREAK_HEIGHT = FOOTER_HEIGHT + PAGE_GAP + HEADER_HEIGHT;

export const PAGE_STRIDE = PAGE_HEIGHT + PAGE_GAP;

export const EPSILON = 0.5;

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
  const pageTop = (pageNumber - 1) * PAGE_STRIDE;

  return pageTop + PAGE_HEIGHT - FOOTER_HEIGHT;
}

/* =========================================================
   FLOAT BREAKS
   ========================================================= */

function FlowBreaks({ breaks }: { breaks: FlowBreak[] }) {
  console.table(
    breaks.map((b) => ({
      pageNumber: b.pageNumber,
      flowId: b.flowId,
      marginTop: b.marginTop,
    })),
  );
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
}: {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}) {
  return (
    <div className="columns-region">
      <PaginationFlow className="column">
        <div className="column-content">{leftColumn}</div>
      </PaginationFlow>

      <PaginationFlow className="column">
        <div className="column-content">{rightColumn}</div>
      </PaginationFlow>
    </div>
  );
}

/* =========================================================
   VISUAL PAGINATION
   ========================================================= */

export function VisualPagination({ pageCount }: { pageCount: number }) {
  return (
    <div className="visual-pagination" aria-hidden="true">
      {Array.from({ length: pageCount }, (_, pageIndex) => {
        const pageNumber = pageIndex + 1;

        const pageTop = pageIndex * PAGE_STRIDE;

        return (
          <div key={pageNumber}>
            <div
              className="visual-header"
              style={{
                top: pageTop,
              }}
            >
              Header page {pageNumber}
            </div>

            <div
              className="visual-footer"
              style={{
                top: pageTop + PAGE_HEIGHT - FOOTER_HEIGHT,
              }}
            >
              Footer page {pageNumber}
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
