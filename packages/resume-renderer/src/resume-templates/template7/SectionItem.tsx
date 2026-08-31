import React from "react";
import { FullWidthRegion } from "../../pagination/Pagination.js";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items?: T[];
  className?: string;
};

const SectionItem = <T,>({
  title,
  renderItem,
  items = [],
  className = "",
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <FullWidthRegion>
      <div className="w-full">
        <p className="font-brand mb-4 pb-2 text-lg tracking-wider uppercase border-b-2 border-gray-500">
          {title}
        </p>

        <div className={className}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
          ))}
        </div>
      </div>
    </FullWidthRegion>
  );
};

export default SectionItem;
