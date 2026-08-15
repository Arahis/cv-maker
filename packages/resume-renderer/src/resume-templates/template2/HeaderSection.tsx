import { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import { createTextReader, TextReader } from "../../text-reader.js";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;
  return <TextReader value={summary} />;
};

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  return (
    <ColumnsRegion
      columnRatio={{ left: 70, right: 30 }}
      className="mb-8 border-b border-gray-500 pb-8"
      leftColumn={
        <div className="flex-1 text-sm">
          <div className="mb-4 flex">
            <p className="pr-6 text-2xl font-bold">
              {`${data.firstName || "First"} ${data.lastName || "Last"}`}
            </p>
            <div className="border-l-4 border-gray-500 pl-6">
              <p className="text-2xl font-bold text-gray-500">
                {data.jobTitle || "Profession"}
              </p>
            </div>
          </div>
          <div>
            <Summary data={data.summary} />
          </div>
        </div>
      }
      rightColumnClassName="h-full"
      rightColumn={
        <div className="pl-4 flex flex-col items-center justify-center h-full">
          <div>
            <p>
              {data.city}, {data.country}
            </p>
            <p>{data.phone}</p>
            <p>{data.email}</p>
          </div>
        </div>
      }
    ></ColumnsRegion>
  );
};

export default HeaderSection;
