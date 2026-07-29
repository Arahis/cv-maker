import Highlights from "./Highlights";
import UploadResumeButtonHero from "./UploadResumeButtonHero";
import CreateResumeButtonHero from "./CreateResumeButtonHero";

const Hero = () => {
  return (
    <div>
      <div className="flex h-[50vh] flex-col items-start justify-center md:h-[60vh]">
        <div className="font-brand mb-8 pt-12 text-left md:mb-16 md:pt-24">
          <h1 className="mb-8 text-4xl leading-[1.1] font-bold md:text-6xl">
            Build and Download
            <br /> Your First Resume <br />
            Completely <span className="gradient-underline">Free</span>
          </h1>
          <h2 className="mb-2 text-2xl font-bold md:text-4xl">
            Choose from our modern templates
          </h2>
          <h3 className="font-tech w-[50%] font-semibold md:text-xl">
            No registration required for your first CV. Upload your old resume
            to parse data instantly, or build from scratch using modern,
            ATS-friendly templates.
          </h3>
        </div>
        <div className="flex gap-8 align-top">
          <CreateResumeButtonHero />
          <div>
            <UploadResumeButtonHero />
            <p className="mt-2 text-sm font-semibold text-gray-400">
              PDF supported (DOCX and TXT coming soon)
            </p>
          </div>
        </div>
      </div>
      {/* <Highlights /> */}
    </div>
  );
};

export default Hero;
