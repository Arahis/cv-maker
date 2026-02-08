import React from "react";
import { Paginate } from "../../Paginate";
import { cn } from "@/lib/utils";

type SectionProps<T> = {
  title: string;
  renderItem: (item: T, idx: number) => React.ReactNode;
  items: T[];
  className?: string;
  columns?: boolean;
  align?: "left" | "center" | "right";
};

const SectionItem = <T,>({
  title,
  renderItem,
  items,
  className = "",
  columns = false,
  align = "left",
}: SectionProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Paginate.Section
      className={cn("w-full", className)}
      style={{ textAlign: align }}
    >
      <p className="font-brand mb-6 text-lg uppercase">{title}</p>

      <div className={cn(columns && "grid grid-cols-2 gap-4")}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
        ))}
      </div>
    </Paginate.Section>
  );
};

export default SectionItem;
