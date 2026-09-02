import { ResumeForm } from "@cv-maker/shared";

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  return (
    <div className="border-b-2 font-brand border-gray-600 pb-8  mb-6">
      <p className=" mb-2 text-3xl">
        {data.firstName} {data.lastName}
      </p>
      <p className="text-4xl font-semibold">{data.jobTitle}</p>
    </div>
  );
};

export default HeaderSection;
