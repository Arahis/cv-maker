import { ResumeForm } from "@cv-maker/shared";
import { formatDate } from "../../utils/formatDate.js";
import { TextReader } from "../../text-reader.js";
import SectionItem from "./SectionItem.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";

function Separator() {
  return <div className="mx-4 h-4 w-0.5 bg-gray-500" />;
}
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
    <div className="not-last:mb-8">
      <div className="mb-1 flex items-center">
        <p className="text-lg font-bold">{company}</p>
        <Separator />
        <p className="text-lg font-bold text-gray-500">{position}</p>
      </div>
      <div className="mb-1 flex">
        {startDate && (
          <p className="pr-4 font-bold text-gray-400">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
        )}
        {city && <p className="text-gray-400 italic">{city}</p>}
      </div>
      <TextReader value={description || ""} />
    </div>
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
