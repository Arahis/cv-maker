import React from "react";
import { formatDate } from "../../utils/formatDate";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  if (!items?.length) return;

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
      items={items}
    />
  );
};

const Skills = ({ items = {} }: { items: ResumeForm["skills"] }) => {
  const skillsToArray = Object.entries(items).map(([head, items]) => ({
    head: head === "technical" ? "Stack" : "Strengths",
    items,
  }));

  if (items.personal?.length === 0 && items.technical?.length === 0)
    return null;

  return (
    <SectionItem
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

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Languages"
      items={items}
      renderItem={(item) => {
        return (
          <React.Fragment key={item.id}>
            <p className="font-bold">{item.languageName}</p>
            <p>{item.languageLevel}</p>
          </React.Fragment>
        );
      }}
    />
  );
};

const SocialLinks = ({ items }: { items: ResumeForm["socialLinks"] }) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Social Links"
      items={items}
      renderItem={(item) => {
        if (!item.linkName) return;
        return (
          <React.Fragment key={item.id}>
            <p className="font-bold">{item.linkName}</p>
            <a
              href={item.linkAddress}
              className="break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.linkAddress}
            </a>
          </React.Fragment>
        );
      }}
    />
  );
};

const CustomSections = ({ items }: { items: ResumeForm["customSections"] }) => {
  if (!items?.length) return;

  return (
    <React.Fragment>
      {items.map((item, idx) => {
        const title = item.sectionName?.trim();
        const sectionItems = item.sectionItems ?? [];

        if (!title) return null;
        if (sectionItems.length === 0) return null;

        return (
          <SectionItem
            key={item.id ?? `${title}-${idx}`}
            title={title}
            items={sectionItems}
            renderItem={(i) => {
              return (
                <React.Fragment key={i.id}>
                  <p className="font-bold">{i.title}</p>
                  <p>{i.value}</p>
                </React.Fragment>
              );
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const { educations, skills, languages, customSections, socialLinks } = data;

  return (
    <Paginate.Section className="space-y-8">
      <Education items={educations} />

      <Skills items={skills} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </Paginate.Section>
  );
};

export default RightSection;
