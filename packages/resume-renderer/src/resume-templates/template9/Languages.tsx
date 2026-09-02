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
        className="flex flex-wrap gap-4"
        renderItem={(item) => {
          return (
            <p key={item.id} className="pt-1.5">
              <span className="font-bold">{item.languageName}: </span>
              {item.languageLevel}
            </p>
          );
        }}
      />
    </KeepTogether>
  );
};

export default Languages;
