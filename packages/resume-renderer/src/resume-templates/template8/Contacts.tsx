import { ResumeForm } from "@cv-maker/shared";

const Contacts = ({ data }: { data: ResumeForm }) => {
  const { phone, country, city, email } = data;

  return (
    <div className="space-y-1 text-right">
      {phone && <p className="text-[16px]">{phone}</p>}
      {email && <p className="text-[16px]">{email}</p>}
      {(country || city) && (
        <p className="text-[16px]">
          {country}
          {country && city && ", "}
          {city}
        </p>
      )}
    </div>
  );
};

export default Contacts;
