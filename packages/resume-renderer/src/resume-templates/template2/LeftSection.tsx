import { ResumeForm } from "@cv-maker/shared";
import { formatDate } from "../../utils/formatDate.js";
import { TextReader } from "../../text-reader.js";
import SectionItem from "./SectionItem.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import {
  KeepTogether,
  NestedColumnsRegion,
} from "../../pagination/Pagination.js";
import { useFitContentWidth } from "../hooks/useFitContentWidth.js";

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

  const { ref: leftContentRef, width: leftWidth } =
    useFitContentWidth<HTMLDivElement>();
  return (
    <KeepTogether className="not-last:pb-4">
      <div>
        <NestedColumnsRegion
          className="mb-1 items-start"
          divider
          gridTemplateColumns={
            leftWidth === null
              ? "fit-content(50%) minmax(0, 1fr)"
              : `${leftWidth}px minmax(0, 1fr)`
          }
          leftColumn={
            <div ref={leftContentRef}>
              <p className="text-lg font-bold">{company}</p>
            </div>
          }
          rightColumn={
            <p className="text-lg font-bold text-gray-500">{position}</p>
          }
        />
        <div className="mb-1">
          {startDate && (
            <p className="pr-4 font-bold text-gray-400">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
          )}
          {city && <p className="text-gray-400 italic">{city}</p>}
        </div>
        <TextReader value={description || ""} />
      </div>
    </KeepTogether>
  );
}

const LeftSection = ({ data }: { data: ResumeForm }) => {
  const isFilledSection = data.workExperiences?.some(isWorkExperienceFilled);

  if (!isFilledSection) return null;

  return (
    <div>
      <SectionItem
        title={"Job Experience"}
        items={data.workExperiences || []}
        renderItem={(item) => <JobSection item={item} />}
      />
    </div>
  );
};

export default LeftSection;
