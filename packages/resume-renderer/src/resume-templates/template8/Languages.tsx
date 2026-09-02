import React from "react";
import {
  ColumnsRegion,
  FullWidthRegion,
  KeepTogether,
} from "../../pagination/Pagination.js";
import SectionItem from "./SectionItem.js";
import { isLanguageFilled } from "../../lib/isSectionFilled.js";
import { ResumeForm } from "@cv-maker/shared";

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <KeepTogether>
      <SectionItem
        title="Languages"
        items={items}
        className="grid grid-cols-3"
        renderItem={(item) => {
          return (
            <div key={item.id}>
              <p>
                <span className="font-bold">{item.languageName}: </span>
                {item.languageLevel}
              </p>
            </div>
          );
        }}
      />
    </KeepTogether>
  );
};

export default Languages;
