import { ResumeForm } from "@cv-maker/shared";
import { ColumnsRegion } from "../../pagination/Pagination.js";

const Contacts = ({ data }: { data: ResumeForm }) => {
  const { phone, country, city, email, socialLinks } = data;

  return (
    <ColumnsRegion
      className="mb-4"
      gridTemplateColumns="fit-content(40%) minmax(0, 60%)"
      rightColumn={
        <div className="space-y-2">
          {socialLinks?.map((link) => (
            <p className="text-[16px]" key={link.id}>
              <span className="font-semibold">{link.linkName}: </span>
              {link.linkAddress}
            </p>
          ))}
        </div>
      }
      leftColumn={
        <div className="space-y-2">
          {phone && (
            <p className="text-[16px]">
              <span className="font-semibold">Phone: </span>
              {phone}
            </p>
          )}
          {email && (
            <p className="text-[16px]">
              <span className="font-semibold">Email: </span>
              {email}
            </p>
          )}
          {(country || city) && (
            <p className="text-[16px]">
              <span className="font-semibold">Current Location: </span>
              {country}
              {country && city && ", "}
              {city}
            </p>
          )}
        </div>
      }
    />
  );
};

export default Contacts;
