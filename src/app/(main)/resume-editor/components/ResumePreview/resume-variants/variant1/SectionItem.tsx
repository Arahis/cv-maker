import React from "react";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T) => React.ReactNode;
  items: T[];
  className?: string;
};

const SectionItem = <T,>({
  title,
  renderItem,
  items,
  className = "",
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <p className="mb-4 text-[18px] uppercase">{title}</p>
      <div>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SectionItem;
