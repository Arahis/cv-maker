import { ResumeForm } from "@cv-maker/shared";
import { KeepTogether } from "../../pagination/Pagination.js";
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
    <SectionItem
      title="Skills"
      items={skillsToArray}
      renderItem={(item) => {
        if (!item?.head) return null;

        return (
          <KeepTogether key={item.head}>
            <div className="mb-2">
              <p className="font-bold">{item.head}</p>
              <p>{item.items.map((i) => i.name).join(", ")}</p>
            </div>
          </KeepTogether>
        );
      }}
    />
  );
};

export default Skills;
