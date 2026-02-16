import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type PaginateProps = React.HTMLAttributes<HTMLDivElement>;

export const Paginate = Object.assign(
  forwardRef<HTMLDivElement, PaginateProps>(function Paginate(
    { children, ...props },
    ref,
  ) {
    return (
      <div ref={ref} data-paginate="main">
        <div {...props} className="resume-template">
          {children}
        </div>
      </div>
    );
  }),
  {
    Section: ({ children, ...props }: PaginateProps) => (
      <div data-paginate="section" {...props}>
        {children}
      </div>
    ),
    Columns: ({ children, className, ...props }: PaginateProps) => (
      <div data-paginate="columns" className={cn("flex", className)} {...props}>
        {children}
      </div>
    ),
    Block: ({ children, ...props }: PaginateProps) => (
      <div data-paginate="block" {...props}>
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
