import { ResumeForm } from "@cv-maker/shared";
import { FullWidthRegion, KeepTogether } from "../../pagination/Pagination.js";
import SectionItem from "./SectionItem.js";

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = [
    {
      head: "Technical",
      items: skills?.technical ?? [],
    },
    {
      head: "Professional",
      items: skills?.personal ?? [],
    },
  ].filter((item) => item.items.length > 0);

  return (
    <>
      {skillsToArray.map((item) => (
        <KeepTogether key={item.head}>
          <SectionItem
            title={`${item.head} Skills`}
            items={item.items}
            className="flex flex-wrap gap-2"
            renderItem={(item) => {
              return (
                <p className="max-w-full wrap-break-word bg-gray-100 px-3 py-1">
                  {item.name}
                </p>
              );
            }}
          />
        </KeepTogether>
      ))}
    </>
  );
};

export default Skills;
