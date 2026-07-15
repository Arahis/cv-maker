import { ResumeForm } from "@/lib/validation";
import { Paginate } from "../../Paginate";
import Summary from "./Summary";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <Paginate.Columns className="">
      <div className="w-[30%]">
        {photo && (
          <Paginate.Section
            className="aspect-square w-40 rounded-full bg-gray-50 bg-cover bg-center outline-1 outline-offset-4"
            style={{
              backgroundImage: photo ? `url(${photo})` : undefined,
            }}
          ></Paginate.Section>
        )}
      </div>
      <div className="w-[70%] pl-6">
        <div className="mb-4">
          <p className="font-brand text-3xl font-bold">Hi! I&apos;m</p>
          <p className="font-brand mb-1 text-3xl font-bold">
            {data.firstName} {data.lastName}
          </p>
          <p className="font-brand text-xl uppercase">{data.jobTitle}</p>
        </div>
        <Summary data={data.summary} />
      </div>
    </Paginate.Columns>
  );
};

export default HeaderSection;
