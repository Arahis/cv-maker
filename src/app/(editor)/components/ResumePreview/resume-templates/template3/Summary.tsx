import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";
import SectionItem from "./SectionItem";
import { ResumeForm } from "@/lib/validation";
import { EMPTY_LEXICAL_STATE } from "@/lib/formUtils";

const Summary = ({ data }: { data: ResumeForm }) => {
  if (!data.summary) return;

  const summary = data.summary || EMPTY_LEXICAL_STATE;
  return (
    <Paginate.Section
      datatype="main-summary"
      className="border-b border-yellow-400 py-8"
    >
      <SectionItem
        title="Summary"
        items={[summary]}
        renderItem={(item) => <TextReader value={item} />}
      />
    </Paginate.Section>
  );
};

export default Summary;
