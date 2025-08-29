import { forwardRef } from "react";

type PaginateProps = React.HTMLAttributes<HTMLDivElement>;

export const Paginate = Object.assign(
  forwardRef<HTMLDivElement, PaginateProps>(function Paginate(
    { children, ...props },
    ref,
  ) {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }),
  {
    Section: ({ children, ...props }: PaginateProps) => (
      <div data-paginate="section" {...props}>
        {children}
      </div>
    ),
    Columns: ({ children, ...props }: PaginateProps) => (
      <div data-paginate="columns" className="flex" {...props}>
        {children}
      </div>
    ),
    Column: ({ children, ...props }: PaginateProps) => (
      <div data-paginate="column" {...props}>
        {children}
      </div>
    ),
    Text: ({ children, ...props }: PaginateProps) => (
      <p data-paginate="text" {...props}>
        {children}
      </p>
    ),
  },
);
