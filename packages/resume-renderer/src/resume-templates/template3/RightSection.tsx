import { ResumeForm } from "@cv-maker/shared";
import {
  isEducationFilled,
  isLanguageFilled,
  isSocialFilled,
} from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import React from "react";
import { formatUrl } from "../../utils/formatUrl.js";
import { KeepTogether } from "../../pagination/Pagination.js";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  const hasEducation = items?.some(isEducationFilled);

  if (!hasEducation) return null;

  return (
    <SectionItem
      title="Education"
      className="space-y-4"
      renderItem={({
        degree,
        institution,
        city,
        startDate,
        endDate,
        isFullDate,
      }) => (
        <KeepTogether>
          <p className="mb-2 text-[16px] font-bold">{degree}</p>
          <p className="text-[16px]">{institution}</p>
          <div className="mb-0.5">
            {startDate && (
              <p className="mr-2">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
            )}
            {city && <p className="italic">{city}</p>}
          </div>
        </KeepTogether>
      )}
      items={items}
    />
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
            <div key={item.id}>
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

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <KeepTogether>
      <SectionItem
        title="Languages"
        items={items}
        renderItem={(item) => {
          return (
            <div key={item.id}>
              <p className="font-bold">{item.languageName}</p>
              <p>{item.languageLevel}</p>
            </div>
          );
        }}
      />
    </KeepTogether>
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
          <KeepTogether key={item.id ?? `${title}-${idx}`}>
            <SectionItem
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
          </KeepTogether>
        );
      })}
    </React.Fragment>
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const { educations, languages, customSections, socialLinks } = data;

  return (
    <div className="space-y-8 py-8 ">
      <Education items={educations || []} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </div>
  );
};

export default RightSection;
