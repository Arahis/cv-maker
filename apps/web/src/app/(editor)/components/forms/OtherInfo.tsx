import CustomSection from "./CustomSection";
import Languages from "./Languages";
import SocialLinks from "./SocialLinks";

const OtherInfo = () => {
  return (
    <div className="grid space-y-6 divide-y-2 [&>*:not(:last-child)]:pb-6">
      <Languages />
      <SocialLinks />
      <div>
        <p className="font-semibold">Additional information</p>

        <CustomSection />
      </div>
    </div>
  );
};

export default OtherInfo;
