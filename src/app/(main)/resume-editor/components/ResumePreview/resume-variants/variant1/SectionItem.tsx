import React from "react";
import { Paginate } from "../../Paginate";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
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
    <Paginate.Section className={className} datatype="cv_info-section-item">
      <p className="mb-4 text-[16px] uppercase">{title}</p>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
      ))}
    </Paginate.Section>
  );
};

export default SectionItem;
