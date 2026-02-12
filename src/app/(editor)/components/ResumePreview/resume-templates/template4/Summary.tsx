import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";
import SectionItem from "./SectionItem";
import { ResumeForm } from "@/lib/validation";
import { EMPTY_LEXICAL_STATE } from "@/lib/formDefaults";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  if (!data) return;

  const summary = data || EMPTY_LEXICAL_STATE;
  return (
    <Paginate.Section datatype="main-summary">
      <SectionItem
        title="Summary"
        items={[summary]}
        renderItem={(item) => <TextReader value={item} />}
      />
    </Paginate.Section>
  );
};

export default Summary;
