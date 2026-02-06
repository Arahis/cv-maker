import { formatDate } from "../../utils/formatDate";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";

const Education = ({
  educations,
}: {
  educations: ResumeForm["educations"];
}) => {
  if (!educations?.length) return;

  return (
    <SectionItem
      title="Education"
      renderItem={({
        degree,
        institution,
        city,
        startDate,
        endDate,
        isFullDate,
      }) => (
        <div className="mb-4">
          <p className="mb-2 text-[16px] font-bold">{degree}</p>
          <p className="text-[16px]">{institution}</p>
          <div className="mb-0.5">
            {startDate && (
              <p className="mr-2">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
            )}
            {city && <p className="italic">{city}</p>}
          </div>
        </div>
      )}
      items={educations || []}
      className="mb-12"
    />
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const { educations } = data;

  return (
    <Paginate.Section className="w-[30%] py-8 pl-6">
      <Education educations={educations || []} />
    </Paginate.Section>
  );
};

export default RightSection;
