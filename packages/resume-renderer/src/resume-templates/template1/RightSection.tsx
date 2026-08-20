import React from "react";
import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import { TextReader } from "../../text-reader.js";
import type { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import {
  ColumnsRegion,
  FullWidthRegion,
  NestedColumnsRegion,
} from "../../pagination/Pagination.js";

// TODO add proper type for item so it could see item fields
export function JobSection({
  item,
}: {
  item: NonNullable<ResumeForm["workExperiences"]>[number];
}) {
  const {
    position,
    city,
    startDate,
    endDate,
    company,
    description,
    isFullDate,
  } = item;
  return (
    <NestedColumnsRegion
      leftColumn={
        <div className="text-sm">
          <p className="font-semibold uppercase mb-2">{position}</p>
          <p>{city}</p>
          {startDate && endDate && (
            <p>{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
          )}
        </div>
      }
      rightColumn={
        <div className="text-sm">
          <p className="mb-2 font-bold uppercase">{company}</p>
          <TextReader value={description || EMPTY_LEXICAL_STATE} />
        </div>
      }
    />
  );
}

const RightSection = ({ data }: { data: ResumeForm }) => {
  const isFilledSection = data.workExperiences?.some(isWorkExperienceFilled);

  if (!isFilledSection) return null;

  return (
    <div className="right-section" datatype="cv_info-right-section">
      <SectionItem
        title={"Job Experience"}
        items={data.workExperiences || []}
        renderItem={(item) => <JobSection item={item} />}
        itemsContainerClassName="space-y-6"
      />
    </div>
  );
};

export default RightSection;
