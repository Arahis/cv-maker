import React from "react";
import {
  ColumnsRegion,
  FullWidthRegion,
  KeepTogether,
} from "../../pagination/Pagination.js";
import { cn } from "../../lib/cn.js";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items?: T[];
  className?: string;
  columns?: boolean;
};

const SectionItem = <T,>({
  title,
  renderItem,
  items = [],
  className = "",
  columns = false,
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <KeepTogether className="w-full mb-2">
        <div className="flex gap-4 items-center w-full">
          <p className={cn("font-brand text-xl font-semibold")}>{title}</p>
          <div className="flex-1 bg-gray-300 h-1" />
        </div>
      </KeepTogether>
      {columns ? (
        Array.from({ length: Math.ceil(items.length / 2) }, (_, rowIndex) => {
          const row = items.slice(rowIndex * 2, rowIndex * 2 + 2);

          return (
            <KeepTogether key={rowIndex} className="w-full pb-4">
              <ColumnsRegion
                leftColumn={renderItem(row[0], rowIndex * 2)}
                rightColumn={
                  row[1] ? renderItem(row[1], rowIndex * 2 + 1) : null
                }
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                gap={16}
              />
            </KeepTogether>
          );
        })
      ) : (
        <FullWidthRegion>
          <div className={cn(className)}>
            {items.map((item, idx) => (
              <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
            ))}
          </div>
        </FullWidthRegion>
      )}
    </div>
  );
};

export default SectionItem;
