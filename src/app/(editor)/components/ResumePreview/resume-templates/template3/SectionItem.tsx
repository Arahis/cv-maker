import React from "react";
import { Paginate } from "../../Paginate";
import { cn } from "@/lib/utils";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items: T[];
  className?: string;
  columns?: boolean;
};

const SectionItem = <T,>({
  title,
  renderItem,
  items,
  className = "",
  columns = false,
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Paginate.Section className={cn("w-full", className)}>
      <p className="mb-6 text-lg font-bold tracking-wider uppercase">{title}</p>

      <div className={cn(columns && "grid grid-cols-2 gap-4")}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
        ))}
      </div>
    </Paginate.Section>
  );
};

export default SectionItem;
