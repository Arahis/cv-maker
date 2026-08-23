import { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { createTextReader, TextReader } from "../../text-reader.js";
import SectionItem from "./SectionItem.js";
import { FullWidthRegion } from "../../pagination/Pagination.js";

const Summary = ({ data }: { data: ResumeForm }) => {
  const summary = data.summary || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;
  return (
    <FullWidthRegion>
      <div datatype="main-summary" className="border-b border-yellow-400 py-8">
        <SectionItem
          title="Summary"
          items={[summary]}
          renderItem={(item) => <TextReader value={item} />}
        />
      </div>
    </FullWidthRegion>
  );
};

export default Summary;
