import React from "react";
import { cn } from "../../lib/cn.js";
import { ColumnsRegion, KeepTogether } from "../../pagination/Pagination.js";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items?: T[];
  className?: string;
  columns?: boolean;
  align?: "left" | "center" | "right";
};

const SectionItem = <T,>({
  title,
  renderItem,
  items = [],
  className = "",
  columns = false,
  align = "left",
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full"
      style={{
        textAlign: align,
      }}
    >
      <p className="font-brand mb-6 text-lg uppercase">{title}</p>
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
        <div className={className}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
