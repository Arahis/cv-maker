import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import { TextReader } from "../../text-reader.js";
import type { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import Summary from "./Summary.js";

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
    <div>
      <div className="mb-4">
        <p className="mb-1 text-[16px]">
          <span className="font-bold">{position}</span>
          {position && company && <span className="px-3">/</span>}
          <span>{company}</span>
        </p>
        {startDate && endDate && (
          <p className="text-gray-500">{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
        )}
        <p>{city}</p>
      </div>
      <TextReader value={description || EMPTY_LEXICAL_STATE} />
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
      itemsContainerClassName="space-y-6"
    />
  );
};

const LeftSection = ({ data }: { data: ResumeForm }) => {
  return (
    <div>
      <div className="pb-16 font-dm-sans">
        <p className="text-2xl font-bold mb-1 text-gray-500">
          {`${data.firstName || "First"} ${data.lastName || "Last"}`}
        </p>
        <p className="text-2xl font-bold">{data.jobTitle || "Profession"}</p>
      </div>

      <Summary data={data.summary} />
      <Experience items={data.workExperiences} />
    </div>
  );
};

export default LeftSection;
