import Highlights from "./Highlights";
import UploadResumeButtonHero from "./UploadResumeButtonHero";
import CreateResumeButtonHero from "./CreateResumeButtonHero";

const Hero = () => {
  return (
    <div>
      <h1 className="sr-only">
        Free resume and CV builder with modern templates
      </h1>

      <div className="flex h-[60vh] flex-col items-center justify-center md:h-[70vh]">
        <div className="font-brand mb-8 pt-12 md:mb-16 md:pt-24">
          <p className="mb-4 text-4xl font-bold md:text-6xl">
            Make your resume go WOOP!
          </p>
          <h2 className="mb-8 text-2xl font-bold md:text-4xl">
            A fast and modern resume builder —{" "}
            <span className="gradient-underline">free templates</span>.
          </h2>
          <h3 className="font-tech font-semibold md:text-xl">
            Create a professional resume in minutes — trusted by job seekers
            worldwide.
          </h3>
        </div>
        <div className="flex gap-8">
          <CreateResumeButtonHero />
          <UploadResumeButtonHero />
        </div>
      </div>
      <Highlights />
    </div>
  );
};

export default Hero;
