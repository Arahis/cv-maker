import React, { useLayoutEffect } from "react";

type Page = HTMLElement[];

type PaginatedDomProps = {
  ref: React.RefObject<HTMLElement | null>;
};

// const usePaginateDom = ({ ref }: PaginatedDomProps) => {
//   const [pages, setPages] = React.useState<Page[]>([]);

//   useLayoutEffect(() => {
//     if (!ref.current) return;

// const children = [...ref.current.children] as HTMLElement[];

// const newPages: Page[] = [];
// let currentPage: Page = [];
// let currentHeight = 0;

// const processElement = (el: HTMLElement) => {
//   const elDataType = el.dataset.paginate;
//   const elHeight = el.offsetHeight;
//   let tempWrapper: HTMLElement | null = null;

//   if (currentHeight + elHeight < 1123) {
//     // Когда есть вроппер, значит мы внутри секции, добавляем внутри вроппера детей которые в него помещаются
//     if (tempWrapper) {
//       (tempWrapper as HTMLElement).appendChild(el.cloneNode(true));
//     } else {
//       currentPage.push(el.cloneNode(true) as HTMLElement);
//     }
//     currentHeight += elHeight;
//     return;
//   }
// Не помещается целиком, заходим в секцию, прохожимся по детям
// switch (elDataType) {
//   case "section":
//   case "text":
//   case "column": {
// Если Вроппер существует, и элемент пришёл сюда, значит вропеер переполнен и надо предыдущий запушить
// на временную страницу, страницу в массив страниц и начать новый вропер и новую страницу
// TODO: если вроппер существуетт и цикл дощёл сюда, значит вроппер переполнен
// if (tempWrapper) {
//   currentPage.push(tempWrapper);
//   newPages.push(currentPage);
//   currentPage = [];
//   currentHeight = 0;

//   tempWrapper = el.cloneNode(false) as HTMLElement;
// } else {
//   const innerChildren = [...el.children] as HTMLElement[];
// }
// tempWrapper = el.cloneNode(false) as HTMLElement;

// уходим в рекурсию по детям
//   innerChildren.forEach((child) => processElement(child));
// }

// case "columns": {
//   const wrapper = el.cloneNode(false) as HTMLElement;
//   const innerChildren = [...el.children] as HTMLElement[];

//   innerChildren.forEach((child) => processElement(child, wrapper))
// }

// case "text": {
//   console.log("inside text");
// }

//     default: {
//       currentPage.push(el.cloneNode(true) as HTMLElement);
//       return;
//     }
//   }
// };

//     children.forEach((child) => processElement(child));
//     setPages((prev) => [...prev, currentPage]);
//   }, [ref]);

//   console.log({ pages });

//   return pages;
// };

// const usePaginateDom = ({ ref }: PaginatedDomProps) => {
//   const [pages, setPages] = React.useState<Page[]>([]);

//   useLayoutEffect(() => {
//     if (!ref.current) return;

//     requestAnimationFrame(() => {
//       const children = Array.from(ref.current!.children) as HTMLElement[]; // Same as [...ref.current.children]

//       const newPages: Page[] = [];
//       let currentPage: Page = [];
//       let currentHeight = 0;

//       for (const child of children) {
//         const childHeight = child.offsetHeight;

//         if (childHeight + currentHeight < 1123) {
//           currentHeight += childHeight;
//           currentPage.push(child);
//         } else {
//           // TODO: check if the elemnt has only one child inside, then try to split the text inside

//           // Высота верхних блоков + то что мы постепенно добавляем в цикле ниже
//           const innerChildren = Array.from(child.children) as HTMLElement[];

//           let wrapper = child.cloneNode(false) as HTMLElement;
//           let tempHeight = currentHeight;

//           const tempWrappernodes = [];

//           for (const [idx, innerChild] of innerChildren.entries()) {
//             const innerChildHeight = innerChild.offsetHeight;

//             if (tempHeight + innerChildHeight > 1123) {
//               if (wrapper.children.length > 0) {
//                 currentPage.push(wrapper);
//               }

//               newPages.push(currentPage);
//               currentPage = [];
//               currentHeight = 0;
//               tempHeight = 0;
//               wrapper = child.cloneNode(false) as HTMLElement;
//             }

//             tempWrappernodes.push(innerChild.cloneNode(true));
//             wrapper.appendChild(innerChild.cloneNode(true));
//             tempHeight += innerChildHeight;
//             // currentHeight += innerChildHeight;

