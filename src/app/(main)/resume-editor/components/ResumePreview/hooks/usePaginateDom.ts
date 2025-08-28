import React, { useLayoutEffect } from "react";

type Page = HTMLElement[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
};

const usePaginateDom = ({ ref }: PaginatedDomProps) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    requestAnimationFrame(() => {
      const children = Array.from(ref.current!.children) as HTMLElement[]; // Same as [...ref.current.children]

      const newPages: Page[] = [];
      let currentPage: Page = [];
      let currentHeight = 0;

      for (const child of children) {
        const childHeight = child.offsetHeight;

        if (childHeight + currentHeight < 1123) {
          currentHeight += childHeight;
          currentPage.push(child);
        } else {
          // TODO: check if the elemnt has only one child inside, then try to split the text inside

          // Высота верхних блоков + то что мы постепенно добавляем в цикле ниже
          const innerChildren = Array.from(child.children) as HTMLElement[];

          let wrapper = child.cloneNode(false) as HTMLElement;
          let tempHeight = currentHeight;

          const tempWrappernodes = [];

          for (const [idx, innerChild] of innerChildren.entries()) {
            const innerChildHeight = innerChild.offsetHeight;

            if (tempHeight + innerChildHeight > 1123) {
              if (wrapper.children.length > 0) {
                currentPage.push(wrapper);
              }

              newPages.push(currentPage);
              currentPage = [];
              currentHeight = 0;
              tempHeight = 0;
              wrapper = child.cloneNode(false) as HTMLElement;
            }

            tempWrappernodes.push(innerChild.cloneNode(true));
            wrapper.appendChild(innerChild.cloneNode(true));
            tempHeight += innerChildHeight;
            // currentHeight += innerChildHeight;

            if (idx === innerChildren.length - 1) {
              currentPage.push(wrapper);
            }
          }
        }
      }

      if (currentPage.length > 0) {
        newPages.push(currentPage);
      }
      setPages(newPages);
    });
  }, [ref]);

  console.log({ pages });
  return pages;
};

export default usePaginateDom;
