import React from "react";
import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import type { ResumeForm } from "@cv-maker/shared";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import {
  ColumnsRegion,
  FullWidthRegion,
} from "../../pagination/Pagination.js";
import { WorkExperienceDescription } from "../WorkExperienceDescription.js";

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
    descriptionBullets,
    isFullDate,
  } = item;
  return (
    <ColumnsRegion
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
          <WorkExperienceDescription bullets={descriptionBullets} />
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
