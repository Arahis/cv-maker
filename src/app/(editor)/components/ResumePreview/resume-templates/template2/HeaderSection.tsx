import { ResumeForm } from "@/lib/validation";
import { Paginate } from "../../Paginate";
import { createTextReader, TextReader } from "@/components/editor";
import { EMPTY_LEXICAL_STATE } from "@/lib/formDefaults";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;
  return <TextReader value={summary} />;
};

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  return (
    <Paginate.Columns className="mb-8 border-b border-gray-500 pb-8">
      <div className="flex w-full items-center">
        <div className="w-[70%] flex-1">
          <div className="mb-4 flex">
            <Paginate.Text className="pr-6 text-2xl font-bold">
              {`${data.firstName || "First"} ${data.lastName || "Last"}`}
            </Paginate.Text>
            <div className="border-l-4 border-gray-500 pl-6">
              <Paginate.Text className="text-2xl font-bold text-gray-500">
                {data.jobTitle || "Profession"}
              </Paginate.Text>
            </div>
          </div>
          <div className="w-[80%]">
            <Summary data={data.summary} />
          </div>
        </div>
        <div className="w-[30%] pl-4">
          <Paginate.Text>
            {data.city}, {data.country}
          </Paginate.Text>
          <Paginate.Text>{data.phone}</Paginate.Text>
          <Paginate.Text>{data.email}</Paginate.Text>
        </div>
      </div>
    </Paginate.Columns>
  );
};

export default HeaderSection;
