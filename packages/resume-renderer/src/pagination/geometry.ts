export const PAGE_WIDTH = 793.7;
export const PAGE_HEIGHT = 1122.52;
export const PAGE_PADDING_X = 72;
export const HEADER_HEIGHT = 72;
export const FOOTER_HEIGHT = 72;
export const EPSILON = 0.5;

export type PaginationGeometry = {
  pagePaddingX: number;
  headerHeight: number;
  footerHeight: number;
  pageGap: number;
};

export const DEFAULT_PAGINATION_GEOMETRY: PaginationGeometry = {
  pagePaddingX: PAGE_PADDING_X,
  headerHeight: HEADER_HEIGHT,
  footerHeight: FOOTER_HEIGHT,
  pageGap: 16,
};

export function getPageContentHeight(geometry = DEFAULT_PAGINATION_GEOMETRY) {
  return PAGE_HEIGHT - geometry.headerHeight - geometry.footerHeight;
}

export function getPageBreakHeight(geometry = DEFAULT_PAGINATION_GEOMETRY) {
  return (
    geometry.footerHeight + geometry.pageGap + geometry.headerHeight
  );
}

export function getPageStride(geometry = DEFAULT_PAGINATION_GEOMETRY) {
  return PAGE_HEIGHT + geometry.pageGap;
}

export function getPageContentBottom(
  pageNumber: number,
  geometry = DEFAULT_PAGINATION_GEOMETRY,
) {
  const pageTop = (pageNumber - 1) * getPageStride(geometry);
  return pageTop + PAGE_HEIGHT - geometry.footerHeight;
}
