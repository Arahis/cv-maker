import React from "react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { ResumeForm } from "@cv-maker/shared";
import SectionItem from "./SectionItem.js";
import {
  isEducationFilled,
  isLanguageFilled,
  isSocialFilled,
} from "../../lib/isSectionFilled.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatUrl } from "../../utils/formatUrl.js";
import { KeepTogether } from "../../pagination/Pagination.js";

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

const Contacts = ({
  items,
}: {
  items: Pick<ResumeForm, "phone" | "city" | "country" | "email">[];
}) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Contacts"
      renderItem={({ phone, city, country, email }) => {
        return (
          <div className="space-y-2">
            {phone && (
              <div className="flex">
                <Phone className="mr-2 w-4" />
                <p className="text-[16px]">{phone}</p>
              </div>
            )}
            {email && (
              <div className="flex">
                <Mail className="mr-2 w-4" />
                <p className="text-[16px]">{email}</p>
              </div>
            )}
            {(country || city) && (
              <div className="flex">
                <MapPin className="mr-2 w-4" />
                <p className="text-[16px]">
                  {country}
                  {country && city && ", "}
                  {city}
                </p>
              </div>
            )}
          </div>
        );
      }}
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
      items={items}
      className="space-y-4"
      renderItem={({
        degree,
        institution,
        city,
        startDate,
        endDate,
        isFullDate,
      }) => (
        <div>
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
            <React.Fragment key={item.id}>
              <p className="font-bold">{item.languageName}</p>
              <p>{item.languageLevel}</p>
            </React.Fragment>
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
                  <div key={i.id}>
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

const LeftSection = ({ data }: { data: ResumeForm }) => {
  const {
    educations,
    languages,
    customSections,
    phone,
    country,
    city,
    email,
    socialLinks,
  } = data;

  const hasAnyValue = [phone, country, city, email].some(
    (v) => typeof v === "string" && v.trim() !== "",
  );
  const contacts = hasAnyValue ? [{ phone, country, city, email }] : [];

  return (
    <div className="space-y-8 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-600 [&>*:not(:last-child)]:pb-8">
      <Contacts items={contacts} />

      <Education items={educations} />

      <Skills skills={data.skills} />
      <SocialLinks items={socialLinks} />
      <Languages items={languages} />

      <CustomSections items={customSections} />
    </div>
  );
};

export default LeftSection;
