import React from "react";
import { Paginate } from "../../Paginate";

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
    <Paginate.Section className={className}>
      <p className="mb-4 text-[18px] uppercase">{title}</p>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
      ))}
    </Paginate.Section>
  );
};

export default SectionItem;
