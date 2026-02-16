import React from "react";
import SectionItem from "../SectionItem";
import { Paginate } from "../../../Paginate";
import { formatDate } from "../../../utils/formatDate";
import { ResumeForm } from "@/lib/validation";
import {
  isEducationFilled,
  isLanguageFilled,
  isSocialFilled,
} from "../../../lib/isSectionFilled";
import { formatUrl } from "../../../utils/formatUrl";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  const hasEducation = items?.some(isEducationFilled);

  if (!hasEducation) return null;

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
          <p className="text-[16px] font-bold">{degree}</p>
          <p className="mb-1 text-[16px]">{institution}</p>
          <p>{city}</p>
          {startDate && endDate && (
            <p>{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
          )}
        </div>
      )}
      items={items}
    />
  );
};

const Skills = ({ items = {} }: { items: ResumeForm["skills"] }) => {
  const skillsToArray = Object.entries(items).map(([head, items]) => ({
    head,
    items,
  }));

  if (items.personal?.length === 0 && items.technical?.length === 0)
    return null;

  return (
    <SectionItem
      title="Skills"
      items={skillsToArray}
      renderItem={(item) => {
        if (item?.items?.length === 0) return null;

        return (
          <React.Fragment key={item.head}>
            <p className="font-bold">#{item.head}</p>
            <p>{item.items.map((i) => i.name).join(", ")}</p>
          </React.Fragment>
        );
      }}
    />
  );
};

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <SectionItem
      title="Languages"
      items={items}
      renderItem={(item) => {
        if (!item.languageName) return;
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
  const hasLinks = items?.some(isSocialFilled);

  if (!hasLinks) return;

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
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatUrl(item.linkAddress)}
            </a>
          </React.Fragment>
        );
      }}
    />
  );
};

const CustomSections = ({ items }: { items: ResumeForm["customSections"] }) => {
  if (items?.length === 0) return;

  return (
    <React.Fragment>
      {items?.map((item, idx) => {
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
                  <p>{formatUrl(i.value)}</p>
                </React.Fragment>
              );
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

const LeftSection = ({ data }: { data: ResumeForm }) => {
  const { educations, skills, languages, customSections, socialLinks } = data;

  return (
    <Paginate.Section
      className="w-[30%] space-y-6 pr-4"
      datatype="left-section"
    >
      <Education items={educations} />

      <Skills items={skills} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </Paginate.Section>
  );
};

export default LeftSection;
