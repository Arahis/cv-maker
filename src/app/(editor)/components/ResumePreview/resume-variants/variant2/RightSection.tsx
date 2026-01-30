import React from "react";
import { formatDate } from "../../utils/formatDate";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";

const Education = ({
  educations,
}: {
  educations: ResumeForm["educations"];
}) => {
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
        <div>
          <p className="mb-0.5 text-[16px] font-bold">{degree}</p>
          <div className="mb-0.5 text-gray-400">
            {startDate && (
              <p className="mr-2">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
            )}
            <p className="italic">{city}</p>
          </div>
          <p className="">{institution}</p>
        </div>
      )}
      items={educations || []}
      className="mb-12"
    />
  );
};

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = Object.entries(skills).map(([head, items]) => ({
    head: head === "technical" ? "Stack" : "Strengths",
    items,
  }));

  if (skills.personal?.length === 0 && skills.technical?.length === 0)
    return null;

  return (
    <SectionItem
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
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const { educations, skills } = data;

  return (
    <Paginate.Section>
      <Education educations={educations || []} />

      <Skills skills={skills || {}} />

      {/* <div className="mb-6" datatype="left-section-wrapper">
        <p className="text-[16px] uppercase" datatype="left-section-text">
          Social
        </p>
        <div className="">
          <p className="font-serif">LinkedIn</p>
          <p className="">Years of education</p>
        </div>
      </div> */}
    </Paginate.Section>
  );
};

export default RightSection;