//             if (idx === innerChildren.length - 1) {
//               currentPage.push(wrapper);
//             }
//           }
//         }
//       }

//       if (currentPage.length > 0) {
//         newPages.push(currentPage);
//       }
//       setPages(newPages);
//     });
//   }, [ref]);

//   console.log({ pages });
//   return pages;
// };

const usePaginateDom = ({ ref }: PaginatedDomProps) => {
  const [pages, setPages] = React.useState<Page[]>([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const newPages: Page[] = [];
    let currentPage: Page = [];
    let currentHeight = 0;

    const children = [...ref.current?.children] as HTMLElement[];

    for (const [elIdx, el] of children.entries()) {
      switch (el.dataset.paginate) {
        case "section": {
          const sectionWrapper = el.cloneNode(false) as HTMLElement;
          const chunkedSectionElements: Record<number, HTMLElement[]> = {};
          let chunkIndex = 0;

          const sectionChildren = [...el.children] as HTMLElement[];

          for (const sectionChild of sectionChildren) {
            const sectionChildHeight = sectionChild.offsetHeight;

            if (currentHeight + sectionChildHeight < 1123) {
              if (!chunkedSectionElements[chunkIndex]) {
                chunkedSectionElements[chunkIndex] = [];
              }
              if (!chunkedSectionElements[chunkIndex][elIdx]) {
                chunkedSectionElements[chunkIndex][elIdx] = sectionWrapper;
              }
              chunkedSectionElements[chunkIndex][elIdx].appendChild(
                sectionChild.cloneNode(true) as HTMLElement,
              );
              currentHeight += sectionChildHeight;
            } else {
              chunkIndex++;
              chunkedSectionElements[chunkIndex] = [];
              chunkedSectionElements[chunkIndex][elIdx] = sectionWrapper;
              chunkedSectionElements[chunkIndex][elIdx].appendChild(
                sectionChild.cloneNode(true) as HTMLElement,
              );
              currentHeight = sectionChildHeight;
            }
          }

          for (const key in chunkedSectionElements) {
            if (key === "0") {
              currentPage.push(sectionWrapper);
              newPages.push(currentPage);
            } else {
              currentPage = [];
              currentPage.push(sectionWrapper);
            }
          }
        }

        case "columns": {
          const columnsWrapper = el.cloneNode(false) as HTMLElement;
          const columns = [...el.children] as HTMLElement[];
          const chunkedColumnElements: Record<number, HTMLElement[]> = {};

          for (const [idx, column] of columns.entries()) {
            let chunkIndex = 0;
            const columnWrapper = column.cloneNode(false) as HTMLElement;
            const columnChildren = [...column.children] as HTMLElement[];

            for (const columnChild of columnChildren) {
              // TODO: возможно нужно будет переписать логику потому что одна колонка может умещаться а вторая нет
              const columnChildHeight = columnChild.offsetHeight;

              if (currentHeight + columnChildHeight < 1123) {
                // if для первого входа в цикл
                if (!chunkedColumnElements[chunkIndex]) {
                  chunkedColumnElements[chunkIndex] = [];
                }
                if (!chunkedColumnElements[chunkIndex][idx]) {
                  chunkedColumnElements[chunkIndex][idx] = columnWrapper;
                }
                chunkedColumnElements[chunkIndex][idx].appendChild(
                  columnChild.cloneNode(true) as HTMLElement,
                );
                currentHeight += columnChildHeight;
              } else {
                chunkIndex++;
                chunkedColumnElements[chunkIndex] = [];
                chunkedColumnElements[chunkIndex][idx] = columnWrapper;
                chunkedColumnElements[chunkIndex][idx].appendChild(
                  columnChild.cloneNode(true) as HTMLElement,
                );
                currentHeight = columnChildHeight;
              }
            }
          }

          for (const key in chunkedColumnElements) {
            if (key === "0") {
              chunkedColumnElements[key].forEach((col) =>
                columnsWrapper.appendChild(col),
              );
              currentPage.push(columnsWrapper);
              newPages.push(currentPage);
            } else {
              currentPage = [];
              chunkedColumnElements[key].forEach((col) =>
                columnsWrapper.appendChild(col),
              );
              currentPage.push(columnsWrapper);
            }
          }
        }

        default:
          console.warn(`Unknown data-paginate type: ${el.dataset.paginate}`);
          return;
      }
    }

    setPages(newPages);
  }, [ref]);

  return pages;
};

export default usePaginateDom;
