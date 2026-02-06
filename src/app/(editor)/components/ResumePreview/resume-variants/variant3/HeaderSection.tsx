import { ResumeForm } from "@/lib/validation";
import { Paginate } from "../../Paginate";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string;
}) => {
  return (
    <Paginate.Section className="border-b border-yellow-400 pb-8">
      <Paginate.Columns className="mb-8 items-center gap-8">
        <div className="w-[70%]">
          <p className="text-xl italic">Hello!</p>
          <div className="mb-1">
            <p className="text-3xl font-semibold">
              {data.firstName} {data.lastName}
            </p>
          </div>
          <p className="text-4xl font-bold">{data.jobTitle}</p>
        </div>

        <Paginate.Section
          className="aspect-square w-[20%] rounded-full bg-gray-50 bg-cover bg-center outline-1 outline-offset-4 outline-yellow-400"
          style={{
            backgroundImage: photo ? `url(${photo})` : undefined,
          }}
        ></Paginate.Section>
      </Paginate.Columns>
      <div className="grid grid-cols-3">
        <div>
          <p className="font-semibold">Phone</p>
          <p className="text-[16px]">{data.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p className="text-[16px]">{data.email}</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p className="text-[16px]">
            {data.country}, {data.city}
          </p>
        </div>
        <div></div>
      </div>
    </Paginate.Section>
  );
};

export default HeaderSection;
