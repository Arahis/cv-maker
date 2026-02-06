import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";
import { EMPTY_LEXICAL_STATE } from "@/lib/formUtils";

const Summary = ({ data }: { data: any }) => {
  if (!data.summary) return;

  const summary = data.summary || EMPTY_LEXICAL_STATE;
  return (
    <Paginate.Section className="py-8" datatype="main-summary">
      <TextReader value={summary} />
    </Paginate.Section>
  );
};

export default Summary;
