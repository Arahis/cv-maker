import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";

const Summary = ({ data }: { data: any }) => {
  if (!data.summary) return;
  return (
    <Paginate.Section className="py-8" datatype="main-summary">
      <TextReader value={data.summary} />
    </Paginate.Section>
  );
};

export default Summary;
