import React from "react";

import type { ResumeForm } from "@cv-maker/shared";
import {
  isEducationFilled,
  isLanguageFilled,
  isSocialFilled,
} from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import { KeepTogether } from "../../pagination/Pagination.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatUrl } from "../../utils/formatUrl.js";

const Contacts = ({
  items,
}: {
  items: Pick<ResumeForm, "phone" | "city" | "country" | "email">[];
}) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Contact Information"
      renderItem={({ phone, city, country, email }) => (
        <div className="space-y-1 mb-16">
          {phone && <p className="grow-0">{phone}</p>}
          {email && <p className="grow-0">{email}</p>}
          {(country || city) && (
            <p className="grow-0">
              {country}
              {country && city && ", "}
              {city}
            </p>
          )}
        </div>
      )}
      items={items}
    />
  );
};

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  const hasEducation = items?.some(isEducationFilled);

  if (!hasEducation) return null;

  return (
    <SectionItem
      title="Education"
      itemsContainerClassName="space-y-4"
      renderItem={({
        degree,
        institution,
        city,
        startDate,
        endDate,
        isFullDate,
      }) => (
        <KeepTogether>
          <p className="font-bold">{degree}</p>
          <p className="mb-2">{institution}</p>
          <p>
            <i>{city}</i>
          </p>
          {startDate && endDate && (
            <p>{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
          )}
        </KeepTogether>
      )}
      items={items}
    />
  );
};

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
          <div key={item.head} className="text-[14px] ">
            <p className="font-bold">{item.head}</p>
            <p>{item?.items?.map((i) => i.name).join(", ")}</p>
          </div>
        );
      }}
    />
  );
};

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <KeepTogether>
      <SectionItem
        title="Languages"
        items={items}
        renderItem={(item) => {
          if (!item.languageName) return;
          return (
            <div key={item.id} className="text-[14px]">
              <p>
                <span className="font-bold">{item.languageName}</span>{" "}
                {item.languageLevel}
              </p>
            </div>
          );
        }}
      />
    </KeepTogether>
  );
};

const SocialLinks = ({ items }: { items: ResumeForm["socialLinks"] }) => {
  const hasLinks = items?.some(isSocialFilled);

  if (!hasLinks) return;

  return (
    <KeepTogether>
      <SectionItem
        title="Social Links"
        items={items}
        renderItem={(item) => {
          if (!item.linkName) return;
          return (
            <div key={item.id} className="text-[14px]">
              <p className="font-bold">{item.linkName}</p>
              <a
                href={item.linkAddress}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatUrl(item.linkAddress)}
              </a>
            </div>
          );
        }}
      />
    </KeepTogether>
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
          <KeepTogether key={item.id ?? `${title}-${idx}`}>
            <SectionItem
              title={title}
              items={sectionItems}
              renderItem={(i) => {
                return (
                  <div key={i.id} className="text-[14px]">
                    <p className="font-bold">{i.title}</p>
                    <p>{formatUrl(i.value)}</p>
                  </div>
                );
              }}
            />
          </KeepTogether>
        );
      })}
    </React.Fragment>
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const {
    educations,
    skills,
    languages,
    customSections,
    socialLinks,
    phone,
    country,
    city,
    email,
  } = data;
  const hasAnyValue = [phone, country, city, email].some(
    (v) => typeof v === "string" && v.trim() !== "",
  );
  const contacts = hasAnyValue ? [{ phone, country, city, email }] : [];

  return (
    <div className="space-y-16 pr-4" datatype="left-section">
      <Contacts items={contacts} />

      <Education items={educations} />

      <Skills skills={skills} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </div>
  );
};

export default RightSection;
