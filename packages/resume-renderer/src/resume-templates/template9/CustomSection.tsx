import { ResumeForm } from "@cv-maker/shared";
import React from "react";
import { KeepTogether } from "../../pagination/Pagination.js";
import SectionItem from "./SectionItem.js";
import { formatUrl } from "../../utils/formatUrl.js";

const CustomSections = ({ items }: { items: ResumeForm["customSections"] }) => {
  if (!items?.length) return;

  return (
    <React.Fragment>
      {items.map((item, idx) => {
        const title = item.sectionName?.trim();
        const sectionItems = item.sectionItems ?? [];

        if (!title) return null;
        if (sectionItems.length === 0) return null;

        return (
          <KeepTogether key={item.id ?? `${title}-${idx}`}>
            <SectionItem
              title={title}
              items={sectionItems}
              renderItem={(i) => {
                return (
                  <div key={i.id} className="pt-1.5">
                    <p className="font-bold">{i.title}</p>
                    <p>{formatUrl(i.value)}</p>
                  </div>
                );
              }}
            />
          </KeepTogether>
        );
      })}
    </React.Fragment>
  );
};

export default CustomSections;
