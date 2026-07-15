import { ResumeForm } from "@/lib/validation";
import { Paginate } from "../../Paginate";

const HeaderSection = ({
  data,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <Paginate.Section className="border-b-6 border-gray-600 p-8 px-10 text-center">
      <p className="font-cantata mb-4 text-3xl uppercase">
        {data.firstName} {data.lastName}
      </p>
      <p className="font-cantata text-3xl">{data.jobTitle}</p>
    </Paginate.Section>
  );
};

export default HeaderSection;
