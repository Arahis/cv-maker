import { ResumeForm } from "@cv-maker/shared";
import React from "react";
import SectionItem from "./SectionItem.js";
import { isSocialFilled } from "../../lib/isSectionFilled.js";

const SocialLinks = ({ items }: { items: ResumeForm["socialLinks"] }) => {
  const hasLinks = items?.some(isSocialFilled);
  if (!hasLinks) return;

  return (
    <SectionItem
      title="Social links"
      items={items}
      renderItem={({ id, linkName, linkAddress }) => {
        return (
          <div key={id}>
            <p>
              <span className="font-semibold">{linkName}: </span>
              {linkAddress}
            </p>
          </div>
        );
      }}
    />
  );
};

export default SocialLinks;
