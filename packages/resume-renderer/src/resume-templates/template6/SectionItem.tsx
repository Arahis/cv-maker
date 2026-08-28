import React from "react";
import { cn } from "../../lib/cn.js";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items?: T[];
  className?: string;
  itemsContainerClassName?: string;
};

const ITEMS_CONTAINER_CLASSNAME = "space-y-2";

const SectionItem = <T,>({
  title,
  renderItem,
  items = [],
  className = "",
  itemsContainerClassName = "",
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className} datatype="cv_info-section-item">
      <p className="mb-4 text-[18px] font-semibold text-gray-500 font-dm-sans">
        {title}
      </p>

      <div className={cn(ITEMS_CONTAINER_CLASSNAME, itemsContainerClassName)}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SectionItem;
