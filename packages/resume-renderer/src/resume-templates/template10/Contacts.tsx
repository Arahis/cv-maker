import { ResumeForm } from "@cv-maker/shared";

const Contacts = ({ data }: { data: ResumeForm }) => {
  const { phone, country, city, email } = data;

  return (
    <div className="space-y-1 text-right">
      {phone && <p>{phone}</p>}
      {email && <p>{email}</p>}
      {(country || city) && (
        <p>
          {country}
          {country && city && ", "}
          {city}
        </p>
      )}
    </div>
  );
};

export default Contacts;
