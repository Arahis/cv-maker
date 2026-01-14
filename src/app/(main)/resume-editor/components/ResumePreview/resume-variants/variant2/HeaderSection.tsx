import { ResumeForm } from "@/lib/validation";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  return (
    <Paginate.Section className="mb-8 flex border-b border-gray-500 pb-8">
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
            <TextReader value={data.summary} />
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
    </Paginate.Section>
  );
};

export default HeaderSection;
