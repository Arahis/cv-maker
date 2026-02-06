import CustomSection from "./CustomSection";
import Languages from "./Languages";

const OtherInfo = () => {
  return (
    <div className="grid divide-y-2">
      <Languages />
      <div className="pt-6">
        <p className="font-semibold">Additional information</p>

        <CustomSection />
      </div>
    </div>
  );
};

export default OtherInfo;
