import Highlights from "./Highlights";
import MainCreateNewResumeButton from "./MainCreateNewResumeButton";

const Hero = () => {
  return (
    <div>
      <h1 className="sr-only">Free resume builder</h1>
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
          <p className="mb-4 text-4xl font-bold md:text-6xl">
            Make your resume go WOOP!
          </p>
          <h2 className="mb-8 text-2xl font-bold md:mb-16 md:text-4xl">
            A simple and modern resume builder —{" "}
            <span className="gradient-underline">free to use</span>.
          </h2>
          <h3 className="font-tech font-semibold md:text-xl">
            Create a professional resume in minutes.
          </h3>
        </div>
        <MainCreateNewResumeButton />
      </div>
      <Highlights />
    </div>
  );
};

export default Hero;
