import React from "react";

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
    <div className="w-full">
      <p className="font-cantata mb-6 text-lg tracking-wider uppercase">
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
