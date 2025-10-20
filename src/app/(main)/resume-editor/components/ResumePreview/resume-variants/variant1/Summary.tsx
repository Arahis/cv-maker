import React from "react";
import { Paginate } from "../../Paginate";

const Summary = ({ data }: { data: any }) => {
  if (!data.summary) return;
  return (
    <Paginate.Section className="py-8" datatype="main-summary">
      {data.summary}
    </Paginate.Section>
  );
};

export default Summary;
