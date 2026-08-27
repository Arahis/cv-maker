import React from "react";
import { cn } from "../../lib/cn.js";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items?: T[];
  className?: string;
  hideTitle?: boolean;
};

const SectionItem = <T,>({
  title,
  renderItem,
  items = [],
  className = "",
  hideTitle = false,
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <p
        className={cn(
          "mb-6 text-lg font-bold tracking-wider uppercase",
          hideTitle ? "opacity-0" : "opacity-100",
        )}
      >
        {title}
      </p>

      <div className={className}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SectionItem;
