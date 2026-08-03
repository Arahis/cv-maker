import Highlights from "./Highlights";
import UploadResumeButtonHero from "./UploadResumeButtonHero";
import CreateResumeButtonHero from "./CreateResumeButtonHero";

const Hero = () => {
  return (
    <div>
      <div className="flex flex-col items-start justify-center">
        <div className="font-brand mb-8 pt-12 text-left md:mb-16 md:pt-18">
          <h1 className="mb-8 text-4xl leading-[1.1] font-bold md:text-6xl">
            Build and Download
            <br /> Your First Resume <br />
            Completely <span className="gradient-underline">Free</span>
          </h1>
          <h2 className="sr-only text-2xl font-bold md:not-sr-only md:mb-8 md:text-4xl">
            Choose from our modern templates
          </h2>
          <h3 className="font-tech font-semibold md:w-[50%] md:text-xl">
            No registration required. Start from scratch or upload your existing
            resume.
          </h3>
        </div>
        <div className="align-center flex w-full flex-col gap-4 md:flex-row md:gap-8 md:align-top">
          <CreateResumeButtonHero />
          <div className="flex flex-col">
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
