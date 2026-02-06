import CustomSection from "./CustomSection";
import Languages from "./Languages";

const OtherInfo = () => {
  return (
    <div className="grid divide-y">
      <Languages />
      <div className="pt-6">
        <p>More section</p>

        <CustomSection />
      </div>
    </div>
  );
};

export default OtherInfo;
