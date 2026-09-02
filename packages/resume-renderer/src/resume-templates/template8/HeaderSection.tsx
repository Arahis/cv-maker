import { ResumeForm } from "@cv-maker/shared";

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  return (
    <div className="font-brand mb-6">
      <p className="mb-1 text-2xl">
        {data.firstName} {data.lastName}
      </p>
      <p className="text-2xl font-semibold">{data.jobTitle}</p>
    </div>
  );
};

export default HeaderSection;
