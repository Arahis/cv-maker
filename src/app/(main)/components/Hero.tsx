import Highlights from "./Highlights";
import MainCreateNewResumeButton from "./MainCreateNewResumeButton";

const Hero = () => {
  return (
    <div>
      <div className="py-8">
        <p className="font-tech text-lg font-semibold text-gray-500 md:mb-2">
          <span className="pr-2 font-bold text-red-700">[</span>
          <span className="bg-blue-100">
            We’re still building this site, but you’re welcome to use it.
          </span>
          <span className="pl-2 font-bold text-red-700">]</span>
        </p>
      </div>
      <div className="flex h-[50vh] flex-col items-center justify-center md:h-[60vh]">
        <div className="font-brand mb-8 md:mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Make your resume go WOOP!
          </h1>
          <h2 className="mb-8 text-2xl font-bold md:mb-16 md:text-4xl">
            Build a resume that gets you hired —{" "}
            <span className="gradient-underline">for free</span>.
          </h2>
          <h3 className="font-tech font-semibold md:text-xl">
            Free resume templates that actually look good.
          </h3>
        </div>
        <MainCreateNewResumeButton />
      </div>
      <Highlights />
    </div>
  );
};

export default Hero;
