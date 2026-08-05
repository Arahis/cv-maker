import Highlights from "./Highlights";
import UploadResumeButtonHero from "./UploadResumeButtonHero";
import CreateResumeButtonHero from "./CreateResumeButtonHero";
import { HeroImgSvg, HeroBgSvg, TrustPilotSvg } from "./HeroImg";

const Hero = () => {
  return (
    <div className="w-full max-w-full">
      <div className="flex w-full flex-col-reverse md:flex md:flex-row">
        <div className="flex basis-auto flex-col items-start justify-center md:basis-[60%]">
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
              No registration required. Start from scratch or upload your
              existing resume.
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
        <div className="relative w-full basis-auto pt-15 md:basis-[40%]">
          <div className="relative mx-auto w-full max-w-200 overflow-visible md:min-w-100">
            <HeroBgSvg className="absolute -top-[15%] -right-[25%] z-0 h-auto w-[130%] max-w-none" />
            <HeroImgSvg className="relative z-10 h-auto w-full" />
            <a
              href="https://www.trustpilot.com/evaluate/cvoop.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Review Cvoop on Trustpilot"
              className="absolute right-[20%] -bottom-[5%] z-20 w-[30%]"
            >
              <TrustPilotSvg className="h-auto w-full" />
            </a>
          </div>
        </div>
      </div>
      {/* <Highlights /> */}
    </div>
  );
};

export default Hero;
