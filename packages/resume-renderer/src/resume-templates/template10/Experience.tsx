import { ResumeForm } from "@cv-maker/shared";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import { WorkExperienceDescription } from "../WorkExperienceDescription.js";

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
    <div className="not-last:mb-6">
      <div className="mb-2">
        <p className="text-lg font-bold">{position}</p>
        <ColumnsRegion
          leftColumn={
            <p className="font-semibold text-base">
              {company && <span>{company}</span>}
            </p>
          }
          rightColumn={
            <p className="w-full text-base text-right">
              {city && (
                <>
                  <span className="text-gray-600">{city}</span>
                </>
              )}
              {city && startDate && <span className="px-4">|</span>}
              {startDate && (
                <>
                  <span>
                    {`${formatDate(isFullDate, startDate)} - ${
                      endDate ? formatDate(isFullDate, endDate) : "Present"
                    }`}
                  </span>
                </>
              )}
            </p>
          }
        />
      </div>

      <WorkExperienceDescription bullets={descriptionBullets} />
    </div>
  );
}

const Experience = ({ items }: { items: ResumeForm["workExperiences"] }) => {
  const isFilledSection = items?.some(isWorkExperienceFilled);

  if (!isFilledSection) return null;

  return (
    <SectionItem
      title={"Experience"}
      items={items || []}
      renderItem={(item) => <JobSection item={item} />}
    />
  );
};

export default Experience;
