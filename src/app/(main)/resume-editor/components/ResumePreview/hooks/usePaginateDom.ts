import React, { useEffect } from "react";

type Page = HTMLElement[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
};

const usePaginateDom = ({ ref }: PaginatedDomProps) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useEffect(() => {
    if (!ref.current) return;

    const children = Array.from(ref.current.children) as HTMLElement[]; // Same as [...ref.current.children]

    const newPages: Page[] = [];
    let currentPage: Page = [];
    let currentHeight = 0;

    for (const child of children) {
      const childHeight = child.offsetHeight;

      if (childHeight + currentHeight > 1123) {
        newPages.push(currentPage);
        currentPage = [child];
        currentHeight = childHeight;
      } else {
        currentHeight += childHeight;
        currentPage.push(child);
      }

      // console.log({ childHeight, currentHeight, currentPage });
    }

    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }
    setPages(newPages);
  }, [ref]);

  console.log({ pages });
  return pages;
};

export default usePaginateDom;
