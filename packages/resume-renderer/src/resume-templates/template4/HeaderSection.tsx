import { ResumeForm } from "@cv-maker/shared";

const HeaderSection = ({
  data,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <div className="border-b-6 border-gray-600 py-8 pb-8 text-center mb-8">
      <p className="font-cantata mb-4 text-3xl uppercase">
        {data.firstName} {data.lastName}
      </p>
      <p className="font-cantata text-3xl">{data.jobTitle}</p>
    </div>
  );
};

export default HeaderSection;
