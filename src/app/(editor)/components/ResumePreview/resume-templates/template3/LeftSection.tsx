import React from "react";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";
import { cn } from "@/lib/utils";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled";

const heightMap = {
  sm: "h-2 mx-2",
  md: "h-4 mx-4",
  lg: "h-8 mx-6",
} as const;

function Separator({ size = "md" }: { size?: keyof typeof heightMap }) {
  return <div className={cn("w-0.5 bg-gray-500", heightMap[size])} />;
}

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = Object.entries(skills).map(([head, items]) => ({
    head: head === "technical" ? "Stack" : "Strengths",
    items,
  }));

  if (!skills.personal?.length && !skills.technical?.length) return null;

  return (
    <Paginate.Columns>
      <SectionItem
        columns
        className="mb-8"
        title="Skills"
        items={skillsToArray}
        renderItem={(item) => {
          if (item.items.length === 0) return null;

          return (
            <div key={item.head} className="not-last:mb-4">
              <p className="font-bold">{item.head}</p>
              <p>{item.items.map((i) => i.name).join(", ")}</p>
            </div>
          );
        }}
      />
    </Paginate.Columns>
  );
};
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
    <Paginate.Section className="not-last:mb-8">
      <div className="flex items-center">
        <Paginate.Text className="text-lg font-bold">{position}</Paginate.Text>
        {startDate && (
          <React.Fragment>
            <Separator />
            <Paginate.Text className="text-lg font-bold text-gray-500">
              {`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}
            </Paginate.Text>
          </React.Fragment>
        )}
      </div>
      <div className="mb-2 flex items-center">
        {company && <p className="font-semibold">{company}</p>}
        {city && (
          <React.Fragment>
            <Separator size="sm" />
            <p>{city}</p>
          </React.Fragment>
        )}
      </div>
      <TextReader value={description || ""} />
    </Paginate.Section>
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

const LeftSection = ({ data }: { data: ResumeForm }) => {
  return (
    <Paginate.Section className="w-[70%] border-r border-yellow-400 py-8 pr-6">
      <Skills skills={data.skills || {}} />
      <Experience items={data.workExperiences} />
    </Paginate.Section>
  );
};

export default LeftSection;
